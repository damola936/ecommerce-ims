import {type FullProduct} from "@/utils/types";
import {Card, CardContent, CardDescription, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

function ProductsList({products}: {products: FullProduct[]}) {
    return (
        products.map((product) => {
            const image = product.images.find((img) => img.isPrimary) || product.images[0];
            const tag = product.categories[0]?.name || "Uncategorized";

            return (
                <Link key={product.id} href={`/ecommerce/products/${product.id}`}>
            <Card>
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
                    <div className="flex flex-col items-center text-center">
                        <div className={"flex flex-col justify-evenly w-full"}>
                            <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                            <CardDescription className="line-clamp-1">{product.brand?.name}</CardDescription>
                            <div className={"flex justify-center items-center gap-4 mt-6"}>
                                <span className={"text-lg font-bold"}>${String(product.basePrice)}</span>
                                <div className={"px-2 py-1 rounded-md bg-primary text-secondary text-xs font-semibold"}>
                                    {tag}
                                </div>
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