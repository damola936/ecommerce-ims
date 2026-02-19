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
import { Label } from "@/components/ui/label";

function SelectInputCategory({ items, label, name, defaultValue, value, onValueChange }: { items: { category: string }[], label: string, name?: string, defaultValue?: string, value?: any, onValueChange?: (value: string) => void }) {
    return (
        <>
            <Label>{label || name}</Label>
            <Select name={name} defaultValue={defaultValue} value={value} onValueChange={onValueChange}>
                <SelectTrigger className="w-45">
                    <SelectValue placeholder={`Select from ${name}`} />
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
