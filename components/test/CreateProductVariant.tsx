import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Card, CardContent} from "@/components/ui/card";
import {Plus} from "lucide-react";
import FormContainer from "@/components/form/FormContainer";
import {Button} from "@/components/ui/button";
import {SubmitButton} from "@/components/form/buttons";
import SelectInputCategory from "@/components/form/SelectInputCategory";
import {createVariantAction} from "@/utils/actions";
import {FullProduct} from "@/utils/types";
import NumberInput from "@/components/form/NumberInput";
import {ColorCategories, SizeCategories} from "@/utils/ModelData";

function CreateProductVariantComponent({products}: {products: FullProduct[]}) {
    const productCategories = products.map(product => ({category: product.name}))
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="flex flex-col items-center justify-center border-dashed border-2 cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-all h-full min-h-75 group">
                    <CardContent className="flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 rounded-full bg-secondary group-hover:bg-primary/10 transition-colors">
                            <Plus className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold text-lg">Create a Product Variant</h3>
                            <p className="text-sm text-muted-foreground">Expand your inventory</p>
                        </div>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
                <FormContainer action={createVariantAction}>
                    <DialogHeader>
                        <DialogTitle>Create a Product Variant</DialogTitle>
                        <DialogDescription>
                            Create a variant for an existing product. E.g a new color, size e.t.c.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 my-4">
                        <div className={"grid gap-3"}>
                            <SelectInputCategory items={productCategories} label={"For Product:"} name={"product"} />
                        </div>
                        <div className={"grid gap-3 ml-2"}>
                            <NumberInput defaultValue={100} name={"stock"} label={"Stock"} />
                        </div>
                        <div className={"grid gap-3"}>
                            <SelectInputCategory items={ColorCategories} label={"Colors"} name={"color"} />
                        </div>
                        <div className={"grid gap-3"}>
                            <SelectInputCategory items={SizeCategories} label={"Sizes"} name={"size"} />
                        </div>
                        <div className={"grid gap-3 ml-2"}>
                            <NumberInput defaultValue={20} name={"weight"} label={"Weight (kg)"} />
                        </div>
                        <div className={"grid gap-3"}>
                            <NumberInput defaultValue={10} name={"length"} label={"Length"} />
                        </div>
                        <div className={"grid gap-3"}>
                            <NumberInput defaultValue={10} name={"width"} label={"Width"} />
                        </div>
                        <div className={"grid gap-3"}>
                            <NumberInput defaultValue={10} name={"height"} label={"Height"} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <SubmitButton text={"create variant"} />
                    </DialogFooter>
                </FormContainer>
            </DialogContent>
        </Dialog>
    );
}

export default CreateProductVariantComponent;
