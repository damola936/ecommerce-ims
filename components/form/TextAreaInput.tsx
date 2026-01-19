import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type TextAreaInputProps = {
    name: string
    label: string
    defaultValue?: string
    placeholder?: string
}

function TextAreaInput({label, defaultValue, placeholder, name}: TextAreaInputProps) {
    return (
        <>
            <Label htmlFor={name}>{label || name}</Label>
            <Textarea id={name} name={name} defaultValue={defaultValue} placeholder={placeholder || "Enter description"} rows={5} required />
        </>
    )
}

export default TextAreaInput;