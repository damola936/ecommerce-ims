import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

type InputProps = {
    name: string;
    label?: string;
    defaultValue?: string;
    placeholder?: string;
    className?: string;
}


function FormInput({name, label, defaultValue, placeholder, className}: InputProps) {
    return (
        <>
            <Label htmlFor={name}>{label || name}</Label>
            <Input  id={name} name={name} defaultValue={defaultValue || ""} placeholder={placeholder} required className={className} />
        </>
    );
}

export default FormInput;