import BreadcrumbComponent from "@/components/breadcrumbs/breadcrumbs";
import Container from "@/components/global/container";
import { fetchSingleProduct } from "@/utils/actions";
import { ProductHeader } from "@/components/products/ProductHeader";
import { InventoryStats } from "@/components/products/InventoryStats";
import { ProductDetails } from "@/components/products/ProductDetails";
import { ProductVariants } from "@/components/products/ProductVariants";
import { ProductGallery } from "@/components/products/ProductGallery";

async function SingleProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await fetchSingleProduct(id);

    if (!product) return (
        <Container>
            <div className="flex flex-col items-center justify-center py-20">
                <h1 className="text-2xl font-bold">Product Not Found</h1>
                <p className="text-muted-foreground">The product with ID {id} does not exist.</p>
            </div>
        </Container>
    );

    const { id:productId, name, sku, images, brand, variants = [], categories = [], basePrice, description } = product;
    const totalStock = variants.reduce((acc, curr) => acc + (curr.stock || 0), 0);
    const categoryNames = categories.map(c => c.name);

    return (
        <div className="min-h-screen bg-background pb-12">
            <BreadcrumbComponent
                origin={{ label: "Products", link: "/ecommerce/products/all" }}
                child={{ label: name }}
            />
            <Container className="py-6 max-w-full">
                <ProductHeader name={name} sku={sku} status={product.status} id={productId} variants={variants} />

                <InventoryStats totalStock={totalStock} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-8">
                        <ProductGallery images={images} name={name} />
                        <ProductDetails
                            brand={brand?.name}
                            categories={categoryNames}
                            basePrice={Number(basePrice)}
                        />
                    </div>

                    <div className="lg:col-span-8 space-y-8">
                        {description && (
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                                <h3 className="text-lg font-semibold mb-2">Description</h3>
                                <p className="text-muted-foreground leading-relaxed">{description}</p>
                            </div>
                        )}
                        <ProductVariants variants={variants} basePrice={Number(basePrice)} />
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default SingleProductPage