"use client"

import { Button } from "@/components/ui/button"
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
import FormInput from "@/components/form/FormInput";
import NumberInput from "@/components/form/NumberInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import SelectInputCategory from "@/components/form/SelectInputCategory";
import { ColorCategories, SizeCategories } from "@/utils/ModelData";
import FormContainer from "@/components/form/FormContainer";
import { editProductAction, deleteProductImageAction } from "@/utils/actions";
import { SubmitButton } from "@/components/form/buttons";
import React, { useTransition } from "react";
import { ProductVariant, Brand, ProductImage } from "@/lib/generated/prisma";
import Image from "next/image";
import AddImageDialog from "@/components/products/AddImageDialog";
import { toast } from "sonner";
import { ReloadIcon } from "@radix-ui/react-icons";

export interface CorrectedProductVariant extends Omit<ProductVariant, 'price' | 'attributes' | 'dimensions'> {
    price: number;
    attributes: {
        color: string;
        size: string;
    };
    dimensions: {
        length: number;
        width: number;
        height: number;
    };
}

interface EditProductDialogProps {
    name: string;
    images: ProductImage[];
    brand: Brand | null;
    correctedProductVariants: CorrectedProductVariant[];
    categories: { name: string }[];
    description: string;
    sku: string;
    id: string;
    brands: Brand[];
    productCategories: { id: string; name: string }[];
}

function EditProductDialog({ name, images, brand, correctedProductVariants, categories, description, sku, id, brands, productCategories }: EditProductDialogProps) {
    const brandCategories = brands.map(brand => ({ category: brand.name }))
    const allCategories = productCategories.map(category => ({ category: category.name }))
    const variantsCategories = correctedProductVariants?.map((variant: CorrectedProductVariant) => ({ category: variant.attributes?.color || '' })) || []
    const [variant, setVariant] = React.useState<CorrectedProductVariant>((correctedProductVariants?.[0] || {}) as unknown as CorrectedProductVariant)

    const [isPending, startTransition] = useTransition();
    const [resetKey, setResetKey] = React.useState(0);

    const handleVariantChange = (color: string) => {
        const selected = correctedProductVariants?.find((v: CorrectedProductVariant) => v.attributes?.color === color) || correctedProductVariants?.[0];
        if (selected) {
            setVariant(selected);
        }
    }

    const handleDeleteImage = (imageId: string, imageUrl: string) => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("imageId", imageId);
            formData.append("productId", id);
            formData.append("imageUrl", imageUrl);
            const result = await deleteProductImageAction(null, formData);
            if (result.message) {
                toast(result.message);
            }
        });
    }

    React.useEffect(() => {
        setVariant(correctedProductVariants?.[0] || ({} as CorrectedProductVariant))
        setResetKey(prev => prev + 1) // Forces re-mount of the form below
    }, [correctedProductVariants])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="lg" className="capitalize cursor-pointer w-18">edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md md:max-w-2xl lg:max-w-4xl">
                <FormContainer action={editProductAction}>
                    <DialogHeader>
                        <DialogTitle>Edit Product {name}</DialogTitle>
                        <DialogDescription>
                            Edit a Product, carefully fill the product details with the correct data.
                        </DialogDescription>
                    </DialogHeader>
                    <div key={`${variant.id}-${resetKey}`} className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 my-4">
                        <div className="grid gap-3">
                            <SelectInputCategory items={variantsCategories} label={"Variants"} name={"variants"} value={variant.attributes?.color || ''} onValueChange={handleVariantChange} />
                        </div>
                        <div className="grid gap-3 ml-2">
                            <FormInput name={"name"} label={"Product Name"} defaultValue={name} />
                        </div>
                        <div className="grid gap-3">
                            <NumberInput defaultValue={Number(variant.price)} name={"price"} label={"Price ($)"} />
                        </div>
                        <div className={"grid gap-3"}>
                            <SelectInputCategory items={brandCategories} label={"Brand"} name={"brand"} defaultValue={brand?.name} />
                        </div>
                        <div className="grid gap-3 ml-2">
                            <SelectInputCategory items={allCategories} label={"Categories"} name={"categories"} defaultValue={categories[0]?.name || ''} />
                        </div>
                        <div className="grid gap-3 ml-4">
                            <NumberInput defaultValue={variant.stock} name={"stock"} label={"Stock"} />
                        </div>
                        <div className="grid gap-3 ml-2">
                            <NumberInput defaultValue={variant.weight || 0} name={"weight"} label={"Weight (kg)"} />
                        </div>
                        <div className={"grid gap-3 col-span-full w-full"}>
                            <div className={"flex flex-col border border-secondary rounded-md p-4"}>
                                <div className={"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"}>
                                    {images.map((image: ProductImage, index) => (
                                        <div key={index} className={"flex flex-col items-center gap-2 border rounded-md p-2 group relative"}>
                                            <div className="relative w-24 h-24">
                                                <Image key={index} className={"rounded-md object-cover"} fill src={image.url} alt={`product image for ${name}`} />
                                            </div>
                                            <Button
                                                type="button"
                                                onClick={() => handleDeleteImage(image.id, image.url)}
                                                disabled={isPending}
                                                variant="destructive"
                                                className="w-24 capitalize cursor-pointer"
                                            >
                                                {isPending ? <ReloadIcon className="h-4 w-4 animate-spin" /> : "delete"}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <AddImageDialog id={id} />
                            </div>
                        </div>
                        <div className="grid gap-3 col-span-full">
                            <TextAreaInput name={"description"} label={"Description"} defaultValue={description} />
                        </div>
                        <div className="grid gap-3">
                            <SelectInputCategory items={ColorCategories} label={"Colors"} name={"color"} defaultValue={variant.attributes?.color} />
                        </div>
                        <div className="grid gap-3 ml-2">
                            <SelectInputCategory items={SizeCategories} label={"Sizes"} name={"size"} defaultValue={variant.attributes?.size} />
                        </div>
                        <div className={"grid gap-3 ml-4"}>
                            <NumberInput defaultValue={variant.dimensions?.length} name={"length"} label={"Length"} />
                        </div>
                        <div className={"grid gap-3"}>
                            <NumberInput defaultValue={variant.dimensions?.width} name={"width"} label={"Width"} />
                        </div>
                        <div className={"grid gap-3"}>
                            <NumberInput defaultValue={variant.dimensions?.height} name={"height"} label={"Height"} />
                        </div>
                        <input type="hidden" name="productId" value={id} />
                        <input type="hidden" name="variantId" value={variant.id} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <SubmitButton text={"edit product"} />
                    </DialogFooter>
                </FormContainer>
            </DialogContent>
        </Dialog>
    )
}
export default EditProductDialog