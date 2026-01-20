import BreadcrumbComponent from "@/components/breadcrumbs/breadcrumbs";
import SearchProductInput from "@/components/products/SearchProductInput";
import CreateProductComponent from "@/components/products/CreateProductComponent";
import {fetchAllProducts} from "@/utils/actions";
import ProductsList from "@/components/products/ProductsList";
import Container from "@/components/global/container";

async function ProductsPage() {
    const products = await fetchAllProducts()
    return (
        <div>
            <BreadcrumbComponent origin={{label: "Products", link: "/ecommerce/products/all"}} child={{label: "All Products"}}/>
            <div className={"max-w-md mx-auto"}><SearchProductInput/></div>
                <Container>
                    <div className={"grid md:grid-cols-3 lg:grid-cols-4 gap-6"}>
                        <CreateProductComponent/>
                        <ProductsList products={products}/>
                    </div>
                </Container>
        </div>
    );
}

export default ProductsPage;