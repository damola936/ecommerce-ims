import BreadcrumbComponent from "@/components/breadcrumbs/breadcrumbs";
import {ChartAreaInteractive} from "@/components/dashboard/chart-area-interactive";
import {ordersChartData, visitorsChartData} from "@/utils/area-chart-data";
import {fetch5HiLoStocks, fetchFebHiLoOrderCategory} from "@/utils/actions";
import {extraBarChartData} from "@/utils/bar-chart-data";
import BartChartInteractive1 from "@/components/dashboard/bart-chart-interactive-1";
import {BarChartInteractive2} from "@/components/dashboard/bar-chart-interactive-2";

async function DashBoardAnalyticsPage() {
    const fetchedData = await fetchFebHiLoOrderCategory()
    const barChartData = Array.isArray(fetchedData) ? [...fetchedData, ...extraBarChartData] : extraBarChartData
    const stocks = await fetch5HiLoStocks()
  return (
    <div>
      <BreadcrumbComponent origin={{label: "Dashboard", link: "#"}} child={{label: "Analytics"}}/>
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="px-4 lg:px-6">
                        <ChartAreaInteractive chartData={visitorsChartData} title="Total Visitors"/>
                    </div>
                    <div className="px-4 lg:px-6">
                        <ChartAreaInteractive chartData={ordersChartData} title="Total Orders"/>
                    </div>
                    <div className={"px-4 lg:px-6 flex flex-col md:flex-row justify-between gap-4"}>
                        <BartChartInteractive1 data={barChartData}/>
                        <BarChartInteractive2 data={stocks}/>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
export default DashBoardAnalyticsPage