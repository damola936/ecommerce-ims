"use client"

import {useActionState} from "react";
import { useEffect } from "react"
import { toast } from "sonner"
import { ActionFunction } from "@/utils/types"

const initialState = {
    message: ""
}

function FormContainer({action, children, className}: {action: ActionFunction, children: React.ReactNode, className?: string}) {
    const [state, formAction] = useActionState(action, initialState)
    useEffect(() => {
        if (state.message) {
            toast(state.message)
        }
    }, [state])
    return (
        <form action={formAction} className={className}>
            {children}
        </form>
    )
}

export default FormContainer