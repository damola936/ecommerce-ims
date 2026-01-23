"use client"

import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group"
import { useSearchParams, useRouter } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { useState} from "react"

import {SearchIcon} from "lucide-react";

function SearchProductInput() {
    const searchParams = useSearchParams()
    const {replace} = useRouter()
    const [search, setSearch] = useState(searchParams.get("search")?.toString() || "")
    const handleSearch = useDebouncedCallback((value: string) => {
        const params = new URLSearchParams(searchParams)
        if(value) {
            params.set("search", value)
        }
        else {
            params.delete("search")
        }
        replace(`/ecommerce/products/all?${params.toString()}`)
    }, 500)

    return (
        <InputGroup>
            <InputGroupInput onChange={(e) => {
                setSearch(e.target.value)
                handleSearch(e.target.value)
            }} placeholder="Search..." type={"search"} value={search} />
            <InputGroupAddon>
                <SearchIcon />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
                <InputGroupButton type={"submit"}>Search</InputGroupButton>
            </InputGroupAddon>
        </InputGroup>
    );
}

export default SearchProductInput;