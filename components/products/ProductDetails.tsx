import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, Tag, Building2, Banknote } from "lucide-react";

interface ProductDetailsProps {
  brand?: string;
  categories: string[];
  basePrice: number;
}

export function ProductDetails({ brand, categories, basePrice }: ProductDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          General Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Brand</p>
            <p className="text-sm font-semibold">{brand || "No Brand"}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Tag className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Categories</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <Badge key={cat} variant="secondary" className="text-[10px]">
                    {cat}
                  </Badge>
                ))
              ) : (
                <span className="text-sm">Uncategorized</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Banknote className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Base Price</p>
            <p className="text-xl font-bold text-primary">${basePrice.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
