import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/form/buttons";
import RestockDialog from "@/components/products/RestockDialog";
import EditProductDialog, { type CorrectedProductVariant } from "./EditProductDialog";
import { fetchAllBrands, fetchAllProductCategories, fetchSingleProduct } from "@/utils/actions";

interface ProductHeaderProps {
  name: string;
  sku: string;
  status: string;
  id: string;
}

export async function ProductHeader({ name, sku, status, id }: ProductHeaderProps) {
  const product = await fetchSingleProduct(id)
  if (!product) return null
  const { name: productName, images, brand, sku: variantSKU, variants: productVariants, categories, description } = product
  const correctedProductVariants = (productVariants?.map(variant => ({
    ...variant,
    price: Number(variant.price),
    attributes: variant.attributes as { color: string; size: string },
    dimensions: (variant.dimensions as { length: number; width: number; height: number }) || { length: 0, width: 0, height: 0 }
  })) || []) as CorrectedProductVariant[]
  const brands = await fetchAllBrands()
  const productCategories = await fetchAllProductCategories()
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
        <EditProductDialog name={productName} images={images} brand={brand}
          correctedProductVariants={correctedProductVariants} categories={categories}
          description={description || ''} sku={variantSKU || ''} id={id} brands={brands} productCategories={productCategories} />
        <RestockDialog name={name} id={id} variants={correctedProductVariants} />
        <SubmitButton text="archive" size="lg" variant="outline" className="border-destructive text-destructive hover:bg-destructive/10 capitalize" />
      </div>
    </div>
  );
}
