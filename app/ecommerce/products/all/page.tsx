import BreadcrumbComponent from "@/components/breadcrumbs/breadcrumbs";
import SearchProductInput from "@/components/products/SearchProductInput";
import CreateProductComponent from "@/components/products/CreateProductComponent";
import {fetchAllProducts} from "@/utils/actions";
import ProductsList from "@/components/products/ProductsList";
import Container from "@/components/global/container";
import {PaginationComponent} from "@/components/global/PaginationComponent";

async function ProductsPage({searchParams}: { searchParams: Promise<{ search?: string, page?: string }> }) {
    const {search = "", page = "1"} = await searchParams;
    const {products, totalCount} = await fetchAllProducts({search, page: parseInt(page)})
    return (
        <div>
            <BreadcrumbComponent origin={{label: "Products", link: "/ecommerce/products/all"}}
                                 child={{label: "All Products"}}/>
            <div className={"max-w-md mx-auto"}><SearchProductInput/></div>
            <Container>
                <div className={"grid md:grid-cols-3 lg:grid-cols-4 gap-6"}>
                    <CreateProductComponent/>
                    <ProductsList products={products}/>
                </div>
            </Container>
            <div className={"max-w-md mx-auto mb-4"}><PaginationComponent length={totalCount} currentPage={parseInt(page)}/></div>
        </div>
    );
}

export default ProductsPage;