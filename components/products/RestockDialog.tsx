import React from 'react';
import { SubmitButton } from "@/components/form/buttons";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import NumberInput from "@/components/form/NumberInput";
import FormContainer from "@/components/form/FormContainer";
import { restockProductAction } from "@/utils/actions";
import { Button } from "@/components/ui/button";
import { ProductVariant } from "@/lib/generated/prisma";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectGroup } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

function RestockDialog({ name, id, variants }: { name: string, id: string, variants: ProductVariant[] }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="lg" className="capitalize">restock</Button>
            </DialogTrigger>
            <DialogContent className={"sm:max-w-md md:max-w-lg lg:max-w-xl"}>
                <FormContainer action={restockProductAction}>
                    <DialogHeader>
                        <DialogTitle>Restock Product: {name}</DialogTitle>
                        <DialogDescription>
                            Expand your inventory for this product.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 my-4">
                        <div className="grid gap-3 ml-2">
                            <NumberInput defaultValue={100} name={"stock"} label={"Stock"} />
                        </div>
                        <input type="hidden" name={"id"} value={id} />
                        <div className={"grid gap-3"}>
                            <Label>Variant</Label>
                            <Select name={"variantId"}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Variant" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Variants</SelectLabel>
                                        {variants.map((variant) => (
                                            <SelectItem key={variant.id} value={variant.id}>
                                                {variant.id}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <SubmitButton text={"Restock"} />
                    </DialogFooter>
                </FormContainer>
            </DialogContent>
        </Dialog>
    );
}

export default RestockDialog;