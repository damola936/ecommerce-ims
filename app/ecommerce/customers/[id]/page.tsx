import { getCustomerById } from "@/utils/actions";
import { notFound } from "next/navigation";
import BreadcrumbComponent from "@/components/breadcrumbs/breadcrumbs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    IconCalendar,
    IconCircleCheckFilled,
    IconCircleXFilled,
    IconClock,
    IconLoader,
    IconMail,
    IconPackage,
    IconRefresh,
    IconSettings,
    IconShoppingCart,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; iconName: string; className: string }> = {
    PENDING: {
        label: "Pending",
        iconName: "clock",
        className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:bg-yellow-500/20 dark:text-yellow-400",
    },
    PROCESSING: {
        label: "Processing",
        iconName: "settings",
        className: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400",
    },
    COMPLETED: {
        label: "Completed",
        iconName: "check",
        className: "bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-500/20 dark:text-green-400",
    },
    CANCELLED: {
        label: "Cancelled",
        iconName: "x",
        className: "bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400",
    },
    REFUNDED: {
        label: "Refunded",
        iconName: "refresh",
        className: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:bg-purple-500/20 dark:text-purple-400",
    },
}

function StatusIcon({ name }: { name: string }) {
    switch (name) {
        case "clock": return <IconClock className="size-3" />;
        case "settings": return <IconSettings className="size-3 animate-spin" />;
        case "check": return <IconCircleCheckFilled className="size-3" />;
        case "x": return <IconCircleXFilled className="size-3" />;
        case "refresh": return <IconRefresh className="size-3" />;
        default: return <IconLoader className="size-3" />;
    }
}

async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const customer = await getCustomerById(id);

    if (!customer) {
        return notFound();
    }

    const totalOrders = customer.orders.length;
    const totalSpent = customer.orders.reduce(
        (acc, order) => acc + Number(order.totalAmount), 0
    );

    return (
        <div>
            <BreadcrumbComponent
                origin={{ label: "Customers", link: "/ecommerce/customers/all" }}
                child={{ label: customer.email }}
            />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-6 px-4 lg:px-6">

                        {/* ---------- Profile Header Card ---------- */}
                        <Card>
                            <CardContent className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                <Avatar size="lg" className="size-20 ring-2 ring-primary/20">
                                    {customer.profileImage ? (
                                        <AvatarImage src={customer.profileImage} alt={customer.email} />
                                    ) : null}
                                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                                        {customer.email.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col gap-3 text-center sm:text-left flex-1">
                                    <div>
                                        <h1 className="text-xl font-semibold tracking-tight">
                                            {customer.email}
                                        </h1>
                                        <p className="text-sm text-muted-foreground mt-0.5">
                                            Customer ID: {customer.id}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                                        <Badge variant="outline" className="gap-1.5 px-2.5 py-1">
                                            <IconMail className="size-3.5" />
                                            {customer.email}
                                        </Badge>
                                        <Badge variant="outline" className="gap-1.5 px-2.5 py-1">
                                            <IconCalendar className="size-3.5" />
                                            Joined {customer.createdAt.toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex gap-6 sm:gap-8">
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-2xl font-bold">{totalOrders}</span>
                                        <span className="text-xs text-muted-foreground">Orders</span>
                                    </div>
                                    <Separator orientation="vertical" className="h-12" />
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-2xl font-bold">${totalSpent.toFixed(2)}</span>
                                        <span className="text-xs text-muted-foreground">Total Spent</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* ---------- Orders Section ---------- */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <IconShoppingCart className="size-5" />
                                    Order History
                                </CardTitle>
                                <CardDescription>
                                    All orders placed by this customer
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {customer.orders.length > 0 ? (
                                    <div className="overflow-hidden rounded-lg border">
                                        <Table>
                                            <TableHeader className="bg-muted">
                                                <TableRow>
                                                    <TableHead>Order ID</TableHead>
                                                    <TableHead>Products</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Total</TableHead>
                                                    <TableHead>Date</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {customer.orders.map((order) => {
                                                    const config = statusConfig[order.status] || {
                                                        label: order.status,
                                                        iconName: "loader",
                                                        className: "text-muted-foreground",
                                                    };
                                                    return (
                                                        <TableRow key={order.id}>
                                                            <TableCell className="font-mono text-xs text-muted-foreground">
                                                                {order.id.slice(0, 8)}...
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-col gap-1">
                                                                    {order.items.map((item) => (
                                                                        <div key={item.id} className="flex items-center gap-2">
                                                                            <IconPackage className="size-3.5 text-muted-foreground shrink-0" />
                                                                            <span className="text-sm font-medium truncate max-w-[200px]">
                                                                                {item.product.name}
                                                                            </span>
                                                                            <span className="text-xs text-muted-foreground">
                                                                                ×{item.quantity}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={cn("px-1.5 gap-1", config.className)}
                                                                >
                                                                    <StatusIcon name={config.iconName} />
                                                                    {config.label}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                ${Number(order.totalAmount).toFixed(2)}
                                                            </TableCell>
                                                            <TableCell className="text-muted-foreground">
                                                                {order.createdAt.toLocaleDateString("en-US", {
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric",
                                                                })}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                                        <div className="bg-muted flex size-14 items-center justify-center rounded-full">
                                            <IconShoppingCart className="text-muted-foreground size-7" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-base font-semibold">No orders yet</h3>
                                            <p className="text-muted-foreground text-sm">
                                                This customer hasn&apos;t placed any orders.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerDetailPage;
