"use client"

import React, {useState} from "react";
import {AlertCircle, Brain, Loader2, Sparkles} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ChartAreaInteractive} from "@/components/dashboard/chart-area-interactive";
import {AreaChartData} from "@/utils/area-chart-data";
import {TimeFrame, PredictionResult} from "@/utils/types";
import {predictTrafficAction} from "@/utils/actions";
import type {ChartConfig} from "@/components/ui/chart";
import {Button} from '@/components/ui/button';
import { useRouter } from "next/navigation";
import AIEnginePulseComponent from "@/components/predictions/AIEnginePulseComponent";

interface PredictionComponentProps {
    title: string;
    description: string;
    initialChartData: AreaChartData;
    category: "visitors" | "orders";
    chartConfig: ChartConfig;
    modelDetails: { label: string; value: string }[];
}

function PredictionComponent({
    title,
    description,
    initialChartData,
    category,
    chartConfig,
    modelDetails
}: PredictionComponentProps) {
    const router = useRouter()
    const [timeframe, setTimeFrame] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const [predictionText, setPredictionText] = useState<string>("Predicting...")
    const [chartData, setChartData] = useState<AreaChartData>(initialChartData)
    const [predictions, setPredictions] = useState<{ date: string; desktop: number; mobile: number }[] | null>(null)

    const constructDates = (val: TimeFrame) => {
        const lastDate = initialChartData[initialChartData.length - 1].date
        const dates = []
        let days = 0
        switch (val) {
            case "next 7 days":
                days = 7
                break
            case "next 30 days":
                days = 30
                break
            case "next 3 months":
                days = 90
                break
        }

        if (days > 0) {
            setPredictionText(`Predicting for the next ${days} days...`)
            for (let i = 1; i <= days; i++) {
                const date = new Date(lastDate);
                date.setDate(date.getDate() + i); // add a day (STANDARD WAY)
                const dateString = date.toISOString().split('T')[0]; // convert back to string
                dates.push(dateString);
            }
            return dates
        }
    }

    const getPredictions = async (dates: string[]) => {
        const predictions: PredictionResult[] = []
        for (let i = 0; i < dates.length; i++) {
            const date = dates[i]
            setPredictionText(`Predicting for (${i + 1}/${dates.length})...`)
            const prediction = await predictTrafficAction(date, category)
            if (prediction && 'desktop' in prediction) {
                const mobile = (prediction as PredictionResult).mobile || 0
                const desktop = (prediction as PredictionResult).desktop || 0
                const data = {date, desktop, mobile}
                predictions.push(data)
            }
        }
        return predictions
    }

    const handlePredict = async (val: TimeFrame) => {
        setIsLoading(true)
        setTimeFrame(val)
        try {
            const dates = constructDates(val)
            if (dates) {
                const predictions = await getPredictions(dates)
                setPredictions(predictions)
                setChartData([...initialChartData, ...predictions.map(({date, desktop, mobile}) => ({date, desktop, mobile}))])
            }
        } finally {
            setIsLoading(false)
        }
    }

    const timeframes: TimeFrame[] = [
        "next 7 days", "next 30 days", "next 3 months"
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
                        {title}
                    </h1>
                    <p className="text-lg text-neutral-500 max-w-2xl">
                        {description}
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
                                    <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Configure Timeframe</label>
                                    <Select onValueChange={handlePredict} disabled={isLoading} value={timeframe}>
                                        <SelectTrigger className="w-full h-12 bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                                            {isLoading ? (
                                            <div className="flex items-center gap-2" aria-live="polite" aria-atomic="true">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span
                                                    key={predictionText}
                                                    className="animate-in fade-in slide-in-from-top-2 duration-300"
                                                >
                                                    {predictionText}
                                                </span>
                                            </div>
                                        ) : (
                                            <SelectValue placeholder="Choose a timeframe..." />
                                        )}
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timeframes.map(t => (
                                                <SelectItem key={t} value={t}>{t}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                        Predictions are generated using the <strong>{category === "visitors" ? "Visitor" : "Order"} Prediction Model</strong> trained on 2024-2025 bar chart datasets.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Button onClick={() => {
                            setPredictions(null)
                            setChartData(initialChartData)
                            setTimeFrame("")
                            router.refresh()
                        }} type={"reset"} className={"w-full capitalize cursor-pointer"} disabled={isLoading}>Reset</Button>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        {predictions ? (
                           <ChartAreaInteractive chartData={chartData} title={`Predicted ${category.charAt(0).toUpperCase() + category.slice(1)} Data`} chartConfig={chartConfig}/>
                        ) : (
                            <div className="px-4 lg:px-6">
                                <ChartAreaInteractive chartData={chartData} title={`Original ${category.charAt(0).toUpperCase() + category.slice(1)} Data`}/>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-8">
                    {modelDetails.map((item, i) => (
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

export default PredictionComponent;
