import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function InputFile() {
    return (
        <>
            <Label htmlFor="picture">Picture(s)</Label>
            <Input id="picture" type="file" multiple={true} accept="image/*" name={"images"} />
        </>
    )
}
