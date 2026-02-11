import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";

function CreateReportComponent() {
    return (
        <Link href={"/ecommerce/analytics/reports/editor"} className="group">
            <Card
                className="flex flex-col items-center justify-center border-dashed border-2 border-border cursor-pointer hover:border-muted-foreground/50 hover:bg-muted/50 transition-all duration-300 h-full min-h-[300px] rounded-2xl bg-card text-card-foreground shadow-sm hover:shadow-xl">
                <CardContent className="flex flex-col items-center justify-center space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/5 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500" />
                        <div className="relative p-6 rounded-2xl bg-muted group-hover:bg-accent transition-colors duration-300">
                            <Plus className="w-12 h-12 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="font-black text-xl text-foreground mb-2">Create a new Report</h3>
                        <p className="text-sm text-muted-foreground font-medium tracking-tight">Create a new synthetic analysis report</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

export default CreateReportComponent;