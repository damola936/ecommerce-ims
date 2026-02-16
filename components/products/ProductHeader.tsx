import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/form/buttons";
import RestockDialog from "@/components/products/RestockDialog";
import { ProductVariant } from "@/lib/generated/prisma";

interface ProductHeaderProps {
  name: string;
  sku: string;
  status: string;
  id: string;
  variants: ProductVariant[]
}

export function ProductHeader({ name, sku, status, id, variants }: ProductHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{name}</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-muted-foreground font-mono">SKU: {sku}</span>
          <Badge variant="outline" className="text-[10px] uppercase">{status}</Badge>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <SubmitButton text="edit" size="lg" variant="outline" className="capitalize" />
        <RestockDialog name={name} id={id} variants={variants} />
        <SubmitButton text="archive" size="lg" variant="outline" className="border-destructive text-destructive hover:bg-destructive/10 capitalize" />
      </div>
    </div>
  );
}
