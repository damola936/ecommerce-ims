import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InputFile({multiple, label = "Picture(s)"}: {multiple?: boolean, label?: string}) {
    return (
        <>
            { multiple? <Label htmlFor="picture">{label}</Label>: <Label htmlFor="picture">{label}</Label>}
            <Input id="picture" type="file" multiple={multiple} accept="image/*" name={"images"} />
        </>
    )
}
