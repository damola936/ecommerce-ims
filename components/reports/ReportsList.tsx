import { Report } from "@/lib/generated/prisma";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

function ReportsList({ reports }: { reports: Report[] }) {
  return (
    <>
      {reports.map((report) => {
        const date = new Date(report.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        return (
          <Link key={report.id} href={`/ecommerce/analytics/reports/${report.id}`} className="group relative">
            <Card className="overflow-hidden border-border shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col rounded-2xl bg-card text-card-foreground">
              <div className="relative aspect-video w-full overflow-hidden">
                {report.coverImg ? (
                  <Image
                    src={report.coverImg}
                    alt={report.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    width={400}
                    height={225}
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-secondary-foreground font-bold text-xs uppercase">RE</span>
                    </div>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-card/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm border border-border">
                    Analytics
                  </span>
                </div>
              </div>

              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="font-bold text-foreground line-clamp-2 leading-tight mb-2 group-hover:text-primary transition-colors">
                    {report.title}
                  </h3>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    {date}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter group-hover:text-primary transition-colors">
                    View Details →
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </>
  );
}

export default ReportsList;