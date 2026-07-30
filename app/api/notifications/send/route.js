/**
 * POST /api/notifications/send
 *
 * Publishes a notification envelope to the AWS SQS queue consumed by the
 * eygarnotification microservice.  Supported channels: email, sms.
 *
 * Expected body:
 *   { channel: "email"|"sms", recipient: string, subject?: string, body: string }
 */

import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

const sqsClient = new SQSClient({
    region: process.env.AWS_REGION_NAME || "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const SQS_QUEUE_URL = process.env.AWS_SQS_QUEUE_URL;

function makeEventId() {
    return `evt_${randomBytes(6).toString("hex")}`;
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

        if (!SQS_QUEUE_URL) {
            return NextResponse.json(
                { error: "SQS queue URL is not configured on the server." },
                { status: 500 }
            );
        }

        const channelUpper = channel.toUpperCase(); // "EMAIL" | "SMS"
        const template     = channelUpper === "EMAIL" ? "HOST_MESSAGE" : "HOST_SMS";
        const eventType    = channelUpper === "EMAIL" ? "HostGuestEmail" : "HostGuestSMS";

        // Build the NotificationEnvelope in the format the SQS consumer expects.
        const envelope = {
            event_id:    makeEventId(),
            event_type:  eventType,
            notification: {
                template,
                channels: [channelUpper],
            },
            recipient: {
                // SQS consumer reads "email" key for EMAIL channel, "phone" for SMS.
                ...(channelUpper === "EMAIL"  ? { email: recipient } : {}),
                ...(channelUpper === "SMS"    ? { phone: recipient } : {}),
                ...(channelUpper === "WHATSAPP" ? { phone: recipient } : {}),
            },
            variables: {
                body:     body,
                subject:  subject || "Message from your Eygar Host",
                app_name: "EYGAR",
            },
        };

        const cmd = new SendMessageCommand({
            QueueUrl:    SQS_QUEUE_URL,
            MessageBody: JSON.stringify(envelope),
            MessageAttributes: {
                event_type: {
                    DataType:    "String",
                    StringValue: eventType,
                },
                template: {
                    DataType:    "String",
                    StringValue: template,
                },
            },
        });

        const result = await sqsClient.send(cmd);

        return NextResponse.json({
            success: true,
            messageId: result.MessageId,
        });
    } catch (err) {
        console.error("[SQS notify] Failed to publish message:", err);
        return NextResponse.json(
            { error: err.message || "Failed to send notification." },
            { status: 500 }
        );
    }
}
