import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface FormInputPriceProps {
    defaultValue?: number;
    name: string;
    label: string;
}

function NumberInput({ defaultValue, name, label }: FormInputPriceProps) {
    return (
        <>
            <Label htmlFor={name} className="capitalize">{label}</Label>
            <Input id={name} name={name} type="number" min={0} defaultValue={defaultValue || 100} required />
        </>

    )
}
export default NumberInput
