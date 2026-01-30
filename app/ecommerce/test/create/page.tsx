import React from 'react';
import BreadcrumbComponent from "@/components/breadcrumbs/breadcrumbs";
import SearchProductInput from "@/components/products/SearchProductInput";
import Container from "@/components/global/container";
import CreateProductComponent from "@/components/products/CreateProductComponent";
import CreateBrand from "@/components/test/CreateBrand";
import CreateProductVariant from "@/components/test/CreateProductVariant";
import CreateProductCategory from "@/components/test/CreateProductCategory";
import CreateOrder from "@/components/test/CreateOrder";
import CreateUser from "@/components/test/CreateUser";
import {fetchAllProducts, getAllUsers} from "@/utils/actions";

async function CreatePage() {
    const [users, {products}] = await Promise.all([
        getAllUsers(),
        fetchAllProducts({search: "", pageSize: 100})
    ])
    return (
        <div>
            <BreadcrumbComponent origin={{label: "Test", link: "#"}}
                                 child={{label: "Create"}}/>
            <div className={"max-w-md mx-auto"}><SearchProductInput/></div>
            <Container>
                <div className={"grid md:grid-cols-3 lg:grid-cols-4 gap-6"}>
                    <CreateProductComponent/>
                    <CreateBrand/>
                    <CreateOrder users={users} products={products}/>
                    <CreateProductCategory products={products}/>
                    <CreateProductVariant products={products}/>
                    <CreateUser/>
                </div>
            </Container>
        </div>
    );
}

export default CreatePage;