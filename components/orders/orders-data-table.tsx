"use client"

import * as React from "react"
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconCircleCheckFilled,
    IconCircleXFilled,
    IconClock,
    IconDotsVertical,
    IconGripVertical,
    IconLayoutColumns,
    IconLoader,
    IconRefresh,
    IconSettings,
    IconTrendingUp,
} from "@tabler/icons-react"
import {
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type Row,
    type SortingState,
    type VisibilityState,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Categories } from "@/utils/ModelData"
import { cn } from "@/lib/utils"
import { SubmitButton } from "@/components/form/buttons"
import { getCategoryBadgeClass } from "@/components/dashboard/products-data-table"
import FormContainer from "@/components/form/FormContainer"
import { updateOrderStatusAction } from "@/utils/actions"

// ---------- schema ----------
export const OrderTableSchema = z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
    category: z.string(),
    status: z.string(),
    price: z.string(),
    date: z.string(),
})

type OrderRow = z.infer<typeof OrderTableSchema>

// ---------- status tabs ----------
const STATUS_TABS = [
    { value: "all", label: "All Orders" },
    { value: "PENDING", label: "Pending" },
    { value: "PROCESSING", label: "Processing" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "REFUNDED", label: "Refunded" },
] as const

// ---------- drag handle ----------
function DragHandle({ id }: { id: string }) {
    const { attributes, listeners } = useSortable({ id })
    return (
        <Button
            {...attributes}
            {...listeners}
            variant="ghost"
            size="icon"
            className="text-muted-foreground size-7 hover:bg-transparent"
        >
            <IconGripVertical className="text-muted-foreground size-3" />
            <span className="sr-only">Drag to reorder</span>
        </Button>
    )
}

// ---------- columns ----------
const columns: ColumnDef<OrderRow>[] = [
    {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: "Product Name",
        cell: ({ row }) => <TableCellViewer item={row.original} />,
        enableHiding: false,
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            <h2 className="font-medium">{row.original.email}</h2>
        ),
        enableHiding: false,
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
            const category = row.original.category || "Uncategorized"
            return (
                <Badge
                    variant="outline"
                    className={cn("px-1.5", getCategoryBadgeClass(category))}
                >
                    {category}
                </Badge>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status as string
            const statusConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
                PENDING: {
                    label: "Pending",
                    icon: <IconClock className="size-3" />,
                    className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:bg-yellow-500/20 dark:text-yellow-400",
                },
                PROCESSING: {
                    label: "Processing",
                    icon: <IconSettings className="size-3 animate-spin" />,
                    className: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400",
                },
                COMPLETED: {
                    label: "Completed",
                    icon: <IconCircleCheckFilled className="size-3" />,
                    className: "bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-500/20 dark:text-green-400",
                },
                CANCELLED: {
                    label: "Cancelled",
                    icon: <IconCircleXFilled className="size-3" />,
                    className: "bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400",
                },
                REFUNDED: {
                    label: "Refunded",
                    icon: <IconRefresh className="size-3" />,
                    className: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:bg-purple-500/20 dark:text-purple-400",
                },
            }
            const config = statusConfig[status] || {
                label: status,
                icon: <IconLoader className="size-3" />,
                className: "text-muted-foreground",
            }
            return (
                <Badge variant="outline" className={cn("px-1.5", config.className)}>
                    {config.icon}
                    {config.label}
                </Badge>
            )
        },
    },
    {
        accessorKey: "price",
        header: "Price($)",
        cell: ({ row }) => (
            <h2 className="font-medium">{row.original.price}</h2>
        ),
        enableHiding: false,
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
            <h2 className="font-medium">{row.original.date}</h2>
        ),
        enableHiding: false,
    },
    {
        id: "actions",
        cell: () => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                        size="icon"
                    >
                        <IconDotsVertical />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Make a copy</DropdownMenuItem>
                    <DropdownMenuItem>Favorite</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
]

// ---------- draggable row ----------
function DraggableRow({ row }: { row: Row<OrderRow> }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id,
    })
    return (
        <TableRow
            data-state={row.getIsSelected() && "selected"}
            data-dragging={isDragging}
            ref={setNodeRef}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
}

// ---------- inner table for a single tab ----------
function OrdersTableInner({ data: initialData }: { data: OrderRow[] }) {
    const [data, setData] = React.useState(() => initialData)
    React.useEffect(() => { setData(initialData) }, [initialData])

    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })

    const sortableId = React.useId()
    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    )

    const dataIds = React.useMemo<UniqueIdentifier[]>(
        () => data?.map(({ id }) => id) || [],
        [data]
    )

    const table = useReactTable({
        data,
        columns,
        state: { sorting, columnVisibility, rowSelection, columnFilters, pagination },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (active && over && active.id !== over.id) {
            setData((data) => {
                const oldIndex = dataIds.indexOf(active.id)
                const newIndex = dataIds.indexOf(over.id)
                return arrayMove(data, oldIndex, newIndex)
            })
        }
    }

    return (
        <div className="flex flex-col gap-4">
            {/* toolbar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <IconLayoutColumns />
                                <span className="hidden lg:inline">Customize Columns</span>
                                <span className="lg:hidden">Columns</span>
                                <IconChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) =>
                                        typeof column.accessorFn !== "undefined" &&
                                        column.getCanHide()
                                )
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="text-muted-foreground text-sm">
                    {data.length} order{data.length !== 1 ? "s" : ""}
                </div>
            </div>

            {/* table */}
            <div className="overflow-hidden rounded-lg border">
                <DndContext
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis]}
                    onDragEnd={handleDragEnd}
                    sensors={sensors}
                    id={sortableId}
                >
                    <Table>
                        <TableHeader className="bg-muted sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody className="**:data-[slot=table-cell]:first:w-8">
                            {table.getRowModel().rows?.length ? (
                                <SortableContext
                                    items={dataIds}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {table.getRowModel().rows.map((row) => (
                                        <DraggableRow key={row.id} row={row} />
                                    ))}
                                </SortableContext>
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </DndContext>
            </div>

            {/* pagination */}
            <div className="flex items-center justify-between px-4">
                <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="flex w-full items-center gap-8 lg:w-fit">
                    <div className="hidden items-center gap-2 lg:flex">
                        <Label htmlFor="rows-per-page" className="text-sm font-medium">
                            Rows per page
                        </Label>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => table.setPageSize(Number(value))}
                        >
                            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-fit items-center justify-center text-sm font-medium">
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </div>
                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to first page</span>
                            <IconChevronsLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <IconChevronLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to next page</span>
                            <IconChevronRight />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden size-8 lg:flex"
                            size="icon"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Go to last page</span>
                            <IconChevronsRight />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ---------- chart data for drawer ----------
const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
    desktop: { label: "Desktop", color: "var(--primary)" },
    mobile: { label: "Mobile", color: "var(--primary)" },
} satisfies ChartConfig

// ---------- drawer cell viewer ----------
function TableCellViewer({ item }: { item: OrderRow }) {
    const isMobile = useIsMobile()

    return (
        <Drawer direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Button variant="link" className="text-foreground w-fit px-0 text-left">
                    {item.name}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <FormContainer action={updateOrderStatusAction} className="flex flex-col w-full">
                    <DrawerHeader className="gap-1">
                        <DrawerTitle>{item.name}</DrawerTitle>
                        <DrawerDescription>
                            Review and update the order status below.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                        {!isMobile && (
                            <>
                                <ChartContainer config={chartConfig}>
                                    <AreaChart
                                        accessibilityLayer
                                        data={chartData}
                                        margin={{ left: 0, right: 10 }}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="month"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickFormatter={(value) => value.slice(0, 3)}
                                            hide
                                        />
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent indicator="dot" />}
                                        />
                                        <Area
                                            dataKey="mobile"
                                            type="natural"
                                            fill="var(--color-mobile)"
                                            fillOpacity={0.6}
                                            stroke="var(--color-mobile)"
                                            stackId="a"
                                        />
                                        <Area
                                            dataKey="desktop"
                                            type="natural"
                                            fill="var(--color-desktop)"
                                            fillOpacity={0.4}
                                            stroke="var(--color-desktop)"
                                            stackId="a"
                                        />
                                    </AreaChart>
                                </ChartContainer>
                                <Separator />
                                <div className="grid gap-2">
                                    <div className="flex gap-2 leading-none font-medium">
                                        Trending up by 5.2% this month{" "}
                                        <IconTrendingUp className="size-4" />
                                    </div>
                                    <div className="text-muted-foreground">
                                        Showing total visitors for the last 6 months. This is just
                                        some random text to test the layout. It spans multiple lines
                                        and should wrap around.
                                    </div>
                                </div>
                                <Separator />
                            </>
                        )}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="header">Name</Label>
                                <Input id="header" defaultValue={item.name} name="name" disabled />
                                <input type="hidden" name="id" defaultValue={item.id} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="type">Category</Label>
                                    <Select defaultValue={item.category} name="category" disabled>
                                        <SelectTrigger id="type" className="w-full">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Categories.map((category, index) => (
                                                <SelectItem value={category.category} key={index}>
                                                    {category.category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="status">Status</Label>
                                    <Select defaultValue={item.status} name="status">
                                        <SelectTrigger id="status" className="w-full">
                                            <SelectValue placeholder="Select a status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PENDING">PENDING</SelectItem>
                                            <SelectItem value="PROCESSING">PROCESSING</SelectItem>
                                            <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                                            <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                                            <SelectItem value="REFUNDED">REFUNDED</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DrawerFooter>
                        <SubmitButton text="Update Status" />
                        <DrawerClose asChild>
                            <Button variant="outline">Done</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </FormContainer>
            </DrawerContent>
        </Drawer>
    )
}

// ---------- main export ----------
export function OrdersDataTable({ data }: { data: OrderRow[] }) {
    const [activeTab, setActiveTab] = React.useState("all")

    const filteredData = React.useMemo(() => {
        if (activeTab === "all") return data
        return data.filter((order) => order.status === activeTab)
    }, [data, activeTab])

    const statusCounts = React.useMemo(() => {
        const counts: Record<string, number> = { all: data.length }
        for (const order of data) {
            counts[order.status] = (counts[order.status] || 0) + 1
        }
        return counts
    }, [data])

    return (
        <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full flex-col justify-start gap-6"
        >
            <div className="flex items-center justify-between">
                {/* mobile: select-based tab switcher */}
                <Label htmlFor="order-view-selector" className="sr-only">
                    View
                </Label>
                <Select value={activeTab} onValueChange={setActiveTab}>
                    <SelectTrigger
                        className="flex w-fit @4xl/main:hidden"
                        size="sm"
                        id="order-view-selector"
                    >
                        <SelectValue placeholder="Select a view" />
                    </SelectTrigger>
                    <SelectContent>
                        {STATUS_TABS.map((tab) => (
                            <SelectItem key={tab.value} value={tab.value}>
                                {tab.label} ({statusCounts[tab.value] || 0})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* desktop: tab triggers */}
                <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
                    {STATUS_TABS.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value}>
                            {tab.label}{" "}
                            <Badge variant="secondary">
                                {statusCounts[tab.value] || 0}
                            </Badge>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>

            {/* single content area that renders the filtered table */}
            {STATUS_TABS.map((tab) => (
                <TabsContent
                    key={tab.value}
                    value={tab.value}
                    className="relative flex flex-col gap-4 overflow-auto"
                >
                    <OrdersTableInner data={filteredData} />
                </TabsContent>
            ))}
        </Tabs>
    )
}
