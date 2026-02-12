import { fetchReportById } from "@/utils/actions";
import SectionTitle from "@/components/global/SectionTitle";
import sanitizeHtml from "sanitize-html"
import BreadcrumbComponent from "@/components/breadcrumbs/breadcrumbs";
import { Calendar, Clock, Share2, Info } from "lucide-react";

async function SingleReportPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const report = await fetchReportById(id)

    if (report) {
        const { createdAt, title, content, coverImg } = report
        const date = new Date(createdAt).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        let displayContent = content;
        try {
            const parsed = JSON.parse(content);
            if (typeof parsed === 'string') {
                displayContent = parsed;
            }
        } catch (e) {
            // keep as is
        }

        const cleanContent = sanitizeHtml(displayContent, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                "iframe", "img", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "code", "pre"
            ]),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                "iframe": ["allow", "allowfullscreen", "frameborder", "scrolling", "src", "width", "height"],
                "img": ["src", "alt", "title", "width", "height", "loading"],
                "code": ["class"],
                "*": ["class", "id", "style"]
            }
        })

        return (
            <div className="min-h-screen bg-background text-foreground">
                {/* Modern Hero Header */}
                <div className="relative pt-8 pb-16 md:pt-12 md:pb-24 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-linear-to-b from-muted/50 to-transparent -z-10" />

                    <div className="max-w-6xl mx-auto px-6">
                        <BreadcrumbComponent
                            origin={{ label: "Reports", link: "/ecommerce/analytics/reports" }}
                            child={{ label: "Intelligence Report" }}
                        />

                        <div className="mt-12 max-w-4xl">
                            <div className="flex items-center gap-3 text-muted-foreground font-semibold text-sm tracking-wider uppercase mb-6">
                                <span className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground">Analytics</span>
                                <span className="w-1 h-1 rounded-full bg-border" />
                                <div className="flex items-center gap-1.5 text-muted-foreground normal-case font-medium">
                                    <Calendar className="w-4 h-4" />
                                    <span>{date}</span>
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-7xl font-black tracking-tight text-foreground leading-[1.1] mb-8">
                                {title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold border-2 border-background">
                                        AI
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-bold text-foreground">Intelligence Engine</p>
                                        <p className="text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> 5 min read
                                        </p>
                                    </div>
                                </div>

                                <button className="ml-auto inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold shadow-xl shadow-primary/10 hover:opacity-90 active:scale-95 transition-all">
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-6 pb-32">
                    {/* Featured Image */}
                    {coverImg && (
                        <div className="relative mb-20">
                            <div className="absolute inset-0 bg-primary/5 blur-3xl -z-10 rounded-full scale-90" />
                            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border border-border bg-card">
                                <img
                                    src={coverImg}
                                    alt={title}
                                    className="w-full aspect-21/9 object-cover"
                                />
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Main Content */}
                        <div className="lg:col-span-8">
                            <article className="prose prose-neutral lg:prose-xl dark:prose-invert max-w-none 
                                prose-headings:font-black prose-headings:tracking-tight prose-headings:text-foreground
                                prose-p:text-muted-foreground prose-p:leading-relaxed
                                prose-img:rounded-3xl prose-img:shadow-2xl prose-img:border prose-img:border-border
                                prose-blockquote:border-l-8 prose-blockquote:border-primary prose-blockquote:bg-muted/30 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-3xl prose-blockquote:not-italic prose-blockquote:font-medium
                                prose-strong:text-foreground
                                prose-code:bg-muted prose-code:text-foreground prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
                                <div dangerouslySetInnerHTML={{ __html: cleanContent }} />
                            </article>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-4 lg:sticky lg:top-8 h-fit space-y-8">
                            <div className="p-8 rounded-[2rem] bg-card border border-border shadow-xl shadow-foreground/5">
                                <h3 className="text-xl font-black text-foreground mb-6 flex items-center gap-3">
                                    <Info className="w-5 h-5 text-muted-foreground" />
                                    Metadata
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2">Report Identifier</p>
                                        <p className="font-mono text-sm text-foreground bg-muted/50 p-3 rounded-xl border border-border">
                                            {id}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center py-4 border-y border-border">
                                        <span className="text-muted-foreground font-medium">Author</span>
                                        <span className="font-bold text-foreground">Damola Jimoh(Admin)</span>
                                    </div>

                                    <div className="pt-4">
                                        <div className="p-4 rounded-2xl bg-muted/30 border border-border text-center">
                                            <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                                                This report was automatically generated for showcase purposes
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
            <div className="text-center">
                <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Info className="w-10 h-10 text-muted-foreground" />
                </div>
                <SectionTitle title="Report does not exist" />
            </div>
        </div>
    );
}

export default SingleReportPage;