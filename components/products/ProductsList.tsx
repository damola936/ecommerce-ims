import { type FullProduct } from "@/utils/types";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

function ProductsList({ products }: { products: FullProduct[] }) {
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
    return (
        products.map((product) => {
            const image = product.images.find((img) => img.isPrimary) || product.images[0];
            const tag = product.categories[0]?.name || "Uncategorized";

            return (
                <Link key={product.id} href={`/ecommerce/products/${product.id}`}>
                    <Card className="overflow-hidden">
                        {image ? (
                            <Image
                                src={image.url}
                                alt={product.name}
                                className={"object-cover w-full h-48"}
                                width={400}
                                height={400}
                                priority
                            />
                        ) : (
                            <div className="w-full h-48 bg-secondary flex items-center justify-center rounded-t-xl">
                                <span className="text-muted-foreground text-xs">No Image Available</span>
                            </div>
                        )}
                        <CardContent>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex flex-col min-w-0">
                                        <CardTitle className="line-clamp-1 text-sm">{product.name}</CardTitle>
                                        <CardDescription className="line-clamp-1 text-xs">{product.brand?.name}</CardDescription>
                                    </div>
                                    <div className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyles(product.status)}`}>
                                        {product.status.split("_").join(" ")}
                                    </div>
                                </div>
                                <div className={"flex items-center gap-3"}>
                                    <span className={"text-base font-bold"}>${String(product.basePrice)}</span>
                                    <div className={"px-2 py-0.5 rounded-md bg-primary text-secondary text-xs font-semibold"}>
                                        {tag}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            )
        })
    );
}

export default ProductsList;