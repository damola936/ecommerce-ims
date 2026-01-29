import BreadcrumbComponent from "@/components/breadcrumbs/breadcrumbs";
import {SectionCards} from "@/components/dashboard/section-cards";
import {ChartAreaInteractive} from "@/components/dashboard/chart-area-interactive";
// import data from "./data.json"
import {DataTable} from "@/components/dashboard/data-table";
import {fetchAllProducts, getAllOrders, getAllUsers, getUserOrdersLength} from "@/utils/actions";
import {FullOrder} from "@/utils/types";


async function DashBoardOverviewPage() {
    const orders = await getAllOrders()
    const orderData = orders.map((order: FullOrder, index) => {
        return {
            id: index,
            email: order.user.email,
            name: order.items.map(item => item.product.name)[0], //there is only one data, in the category array
            category: order.items.map(item => item.product.categories[0].name)[0], //there is only one data in the items array
            status: order.status,
            price: String(order.totalAmount),
            date: order.createdAt.toLocaleDateString(),
        }
    })

    const users = await getAllUsers()
    const userDetails = await Promise.all(users.map(async (user, index) => ({
        ...user,
        totalOrders: await getUserOrdersLength(user.id),
        id: index
    }))) // map does not wait for async callbacks. It instead gives an array of promises, Promise.all will resolve them
    // in the future accept more items and categories, pass them as arrays, change the data table schema to accept arrays, and then alter items name to add ... to the end of the first and omit the two, then on the edit modal show the full names, flex the categories tags or grid them

    const products = await fetchAllProducts({search: ""})
    const productTableData = products.map((product, index) => {
        const primaryImage =
            product.images.find((image) => image.isPrimary) || product.images[0]
        const primaryCategory = product.categories[0]?.name || "Uncategorized"
        const totalStock = product.variants.reduce(
            (sum, variant) => sum + variant.stock,
            0
        )

        return {
            id: index,
            productId: product.id,
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
                            <ChartAreaInteractive/>
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
