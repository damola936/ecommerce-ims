import BreadcrumbComponent from "@/components/breadcrumbs/breadcrumbs";
import {SectionCards} from "@/components/dashboard/section-cards";
import {ChartAreaInteractive} from "@/components/dashboard/chart-area-interactive";
import data from "./data.json"
import {DataTable} from "@/components/dashboard/data-table";
import {getAllOrders} from "@/utils/actions";
import {FullOrder} from "@/utils/types";

async function DashBoardOverviewPage() {
    const orders = await getAllOrders()
    const orderData = orders.map((order:FullOrder, index) => {
        return {
            id: index,
            email: order.user.email,
            name: [order.items.map(item => item.product.name)],
            category: [order.items.map(item => item.product.categories[0])],
            status: order.status,
            price: order.totalAmount,
            date: order.createdAt.toLocaleDateString(),
        }
    })
  return (
    <div>
      <BreadcrumbComponent origin={{label: "Dashboard", link: "#"}} child={{label: "Overview"}}/>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
          </div>
        </div>
      </div>

    </div>
  )
}
export default DashBoardOverviewPage