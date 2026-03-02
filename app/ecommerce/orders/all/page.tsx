import BreadcrumbComponent from "@/components/breadcrumbs/breadcrumbs";
import { OrdersDataTable } from "@/components/orders/orders-data-table";
import { getAllOrders } from "@/utils/actions";
import { FullOrder } from "@/utils/types";

async function AllOrdersPage() {
    const orders = await getAllOrders();

    const orderData = orders.map((order: FullOrder) => ({
        id: order.id,
        email: order.user.email,
        name: order.items.map((item) => item.product.name)[0],
        category: order.items.map((item) => item.product.categories[0]?.name)[0] || "Uncategorized",
        status: order.status,
        price: String(order.totalAmount),
        date: order.createdAt.toLocaleDateString(),
    }));

    return (
        <div>
            <BreadcrumbComponent
                origin={{ label: "Orders", link: "/ecommerce/orders" }}
                child={{ label: "All Orders" }}
            />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                        <OrdersDataTable data={orderData} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllOrdersPage;