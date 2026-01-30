"use client"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import React from "react"
import { usePathname } from "next/navigation"

export function PaginationComponent({length, currentPage}: { length: number, currentPage: number}) {
    const pathname = usePathname()
    const pages = Math.ceil(length / 7)
    const numArray = Array.from({ length: pages }, (_, i) => i + 1)
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href={currentPage > 1 ? `${pathname}?page=${currentPage - 1}` : "#"}/>
                </PaginationItem>
                {numArray.map((num, index) => (
                    <React.Fragment key={index}>
                        <PaginationItem>
                            <PaginationLink 
                                href={`${pathname}?page=${num}`}
                                isActive={currentPage === num}
                            >
                                {num}
                            </PaginationLink>
                        </PaginationItem>
                        {(index > 1 && index % 3 === 0 && index < length )&& (
                            <PaginationItem>
                                <PaginationEllipsis/>
                            </PaginationItem>
                        )}
                    </React.Fragment>
                ))}
                <PaginationItem>
                    <PaginationNext href={currentPage < pages ? `${pathname}?page=${currentPage + 1}` : "#"}/>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
