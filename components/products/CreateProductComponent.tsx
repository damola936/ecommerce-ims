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
import { Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import FormInput from "@/components/form/FormInput";
import NumberInput from "@/components/form/NumberInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import SelectInputCategory from "@/components/form/SelectInputCategory";
import { ColorCategories, SizeCategories } from "@/utils/ModelData";
import { InputFile } from "@/components/form/InputFile";
import FormContainer from "@/components/form/FormContainer";
import { createProductAction, fetchAllBrands, fetchAllProductCategories } from "@/utils/actions";
import { SubmitButton } from "@/components/form/buttons";
import { faker } from "@faker-js/faker";

async function CreateProductComponent() {
    const name = faker.commerce.productName()
    const price = parseInt(faker.commerce.price())
    const description = faker.lorem.sentence({ min: 30, max: 80 })
    const brands = await fetchAllBrands()
    const brandCategories = brands.map(brand => ({ category: brand.name }))
    const productCategories = await fetchAllProductCategories()
    const categories = productCategories.map(category => ({ category: category.name }))
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="flex flex-col items-center justify-center border-dashed border-2 cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-all h-full min-h-75 group">
                    <CardContent className="flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 rounded-full bg-secondary group-hover:bg-primary/10 transition-colors">
                            <Plus className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold text-lg">Add New Product</h3>
                            <p className="text-sm text-muted-foreground">Expand your inventory</p>
                        </div>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md md:max-w-2xl lg:max-w-4xl">
                <FormContainer action={createProductAction}>
                    <DialogHeader>
                        <DialogTitle>Create Product</DialogTitle>
                        <DialogDescription>
                            Create a Product, carefully fill the product details with the correct data.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 my-4">
                        <div className="grid gap-3">
                            <FormInput name={"name"} label={"Product Name"} defaultValue={name} />
                        </div>
                        <div className="grid gap-3">
                            <NumberInput defaultValue={price} name={"basePrice"} label={"Price ($)"} />
                        </div>
                        <div className={"grid gap-3"}>
                            <SelectInputCategory items={brandCategories} label={"Brand"} name={"brand"} />
                        </div>
                        <div className="grid gap-3">
                            <SelectInputCategory items={categories} label={"Categories"} name={"categories"} />
                        </div>
                        <div className="grid gap-3 ml-2">
                            <NumberInput defaultValue={100} name={"stock"} label={"Stock"} />
                        </div>
                        <div className="grid gap-3">
                            <SelectInputCategory items={ColorCategories} label={"Colors"} name={"color"} />
                        </div>
                        <div className="grid gap-3">
                            <SelectInputCategory items={SizeCategories} label={"Sizes"} name={"size"} />
                        </div>
                        <div className="grid gap-3 ml-2">
                            <NumberInput defaultValue={20} name={"weight"} label={"Weight (kg)"} />
                        </div>
                        <div className="grid gap-3">
                            <InputFile />
                        </div>
                        <div className="grid gap-3 col-span-full">
                            <TextAreaInput name={"description"} label={"Description"} defaultValue={description} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <SubmitButton text={"create product"} />
                    </DialogFooter>
                </FormContainer>
            </DialogContent>
        </Dialog>
    );
}

export default CreateProductComponent;