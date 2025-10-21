import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    TrendingUp,
    BarChart3
} from "lucide-react";


const TabAnalytics = () => {
    return (
        <>
            <h2 className="text-xl font-semibold">Analytics & Insights</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Revenue Trends
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                <p className="text-gray-600">
                                    Revenue chart will be displayed here
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Booking Trends
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                <p className="text-gray-600">
                                    Booking trends chart will be displayed here
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                            89%
                        </div>
                        <div className="text-sm text-gray-600">
                            Occupancy Rate
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                            4.9
                        </div>
                        <div className="text-sm text-gray-600">Avg Rating</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                            24h
                        </div>
                        <div className="text-sm text-gray-600">
                            Response Time
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600 mb-1">
                            92%
                        </div>
                        <div className="text-sm text-gray-600">
                            Guest Satisfaction
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default TabAnalytics;
