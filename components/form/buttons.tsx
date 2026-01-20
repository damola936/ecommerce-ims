'use client';

import {ReloadIcon} from '@radix-ui/react-icons';
import {useFormStatus} from 'react-dom';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';


type btnSize = 'default' | 'lg' | 'sm';

interface SubmitButtonProps {
    className?: string;
    text?: string;
    size?: btnSize;
    variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
}

export function SubmitButton({className = "", text = "submit", size = "lg", variant = "default"}: SubmitButtonProps) {
    const {pending} = useFormStatus()
    return (
        <Button type="submit" disabled={pending} variant={variant} className={cn("capitalize cursor-pointer", className)}>
            {pending ? <><ReloadIcon className='mr-2 h-4 w-4 animate-spin'/> Please wait...</> : text}
        </Button>
    )
}