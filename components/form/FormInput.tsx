import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

type InputProps = {
    name: string;
    label?: string;
    defaultValue?: string;
    placeholder?: string;
}


function FormInput({name, label, defaultValue, placeholder}: InputProps) {
    return (
        <>
            <Label htmlFor={name}>{label || name}</Label>
            <Input  id={name} name={name} defaultValue={defaultValue || ""} placeholder={placeholder} required />
        </>
    );
}

export default FormInput;