import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import HighLowForecasting from "@/components/predictions/High-Low-Forecasting";
import PredictionComponent from "@/components/predictions/PredictionComponent";
import BreadcrumbComponent from "@/components/breadcrumbs/breadcrumbs";
import {visitorsChartData, ordersChartData} from "@/utils/area-chart-data";
import {ChartConfig} from "@/components/ui/chart";

export default function PredictionsPage() {
    const visitorsChartConfig = {
        visitors: {
            label: "Predicted Visitors",
        },
        desktop: {
            label: "Desktop",
            color: "var(--chart-1)",
        },
        mobile: {
            label: "Mobile",
            color: "var(--chart-2)",
        },
    } satisfies ChartConfig

    const visitorsModelDetails = [
        { label: "Model Architecture", value: "Lasso Regression" },
        { label: "Hyperparameters", value: "Alpha: 0.1, random_state: 42" },
        { label: "Avg.RMSE", value: "117.0" },
        { label: "Base Dataset", value: "Visitors Chart Dataset" },
        { label: "Last Sync", value: "Real-time" }
    ]

    const ordersChartConfig = {
        orders: {
            label: "Predicted Orders",
        },
        desktop: {
            label: "Desktop",
            color: "var(--chart-1)",
        },
        mobile: {
            label: "Mobile",
            color: "var(--chart-2)",
        },
    } satisfies ChartConfig

    const ordersModelDetails = [
        { label: "Model Architecture", value: "Lasso Regression" },
        { label: "Hyperparameters", value: "Alpha: 0.1, random_state: 42" },
        { label: "Avg.RMSE", value: "17.2" },
        { label: "Base Dataset", value: "Orders Chart Dataset" },
        { label: "Last Sync", value: "Real-time" }
    ]

    return (
        <div className={"bg-neutral-50 dark:bg-neutral-950"}>
            <BreadcrumbComponent origin={{ label: "Analytics", link: "/ecommerce/analytics" }} child={{ label: "Predictions" }} />

            <Tabs defaultValue="high low forecasting">
                <TabsList className={"mx-auto"}>
                    <TabsTrigger value="high low forecasting">High-Low Forecasting</TabsTrigger>
                    <TabsTrigger value="order no predictions">Order Number Predictions</TabsTrigger>
                    <TabsTrigger value="visitor no predictions">Visitor Number Predictions</TabsTrigger>
                </TabsList>
                <TabsContent value="high low forecasting">
                    <HighLowForecasting />
                </TabsContent>
                <TabsContent value="order no predictions">
                    <PredictionComponent
                        title="Order Number Predictions"
                        description="Our intelligence engine predicts the amount of orders in a time frame based on historical sales data."
                        initialChartData={ordersChartData}
                        category="orders"
                        chartConfig={ordersChartConfig}
                        modelDetails={ordersModelDetails}
                    />
                </TabsContent>
                <TabsContent value="visitor no predictions">
                    <PredictionComponent
                        title="Site Visitors Predictions"
                        description="Our intelligence engine predicts the amount of site visitors in a time frame based on historical sales data."
                        initialChartData={visitorsChartData}
                        category="visitors"
                        chartConfig={visitorsChartConfig}
                        modelDetails={visitorsModelDetails}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}