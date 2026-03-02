import BreadcrumbComponent from "@/components/breadcrumbs/breadcrumbs";
import { CustomersDataTable } from "@/components/customers/customers-data-table";
import { getAllCustomers } from "@/utils/actions";

async function AllCustomersPage() {
    const customers = await getAllCustomers();

    const customerData = customers.map((customer) => ({
        id: customer.id,
        email: customer.email,
        totalOrders: customer._count.orders,
        dateJoined: customer.createdAt.toLocaleDateString(),
    }));

    return (
        <div>
            <BreadcrumbComponent
                origin={{ label: "Customers", link: "/ecommerce/customers" }}
                child={{ label: "All Customers" }}
            />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                        <CustomersDataTable data={customerData} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllCustomersPage;