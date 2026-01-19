import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Label} from "@/components/ui/label";

function SelectInputCategory({items, label, name}:{items: { category: string }[], label: string, name?: string}) {
    return (
        <>
            <Label>{name || label}</Label>
            <Select name={name}>
                <SelectTrigger className="w-45">
                    <SelectValue placeholder= {`Select from ${name}`} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{label}</SelectLabel>
                        {items.map(item => (
                            <SelectItem value={item.category} key={item.category}>{item.category}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </>

    )
}

export default SelectInputCategory
