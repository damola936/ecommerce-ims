"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchCategoriesWithHierarchy, fetchProductsByCategory } from "@/utils/actions";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BreadcrumbComponent from "@/components/breadcrumbs/breadcrumbs";
import Container from "@/components/global/container";
import {
    ChevronRight,
    ChevronDown,
    LayoutGrid,
    Layers,
    Package,
    ChevronLeft,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

type CategoryWithHierarchy = {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
    children: {
        id: string;
        name: string;
        slug: string;
        parentId: string | null;
        _count: { products: number };
    }[];
    _count: { products: number };
};

type Product = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    basePrice: any;
    status: string;
    brand: { id: string; name: string } | null;
    images: { id: string; url: string; isPrimary: boolean }[];
    categories: { id: string; name: string; slug: string }[];
    variants: any[];
};

const PAGE_SIZE = 8;

function CategoriesPage() {
    const [categories, setCategories] = useState<CategoryWithHierarchy[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    const loadProducts = useCallback(async (categoryName?: string, page = 1) => {
        setLoading(true);
        try {
            const result = await fetchProductsByCategory({
                categoryName: categoryName || undefined,
                page,
                pageSize: PAGE_SIZE,
            });
            setProducts(result.products as Product[]);
            setTotalCount(result.totalCount);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategoriesWithHierarchy().then((cats) =>
            setCategories(cats as CategoryWithHierarchy[])
        );
        loadProducts();
    }, [loadProducts]);

    const handleCategoryClick = (categoryName: string | null) => {
        setSelectedCategory(categoryName);
        setCurrentPage(1);
        loadProducts(categoryName || undefined, 1);
    };

    const toggleExpand = (categoryId: string) => {
        setExpandedCategories((prev) => {
            const next = new Set(prev);
            if (next.has(categoryId)) {
                next.delete(categoryId);
            } else {
                next.add(categoryId);
            }
            return next;
        });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        loadProducts(selectedCategory || undefined, page);
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "PUBLISHED":
                return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
            case "DRAFT":
                return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
            case "ARCHIVED":
                return "bg-muted text-muted-foreground border-transparent";
            case "OUT_OF_STOCK":
                return "bg-destructive/10 text-destructive border-destructive/20";
            default:
                return "bg-secondary text-secondary-foreground";
        }
    };

    const totalProductsInCategory = (cat: CategoryWithHierarchy) => {
        return (
            cat._count.products +
            cat.children.reduce((sum, child) => sum + child._count.products, 0)
        );
    };

    const allProductsCount = categories.reduce(
        (sum, cat) => sum + totalProductsInCategory(cat),
        0
    );

    const getPaginationNumbers = () => {
        const pages: (number | "ellipsis")[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("ellipsis");
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push("ellipsis");
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div>
            <BreadcrumbComponent
                origin={{ label: "Products", link: "/ecommerce/products/all" }}
                child={{ label: "Categories" }}
            />

            <Container className="py-10">
                <div className="flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                            <Layers className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
                            <p className="text-sm text-muted-foreground">
                                Browse products by category
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                        {/* Category Sidebar */}
                        <Card className="h-fit sticky top-20">
                            <CardContent className="p-0">
                                {/* All Categories Button */}
                                <button
                                    id="category-all"
                                    onClick={() => handleCategoryClick(null)}
                                    className={`flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition-all border-b ${selectedCategory === null
                                        ? "bg-primary/5 text-primary border-l-2 border-l-primary"
                                        : "text-foreground hover:bg-muted/50"
                                        }`}
                                >
                                    <span className="flex items-center gap-2.5">
                                        <LayoutGrid className="h-4 w-4" />
                                        All Categories
                                    </span>
                                    <Badge variant="secondary" className="text-[10px] font-bold">
                                        {allProductsCount}
                                    </Badge>
                                </button>

                                {/* Category Tree */}
                                <div className="py-1">
                                    {categories.map((cat) => (
                                        <div key={cat.id}>
                                            {/* Parent Category */}
                                            <div
                                                className={`flex items-center transition-all ${selectedCategory === cat.name
                                                    ? "bg-primary/5 border-l-2 border-l-primary"
                                                    : "hover:bg-muted/50 border-l-2 border-l-transparent"
                                                    }`}
                                            >
                                                {cat.children.length > 0 && (
                                                    <button
                                                        onClick={() => toggleExpand(cat.id)}
                                                        className="p-2 pl-3 text-muted-foreground hover:text-foreground transition-colors"
                                                    >
                                                        {expandedCategories.has(cat.id) ? (
                                                            <ChevronDown className="h-3.5 w-3.5" />
                                                        ) : (
                                                            <ChevronRight className="h-3.5 w-3.5" />
                                                        )}
                                                    </button>
                                                )}
                                                <button
                                                    id={`category-${cat.slug}`}
                                                    onClick={() => handleCategoryClick(cat.name)}
                                                    className={`flex flex-1 items-center justify-between py-2.5 pr-4 text-sm ${cat.children.length === 0 ? "pl-4" : ""
                                                        } ${selectedCategory === cat.name
                                                            ? "font-semibold text-primary"
                                                            : "text-foreground"
                                                        }`}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <Package className="h-3.5 w-3.5 text-muted-foreground" />
                                                        {cat.name}
                                                    </span>
                                                    <Badge variant="outline" className="text-[10px]">
                                                        {totalProductsInCategory(cat)}
                                                    </Badge>
                                                </button>
                                            </div>

                                            {/* Subcategories */}
                                            {cat.children.length > 0 &&
                                                expandedCategories.has(cat.id) && (
                                                    <div className="ml-6 border-l border-border">
                                                        {cat.children.map((sub) => (
                                                            <button
                                                                key={sub.id}
                                                                id={`category-${sub.slug}`}
                                                                onClick={() =>
                                                                    handleCategoryClick(sub.name)
                                                                }
                                                                className={`flex w-full items-center justify-between py-2 pl-4 pr-4 text-sm transition-all ${selectedCategory === sub.name
                                                                    ? "text-primary font-medium bg-primary/5"
                                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                                                                    }`}
                                                            >
                                                                <span>{sub.name}</span>
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-[10px]"
                                                                >
                                                                    {sub._count.products}
                                                                </Badge>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                        </div>
                                    ))}
                                </div>

                                {categories.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                        <Layers className="h-8 w-8 mb-2 opacity-40" />
                                        <p className="text-sm">No categories found</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Products Grid */}
                        <div className="flex flex-col gap-5">
                            {/* Active Filter Bar */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {selectedCategory && (
                                        <>
                                            <Badge className="gap-1.5 py-1 px-3">
                                                {selectedCategory}
                                            </Badge>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 text-xs text-muted-foreground"
                                                onClick={() => handleCategoryClick(null)}
                                            >
                                                Clear filter
                                            </Button>
                                        </>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-semibold text-foreground">
                                        {totalCount}
                                    </span>{" "}
                                    product{totalCount !== 1 ? "s" : ""}
                                </p>
                            </div>

                            {/* Loading State */}
                            {loading && (
                                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                                        <Card key={i} className="overflow-hidden animate-pulse">
                                            <div className="h-48 bg-muted" />
                                            <CardContent>
                                                <div className="space-y-3">
                                                    <div className="h-4 w-3/4 rounded bg-muted" />
                                                    <div className="h-3 w-1/2 rounded bg-muted" />
                                                    <div className="h-5 w-1/3 rounded bg-muted" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            {/* Products */}
                            {!loading && products.length > 0 && (
                                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {products.map((product) => {
                                        const image =
                                            product.images.find((img) => img.isPrimary) ||
                                            product.images[0];
                                        const tag =
                                            product.categories[0]?.name || "Uncategorized";

                                        return (
                                            <Link
                                                key={product.id}
                                                href={`/ecommerce/products/${product.id}`}
                                            >
                                                <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                                                    {image ? (
                                                        <Image
                                                            src={image.url}
                                                            alt={product.name}
                                                            className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
                                                            width={400}
                                                            height={400}
                                                            priority
                                                        />
                                                    ) : (
                                                        <div className="w-full h-48 bg-secondary flex items-center justify-center rounded-t-xl">
                                                            <span className="text-muted-foreground text-xs">
                                                                No Image Available
                                                            </span>
                                                        </div>
                                                    )}
                                                    <CardContent>
                                                        <div className="flex flex-col gap-3">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="flex flex-col min-w-0">
                                                                    <CardTitle className="line-clamp-1 text-sm">
                                                                        {product.name}
                                                                    </CardTitle>
                                                                    <CardDescription className="line-clamp-1 text-xs">
                                                                        {product.brand?.name}
                                                                    </CardDescription>
                                                                </div>
                                                                <div
                                                                    className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyles(product.status)}`}
                                                                >
                                                                    {product.status
                                                                        .split("_")
                                                                        .join(" ")}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-base font-bold">
                                                                    $
                                                                    {String(product.basePrice)}
                                                                </span>
                                                                <div className="px-2 py-0.5 rounded-md bg-primary text-secondary text-xs font-semibold text-center">
                                                                    {tag}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Empty State */}
                            {!loading && products.length === 0 && (
                                <Card className="flex flex-col items-center justify-center py-20">
                                    <Package className="h-12 w-12 text-muted-foreground/40 mb-3" />
                                    <p className="text-lg font-medium">No products found</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {selectedCategory
                                            ? `No products in "${selectedCategory}"`
                                            : "No products available yet"}
                                    </p>
                                    {selectedCategory && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-4"
                                            onClick={() => handleCategoryClick(null)}
                                        >
                                            View all products
                                        </Button>
                                    )}
                                </Card>
                            )}

                            {/* Pagination */}
                            {!loading && totalPages > 1 && (
                                <div className="flex items-center justify-center gap-1 pt-4">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        disabled={currentPage === 1}
                                        onClick={() => handlePageChange(1)}
                                    >
                                        <ChevronsLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        disabled={currentPage === 1}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    {getPaginationNumbers().map((item, idx) =>
                                        item === "ellipsis" ? (
                                            <span
                                                key={`ellipsis-${idx}`}
                                                className="px-2 text-muted-foreground text-sm"
                                            >
                                                …
                                            </span>
                                        ) : (
                                            <Button
                                                key={item}
                                                variant={
                                                    currentPage === item ? "default" : "outline"
                                                }
                                                size="icon"
                                                className="h-8 w-8 text-xs"
                                                onClick={() => handlePageChange(item)}
                                            >
                                                {item}
                                            </Button>
                                        )
                                    )}

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        disabled={currentPage === totalPages}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        disabled={currentPage === totalPages}
                                        onClick={() => handlePageChange(totalPages)}
                                    >
                                        <ChevronsRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default CategoriesPage;