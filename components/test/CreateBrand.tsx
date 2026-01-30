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
import FormInput from "@/components/form/FormInput";
import {Button} from "@/components/ui/button";
import {SubmitButton} from "@/components/form/buttons";
import {createBrandAction} from "@/utils/actions";

function CreateBrandComponent() {
    const company = faker.company.name()
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="flex flex-col items-center justify-center border-dashed border-2 cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-all h-full min-h-75 group">
                    <CardContent className="flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 rounded-full bg-secondary group-hover:bg-primary/10 transition-colors">
                            <Plus className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold text-lg">Add New Brand</h3>
                            <p className="text-sm text-muted-foreground">Expand your inventory</p>
                        </div>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-sm">
                <FormContainer action={createBrandAction}>
                    <DialogHeader>
                        <DialogTitle>Create Brand</DialogTitle>
                        <DialogDescription>
                            Create a Brand for your users.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 my-4">
                        <div className="grid gap-3">
                            <FormInput name={"name"} label={"Brand Name"} defaultValue={company} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <SubmitButton text={"create brand"} />
                    </DialogFooter>
                </FormContainer>
            </DialogContent>
        </Dialog>
    );
}

export default CreateBrandComponent;