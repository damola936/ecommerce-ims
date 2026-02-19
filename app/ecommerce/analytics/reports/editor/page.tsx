"use client"

import FormContainer from "@/components/form/FormContainer";
import { useEffect, useState } from "react";
import { Content } from "@tiptap/react";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { createReportAction } from "@/utils/actions";
import BreadcrumbComponent from "@/components/breadcrumbs/breadcrumbs";
import { SubmitButton } from "@/components/form/buttons";
import { uploadImageToBucket } from "@/utils/supabase-image-upload-delete";
import FormInput from "@/components/form/FormInput";
import { InputFile } from "@/components/form/InputFile";
import { faker } from "@faker-js/faker";
import { FileText, Image as ImageIcon, Sparkles, Wand2 } from "lucide-react";

function EditorPage() {
    const [value, setValue] = useState<Content>("")

    useEffect(() => {
        const fakeContent = `
            <h2>${faker.company.catchPhrase()}</h2>
            <p>${faker.lorem.paragraphs(2)}</p>
            <blockquote>${faker.hacker.phrase()}</blockquote>
            <p>${faker.lorem.paragraphs(3)}</p>
            <h3>Key Insights</h3>
            <ul>
                <li>${faker.company.buzzPhrase()}</li>
                <li>${faker.company.buzzPhrase()}</li>
                <li>${faker.company.buzzPhrase()}</li>
            </ul>
        `;
        setValue(fakeContent);
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <BreadcrumbComponent
                origin={{ label: "Reports", link: "/ecommerce/analytics/reports" }}
                child={{ label: "New Report" }}
            />

            <div className="mx-auto max-w-5xl px-6 mt-8">
                {/* Modern Editor Header */}
                <div className="mb-10 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider mb-4">
                        <Sparkles className="w-3 h-3" />
                        AI-Assisted Drafting
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-foreground mb-2 tracking-tight">
                        Compose Report
                    </h1>
                    <p className="text-muted-foreground">
                        Synthesize your insights into a professional intelligence document.
                    </p>
                </div>

                <FormContainer action={createReportAction} className="space-y-8">
                    {/* Top Configuration Card */}
                    <div className="bg-card text-card-foreground border border-border rounded-3xl p-6 md:p-8 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-foreground font-bold mb-2">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                    <span>General Information</span>
                                </div>
                                <FormInput
                                    name="title"
                                    label="Report Title"
                                    placeholder="e.g., Q1 Market Intelligence Analysis"
                                    className="bg-muted/50 border-input rounded-xl h-12 focus-visible:ring-2 focus-visible:ring-ring"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-foreground font-bold mb-2">
                                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                    <span>Media & Branding</span>
                                </div>
                                <div className="p-1.5 bg-muted/30 rounded-xl border-dashed border-2 border-border">
                                    <InputFile multiple={false} label="Featured Image" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Editor Canvas Card */}
                    <div className="bg-card text-card-foreground border border-border rounded-3xl overflow-hidden shadow-xl shadow-foreground/5">
                        <div className="px-6 py-4 bg-muted/50 border-b border-border flex items-center justify-between">
                            <span className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                                <Wand2 className="w-4 h-4" /> Content Canvas
                            </span>
                            <div className="flex gap-1">
                                <span className="w-2 h-2 rounded-full bg-destructive" />
                                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                            </div>
                        </div>

                        <div className="p-2">
                            <MinimalTiptapEditor
                                value={value}
                                onChange={setValue}
                                className="border-none shadow-none"
                                editorContentClassName="p-8 min-h-[500px] prose prose-neutral lg:prose-xl dark:prose-invert max-w-none focus:outline-none"
                                output="html"
                                placeholder="Start typing your report content here..."
                                autofocus={true}
                                editable={true}
                                editorClassName="focus:outline-hidden"
                                uploader={
                                    async (file: File): Promise<string> => {
                                        try {
                                            return await uploadImageToBucket(file)
                                        } catch (e) {
                                            console.error(e)
                                            return ""
                                        }
                                    }
                                }
                            />
                        </div>
                    </div>

                    <input type="hidden" name="content" value={value as string} />

                    <div className="flex justify-end pt-4 pb-12">
                        <SubmitButton
                            text="Publish Intelligence Report"
                            className="bg-primary text-primary-foreground hover:opacity-90 rounded-2xl px-10 h-14 font-black shadow-xl shadow-primary/20 active:scale-95 transition-all w-full md:w-auto"
                        />
                    </div>
                </FormContainer>
            </div>
        </div>
    )
}

export default EditorPage;