import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";

interface InventoryStatsProps {
  totalStock: number;
}

export function InventoryStats({ totalStock }: InventoryStatsProps) {
  const getStockStatus = (stock: number) => {
    if (stock <= 0) return { label: "Out of Stock", variant: "destructive" as const, icon: AlertCircle };
    if (stock < 10) return { label: "Low Stock", variant: "destructive" as const, icon: AlertCircle };
    if (stock < 50) return { label: "Medium Stock", variant: "secondary" as const, icon: TrendingUp };
    return { label: "High Stock", variant: "default" as const, icon: CheckCircle2 };
  };

  const status = getStockStatus(totalStock);
  const StatusIcon = status.icon;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStock.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Available across all variants</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Status</CardTitle>
          <StatusIcon className={`h-4 w-4 ${status.variant === 'destructive' ? 'text-destructive' : 'text-primary'}`} />
        </CardHeader>
        <CardContent>
          <Badge variant={status.variant} className="mt-1">
            {status.label}
          </Badge>
          <p className="text-xs text-muted-foreground mt-2">Based on current inventory levels</p>
        </CardContent>
      </Card>
      
      {/* Placeholder for other stats like 'Monthly Sales' or 'Pending Orders' if available in the model */}
    </div>
  );
}
