"use client"

import {TrendingDown, TrendingUp} from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
    Card, CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import {useIsMobile} from "@/hooks/use-mobile";
import React from "react";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

type BarChartData =
{
    top5Stocks: {
        name: string
        stock: number
    }[]
    bottom5Stocks: {
        name: string
        stock: number
    }[]
}


export const description = "A mixed bar chart"


type FullData = {
    name: string,
    stock: number,
    fill: string
}

function editConfig(data: { name: string, stock: number }[]): ChartConfig {
    const config: Record<string, { label: string; color?: string }> = {
        stock: { label: "stock" },
    }

    data.forEach((item) => {
        config[item.name] = {
            label: item.name, // did not use color property as names can have spaces thereby causing the browser to ignore
        }
    })

    return config as ChartConfig
}

function editChartData(data: {name: string, stock: number}[]): FullData[] {
    const fullData =  data.map((d, idx) => ({...d,  fill: `var(--chart-${idx + 1})`})) // used fill to fill with the predefined chart blue color variants instead of passing through color variables
    return  fullData as FullData[]
}

export function BarChartInteractive2({data}: {data: BarChartData}) {
    const isMobile = useIsMobile()
    const {top5Stocks, bottom5Stocks} = data
    const [dataState, setDataState] = React.useState("top")
    const chartData = dataState === "top" ? editChartData(top5Stocks) : editChartData(bottom5Stocks)
    const chartConfig = dataState === "top" ? editConfig(top5Stocks) : editConfig(bottom5Stocks)

    React.useEffect(() => {
        if (isMobile) {
            setDataState("top")
        }
    }, [isMobile])
    
    return (
        <Card className={"w-full"}>
            <CardHeader>
                <CardTitle>Stock Details for Inventory</CardTitle>
                <CardDescription>Top and Bottom Stock details for inventory</CardDescription>
                <CardAction>
                    <ToggleGroup
                        type="single"
                        value={dataState}
                        onValueChange={setDataState}
                        variant="outline"
                        className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
                    >
                        <ToggleGroupItem value="top">Top 5</ToggleGroupItem>
                        <ToggleGroupItem value="bottom">Bottom 5</ToggleGroupItem>
                    </ToggleGroup>
                    <Select value={dataState} onValueChange={setDataState}>
                        <SelectTrigger
                            className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                            size="sm"
                            aria-label="Select a value"
                        >
                            <SelectValue placeholder="Top 5 stock" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="top" className="rounded-lg">
                                Top 5 stock
                            </SelectItem>
                            <SelectItem value="bottom" className="rounded-lg">
                                Bottom 5 stock
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </CardAction>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            left: 0,
                        }}
                    >
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) =>
                                String(chartConfig[value as keyof typeof chartConfig]?.label || value)
                            }
                        />
                        <XAxis dataKey="stock" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="stock" layout="vertical" radius={5} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            {
                dataState === "top" ? (
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 leading-none font-medium">
                            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="text-muted-foreground leading-none">
                            Showing products with highest stock
                        </div>
                    </CardFooter>
                )
                    :
                    (
                        <CardFooter className="flex-col items-start gap-2 text-sm">
                            <div className="flex gap-2 leading-none font-medium">
                                Trending down by 1.2% this month <TrendingDown className="h-4 w-4" />
                            </div>
                            <div className="text-muted-foreground leading-none">
                                Showing products with lowest stock
                            </div>
                        </CardFooter>
                    )
            }

        </Card>
    )
}
