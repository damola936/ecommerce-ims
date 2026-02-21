import BreadcrumbComponent from "@/components/breadcrumbs/breadcrumbs";
import SearchProductInput from "@/components/products/SearchProductInput";
import { fetchArchivedProducts } from "@/utils/actions";
import ProductsList from "@/components/products/ProductsList";
import Container from "@/components/global/container";
import { PaginationComponent } from "@/components/global/PaginationComponent";

async function AllArchives({ searchParams }: { searchParams: Promise<{ search?: string, page?: string }> }) {
    const { search = "", page = "1" } = await searchParams;
    const { products, totalCount } = await fetchArchivedProducts({ search, page: parseInt(page) });
    return (
        <div>
            <BreadcrumbComponent origin={{ label: "Archives", link: "/ecommerce/archives/all" }}
                child={{ label: "All Archives" }} />
            <div className={"max-w-md mx-auto"}><SearchProductInput /></div>
            <Container>
                <div className={"grid md:grid-cols-3 lg:grid-cols-4 gap-6"}>
                    <ProductsList products={products} />
                </div>
            </Container>
            <div className={"max-w-md mx-auto mb-4"}><PaginationComponent length={totalCount} currentPage={parseInt(page)} /></div>
        </div>
    );
}

export default AllArchives;