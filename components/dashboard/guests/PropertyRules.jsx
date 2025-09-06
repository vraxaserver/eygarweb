import { AlertTriangle, Clock, Shield, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PropertyRules({ rules }) {
    const getRuleIcon = (ruleType) => {
        switch (ruleType) {
            case "safety":
                return <Shield className="h-4 w-4 text-red-500" />;
            case "time":
                return <Clock className="h-4 w-4 text-blue-500" />;
            case "house":
                return <Home className="h-4 w-4 text-green-500" />;
            default:
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Property Rules</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {rules.map((rule, index) => (
                        <div
                            key={index}
                            className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                            {getRuleIcon(rule.type)}
                            <div>
                                <p className="font-medium text-sm">
                                    {rule.title}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                    {rule.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
