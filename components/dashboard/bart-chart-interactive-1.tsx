"use client"

import {HiLoOrder} from "@/utils/actions";

import {type ChartConfig, ChartContainer} from "@/components/ui/chart"
import {Bar, BarChart, CartesianGrid, XAxis} from "recharts";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import {CardHeader, CardTitle, CardFooter, CardDescription, CardContent, Card} from "@/components/ui/card";
import {TrendingUp} from "lucide-react";

const chartConfig = {
    hNo: {
        label: "Highest Category No",
        color: "#2563eb",
    },
    lNo: {
        label: "Lowest Category No",
        color: "#60a5fa",
    },
} satisfies ChartConfig

function BartChartInteractive1({data}: {data: HiLoOrder[]}) {
    return (
        <Card className={"w-full"}>
            <CardHeader>
                <CardTitle>Total Orders by Category</CardTitle>
                <CardDescription>February 2026 - January 2025</CardDescription>
            </CardHeader>
            <CardContent>
        <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={data}>
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <CartesianGrid vertical={false} />
                <Bar dataKey="hNo" fill="var(--color-hNo)" radius={4} />
                <Bar dataKey="lNo" fill="var(--color-lNo)" radius={4} />
            </BarChart>
        </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing total orders by category for the last 11 months, not including february
                </div>
            </CardFooter>
        </Card>
    );
}

export default BartChartInteractive1;