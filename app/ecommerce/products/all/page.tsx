import BreadcrumbComponent from "@/components/breadcrumbs/breadcrumbs";
import SearchProductInput from "@/components/products/SearchProductInput";
import CreateProductComponent from "@/components/products/CreateProductComponent";
import {fetchAllProducts} from "@/utils/actions";
import ProductsList from "@/components/products/ProductsList";

async function ProductsPage() {
    const products = await fetchAllProducts()
    return (
        <div>
            <BreadcrumbComponent origin={{label: "Products", link: "#"}} child={{label: "All Products"}}/>
            <div className={"max-w-md mx-auto"}><SearchProductInput/></div>
            <div className={"mx-auto max-w-6xl xl:max-w-7xl px-8 py-20"}>
                <div className={"grid md:grid-cols-3 lg:grid-cols-4 gap-6"}>
                    <CreateProductComponent/>
                    <ProductsList products={products}/>
                </div>
            </div>
        </div>
    );
}

export default ProductsPage;