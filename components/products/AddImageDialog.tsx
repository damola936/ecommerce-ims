import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogClose,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import React from "react";
import {InputFile} from "@/components/form/InputFile";
import FormContainer from "@/components/form/FormContainer";
import {SubmitButton} from "@/components/form/buttons";
import {addImageAction} from "@/utils/actions";

function AddImageDialog({id}: { id: string }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="lg" className="capitalize cursor-pointer mt-4">Add Image</Button>
            </DialogTrigger>
            <DialogContent className={"sm:max-w-md"}>
                <FormContainer action={addImageAction}>
                    <DialogHeader>
                        <DialogTitle>Add Product Images</DialogTitle>
                        <DialogDescription>
                            Upload one or more images for this product.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 my-4">
                        <InputFile multiple={true} label="Select Images" />
                        <input type="hidden" name="id" value={id} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">Cancel</Button>
                        </DialogClose>
                        <SubmitButton text="Upload" />
                    </DialogFooter>
                </FormContainer>
            </DialogContent>
        </Dialog>
    );
}

export default AddImageDialog;
