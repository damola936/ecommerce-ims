import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InputFile({ multiple = true, label = "Picture(s)", name = "images" }: { multiple?: boolean, label?: string, name?: string }) {
    return (
        <>
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} type="file" multiple={multiple} accept="image/*" name={name} />
        </>
    )
}
