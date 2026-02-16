import BreadcrumbComponent from "@/components/breadcrumbs/breadcrumbs";
import {SectionCards} from "@/components/dashboard/section-cards";
import {ChartAreaInteractive} from "@/components/dashboard/chart-area-interactive";
// import data from "./data.json"
import {DataTable} from "@/components/dashboard/data-table";
import {fetchAllProducts, getAllOrders, getAllUsers, getUserOrdersLength} from "@/utils/actions";
import {FullOrder} from "@/utils/types";
import {visitorsChartData} from "@/utils/area-chart-data";


async function DashBoardOverviewPage() {
    const [orders, users, {products}] = await Promise.all([
        getAllOrders(),
        getAllUsers(),
        fetchAllProducts({search: "", pageSize: 100})
    ])
    const orderData = orders.map((order: FullOrder) => {
        return {
            id: order.id,
            email: order.user.email,
            name: order.items.map(item => item.product.name)[0], //pick the first, in the category array
            category: order.items.map(item => item.product.categories[0].name)[0], //pick the first in the items array
            status: order.status,
            price: String(order.totalAmount),
            date: order.createdAt.toLocaleDateString(),
        }
    })

    const userDetails = await Promise.all(users.map(async (user) => ({
        ...user,
        totalOrders: await getUserOrdersLength(user.id),
    }))) // map does not wait for async callbacks. It instead gives an array of promises, Promise.all will resolve them
    // in the future accept more items and categories, pass them as arrays, change the data table schema to accept arrays, and then alter items name to add ... to the end of the first and omit the two, then on the edit modal show the full names, flex the categories tags or grid them

    const productTableData = products.map((product) => {
        const primaryImage =
            product.images.find((image) => image.isPrimary) || product.images[0]
        const primaryCategory = product.categories[0]?.name || "Uncategorized"
        const totalStock = product.variants.reduce(
            (sum, variant) => sum + variant.stock,
            0
        )

        return {
            id: product.id,
            name: product.name,
            image: primaryImage?.url || "",
            category: primaryCategory,
            status: product.status,
            brand: product.brand?.name || "Unbranded",
            price: String(product.basePrice),
            stock: totalStock,
        }
    })
    return (
        <div>
            <BreadcrumbComponent origin={{label: "Dashboard", link: "#"}} child={{label: "Overview"}}/>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <SectionCards/>
                        <div className="px-4 lg:px-6">
                            <ChartAreaInteractive chartData={visitorsChartData} title="Total Visitors"/>
                        </div>
                        <DataTable
                            data={orderData}
                            userTableData={userDetails}
                            productTableData={productTableData}
                        />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default DashBoardOverviewPage
