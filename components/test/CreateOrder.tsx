import {faker} from "@faker-js/faker";
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
import {createOrderAction} from "@/utils/actions";
import {User} from "@/lib/generated/prisma/client";
import {FullProduct} from "@/utils/types";
import NumberInput from "@/components/form/NumberInput";

function CreateOrderComponent({users, products}: {users: User[], products: FullProduct[]}) {
    const userCategories = users.map(user => ({category: user.email}))
    const productCategories = products.map(product => ({category: product.name}))
    const statusCategories = [
        {category: "PENDING"},
        {category: "PROCESSING"},
        {category: "COMPLETED"},
        {category: "CANCELLED"},
        {category: "REFUNDED"}
    ]
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="flex flex-col items-center justify-center border-dashed border-2 cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-all h-full min-h-75 group">
                    <CardContent className="flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 rounded-full bg-secondary group-hover:bg-primary/10 transition-colors">
                            <Plus className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold text-lg">Create an Order</h3>
                            <p className="text-sm text-muted-foreground">Create an Order for testing purposes</p>
                        </div>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
                <FormContainer action={createOrderAction}>
                    <DialogHeader>
                        <DialogTitle>Create Order</DialogTitle>
                        <DialogDescription>
                            Create an Order for Testing
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 my-4">
                    <div className={"grid gap-3"}>
                        <SelectInputCategory items={userCategories} label={"For User:"} name={"user"} />
                    </div>
                    <div className={"grid gap-3 ml-2"}>
                        <SelectInputCategory items={productCategories} label={"With Product:"} name={"product"} />
                    </div>
                    <div className={"grid gap-3 ml-4"}>
                        <NumberInput name={"quantity"} label={"Quantity"} defaultValue={1}/>
                    </div>
                    <div className={"grid gap-3"}>
                        <SelectInputCategory items={statusCategories} label={"Status"} name={"status"} />
                    </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <SubmitButton text={"create order"} />
                    </DialogFooter>
                </FormContainer>
            </DialogContent>
        </Dialog>
    );
}

export default CreateOrderComponent;