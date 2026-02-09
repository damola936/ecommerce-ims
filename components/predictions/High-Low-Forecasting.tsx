"use client"

import {AlertCircle, Brain, Loader2, Sparkles, TrendingDown, TrendingUp} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import React, {useState} from "react";
import {HiLoOrder} from "@/utils/actions";
import {categoryModel} from "@/utils/categorical";
import {Button} from "@/components/ui/button";
import {visitorsChartData} from "@/utils/area-chart-data";
import { useRouter } from "next/navigation";
import AIEnginePulseComponent from "@/components/predictions/AIEnginePulseComponent";

function HighLowForecasting() {
    const [month, setMonth] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const [prediction, setPrediction] = useState<HiLoOrder | null>(null)
    const router = useRouter()

    const handlePredict = async (val: string) => {
        setMonth(val)
        setIsLoading(true)
        try {
            // Using the categoryModel to perform prediction,
            // This solves the "pass in all parameters" issue as the model is pre-built with the data
            const res = await categoryModel.predict(val)
            setPrediction(res)
        } finally {
            setIsLoading(false)
        }
    }

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]
    return (
        <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-950">

            <main className="flex-1 p-4 md:p-8 space-y-8 max-w-5xl mx-auto w-full">
                <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Brain className="w-6 h-6 text-primary" />
                            </div>
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">Prediction Beta</Badge>
                        </div>
                        <AIEnginePulseComponent/>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                        Smart Category Forecasting
                    </h1>
                    <p className="text-lg text-neutral-500 max-w-2xl">
                        Our intelligence engine predicts seasonal category performance by analyzing historical inventory and sales data patterns.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-none shadow-xl bg-white dark:bg-neutral-900 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Sparkles className="w-24 h-24" />
                            </div>
                            <CardHeader>
                                <CardTitle>Control Panel</CardTitle>
                                <CardDescription>Configure the forecasting parameters.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Target Month</label>
                                    <Select onValueChange={handlePredict} disabled={isLoading} value={month}>
                                        <SelectTrigger className="w-full h-12 bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                                            {isLoading ? (
                                                <div className="flex items-center gap-2" aria-live="polite" aria-atomic="true">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span
                                                        key="predicting"
                                                        className="animate-in fade-in slide-in-from-top-2 duration-300"
                                                    >
                                                        Predicting...
                                                    </span>
                                                </div>
                                            ) : (
                                                <SelectValue placeholder="Choose a month..." />
                                            )}
                                        </SelectTrigger>
                                        <SelectContent>
                                            {months.map(m => (
                                                <SelectItem key={m} value={m}>{m}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                        Predictions are generated using the <strong>CategoryModel</strong> trained on 2024-2025 bar chart datasets.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Button onClick={() => {
                            setPrediction(null)
                            setMonth("")
                            router.refresh()
                        }} type={"reset"} className={"w-full capitalize cursor-pointer"}>Reset</Button>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        {prediction ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-500">
                                <Card className="border-none shadow-xl bg-white dark:bg-neutral-900 relative group transition-transform hover:-translate-y-1">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-l-lg" />
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-center">
                                            <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/30">
                                                Forecasted Leader
                                            </Badge>
                                            <TrendingUp className="text-emerald-500 w-5 h-5" />
                                        </div>
                                        <CardTitle className="text-3xl font-bold mt-4">{prediction.highestCategory}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mt-4 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-neutral-500">Predicted Volume</span>
                                                <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{prediction.hNo} units</span>
                                            </div>
                                            <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-emerald-500 h-full w-[85%] rounded-full" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-none shadow-xl bg-white dark:bg-neutral-900 relative group transition-transform hover:-translate-y-1">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 rounded-l-lg" />
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-center">
                                            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/30">
                                                Forecasted Lagging
                                            </Badge>
                                            <TrendingDown className="text-amber-500 w-5 h-5" />
                                        </div>
                                        <CardTitle className="text-3xl font-bold mt-4">{prediction.lowestCategory}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mt-4 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-neutral-500">Predicted Volume</span>
                                                <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{prediction.lNo} units</span>
                                            </div>
                                            <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-amber-500 h-full w-[25%] rounded-full" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full min-h-[400px] border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white/50 dark:bg-neutral-900/50">
                                <div className="relative mb-6">
                                    <Brain className="w-16 h-16 text-neutral-300 dark:text-neutral-700" />
                                    <Sparkles className="w-6 h-6 text-primary absolute -top-1 -right-1 animate-pulse" />
                                </div>
                                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Awaiting Simulation Data</h3>
                                <p className="text-neutral-500 max-w-xs text-center mt-2">
                                    Please select a target month from the control panel to generate a categorical prediction.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-8">
                    {[
                        { label: "Model Architecture", value: "Linear-Seasonal" },
                        { label: "Confidence Score", value: "92.4%" },
                        { label: "Base Dataset", value: "BarChart v2" },
                        { label: "Last Sync", value: "Real-time" }
                    ].map((item, i) => (
                        <div key={i} className="p-4 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-800">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 dark:text-neutral-500 mb-1">{item.label}</p>
                            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{item.value}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default HighLowForecasting;