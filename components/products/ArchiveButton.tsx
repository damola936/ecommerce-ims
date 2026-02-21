import React from 'react';
import { SubmitButton } from "@/components/form/buttons";
import { isProductArchived } from '@/utils/actions';

async function ArchiveButton({ id }: { id: string }) {
    const isArchived = await isProductArchived(id)
    if (!isArchived) {
        return (
            <SubmitButton text="archive" size="lg" variant="outline"
                          className="border-destructive text-destructive hover:bg-destructive/10 capitalize"/>
        );
    }
}

export default ArchiveButton;