/**
 * POST /api/notifications/send
 *
 * Publishes a notification envelope to the AWS SQS queue consumed by the
 * eygarnotification microservice. Uses native Node.js crypto and AWS SigV4
 * with zero external dependencies to prevent Turbopack build errors.
 */

import crypto from "crypto";
import { NextResponse } from "next/server";

function sha256(data) {
    return crypto.createHash("sha256").update(data, "utf8").digest("hex");
}

function hmacSha256(key, data) {
    return crypto.createHmac("sha256", key).update(data, "utf8").digest();
}

function getSignatureKey(key, dateStamp, regionName, serviceName) {
    const kDate = hmacSha256("AWS4" + key, dateStamp);
    const kRegion = hmacSha256(kDate, regionName);
    const kService = hmacSha256(kRegion, serviceName);
    const kSigning = hmacSha256(kService, "aws4_request");
    return kSigning;
}

async function sendSqsMessage({ queueUrl, messageBody, messageAttributes }) {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const region = process.env.AWS_REGION_NAME || "ap-south-1";

    if (!accessKeyId || !secretAccessKey || !queueUrl) {
        throw new Error("AWS SQS environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SQS_QUEUE_URL) are missing.");
    }

    const url = new URL(queueUrl);
    const host = url.host;

    const payload = JSON.stringify({
        QueueUrl: queueUrl,
        MessageBody: messageBody,
        MessageAttributes: messageAttributes,
    });

    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, ""); // e.g. 20260730T153000Z
    const dateStamp = amzDate.substring(0, 8); // e.g. 20260730

    const service = "sqs";
    const algorithm = "AWS4-HMAC-SHA256";
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;

    const payloadHash = sha256(payload);

    const headers = {
        "content-type": "application/x-amz-json-1.0",
        "host": host,
        "x-amz-date": amzDate,
        "x-amz-target": "AmazonSQS.SendMessage",
    };

    const signedHeaderKeys = Object.keys(headers).sort();
    const canonicalHeaders = signedHeaderKeys.map((k) => `${k}:${headers[k]}\n`).join("");
    const signedHeadersStr = signedHeaderKeys.join(";");

    const canonicalRequest = [
        "POST",
        url.pathname,
        "",
        canonicalHeaders,
        signedHeadersStr,
        payloadHash,
    ].join("\n");

    const stringToSign = [
        algorithm,
        amzDate,
        credentialScope,
        sha256(canonicalRequest),
    ].join("\n");

    const signingKey = getSignatureKey(secretAccessKey, dateStamp, region, service);
    const signature = crypto.createHmac("sha256", signingKey).update(stringToSign, "utf8").digest("hex");

    const authorizationHeader = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeadersStr}, Signature=${signature}`;

    const res = await fetch(queueUrl, {
        method: "POST",
        headers: {
            ...headers,
            Authorization: authorizationHeader,
        },
        body: payload,
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`SQS API error (${res.status}): ${errorText}`);
    }

    return await res.json();
}

function makeEventId() {
    return `evt_${crypto.randomBytes(6).toString("hex")}`;
}

export async function POST(request) {
    try {
        const { channel, recipient, subject, body } = await request.json();

        if (!channel || !recipient || !body) {
            return NextResponse.json(
                { error: "channel, recipient, and body are required." },
                { status: 400 }
            );
        }

        const queueUrl = process.env.AWS_SQS_QUEUE_URL;

        const channelUpper   = channel.toUpperCase();
        const template       = channelUpper === "EMAIL" ? "HOST_MESSAGE" : "HOST_SMS";
        const eventType      = channelUpper === "EMAIL" ? "HostGuestEmail" : "HostGuestSMS";
        const cleanRecipient = channelUpper === "EMAIL" ? recipient : recipient.replace(/\D/g, "");

        const envelope = {
            event_id: makeEventId(),
            event_type: eventType,
            notification: {
                template,
                channels: [channelUpper],
            },
            recipient: {
                ...(channelUpper === "EMAIL" ? { email: cleanRecipient } : {}),
                ...(channelUpper === "SMS" ? { phone: cleanRecipient } : {}),
                ...(channelUpper === "WHATSAPP" ? { phone: cleanRecipient } : {}),
            },
            variables: {
                body: body,
                subject: subject || "Message from your Eygar Host",
                app_name: "EYGAR",
            },
        };

        const result = await sendSqsMessage({
            queueUrl,
            messageBody: JSON.stringify(envelope),
            messageAttributes: {
                event_type: {
                    DataType: "String",
                    StringValue: eventType,
                },
                template: {
                    DataType: "String",
                    StringValue: template,
                },
            },
        });

        return NextResponse.json({
            success: true,
            result,
        });
    } catch (err) {
        console.error("[SQS notify] Failed to publish message:", err);
        return NextResponse.json(
            { error: err.message || "Failed to send notification." },
            { status: 500 }
        );
    }
}
