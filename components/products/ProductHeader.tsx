import { Badge } from "@/components/ui/badge";
import RestockDialog from "@/components/products/RestockDialog";
import EditProductDialog, { type CorrectedProductVariant } from "./EditProductDialog";
import { createArchiveAction, fetchAllBrands, fetchAllProductCategories, fetchSingleProduct } from "@/utils/actions";
import FormContainer from "@/components/form/FormContainer";
import ArchiveButton from "@/components/products/ArchiveButton";

interface ProductHeaderProps {
    name: string;
    sku: string;
    status: string;
    id: string;
}

export async function ProductHeader({ name, sku, status, id }: ProductHeaderProps) {
    const product = await fetchSingleProduct(id)
    if (!product) return null

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "PUBLISHED":
                return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20";
            case "DRAFT":
                return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20";
            case "ARCHIVED":
                return "bg-muted text-muted-foreground border-transparent";
            case "OUT_OF_STOCK":
                return "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20";
            default:
                return "bg-secondary text-secondary-foreground";
        }
    }

    const {
        name: productName,
        images,
        brand,
        sku: variantSKU,
        variants: productVariants,
        categories,
        description
    } = product
    const correctedProductVariants = (productVariants?.map(variant => ({
        ...variant,
        price: Number(variant.price),
        attributes: variant.attributes as { color: string; size: string },
        dimensions: (variant.dimensions as { length: number; width: number; height: number }) || {
            length: 0,
            width: 0,
            height: 0
        }
    })) || []) as CorrectedProductVariant[]
    const brands = await fetchAllBrands()
    const productCategories = await fetchAllProductCategories()
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{name}</h1>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground font-mono">SKU: {sku}</span>
                    <Badge variant="outline" className={`text-[10px] uppercase font-bold px-2 py-0.5 ${getStatusStyles(status)}`}>
                        {status.replace('_', ' ')}
                    </Badge>
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
                <EditProductDialog name={productName} images={images} brand={brand}
                    correctedProductVariants={correctedProductVariants} categories={categories}
                    description={description || ''} sku={variantSKU || ''} id={id} brands={brands}
                    productCategories={productCategories} />
                <RestockDialog name={name} id={id} variants={correctedProductVariants} />
                <FormContainer action={createArchiveAction}>
                    <input type="hidden" name="id" value={id} />
                    <ArchiveButton id={id} />
                </FormContainer>
            </div>
        </div>
    );
}
