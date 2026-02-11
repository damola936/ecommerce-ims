import BreadcrumbComponent from "@/components/breadcrumbs/breadcrumbs";
import SearchProductInput from "@/components/products/SearchProductInput";
import Container from "@/components/global/container";
import CreateReportComponent from "@/components/reports/CreateReportComponent";
import {fetchAllReports} from "@/utils/actions";
import {PaginationComponent} from "@/components/global/PaginationComponent";
import ReportsList from "@/components/reports/ReportsList";

async function AnalyticsReportsPage({searchParams}: { searchParams: Promise<{ search?: string, page?: string }> }) {
    const {search = "", page = "1"} = await searchParams;
    const {reports, totalCount} = await fetchAllReports({search, page: parseInt(page)})
    return (
        <div>
            <BreadcrumbComponent origin={{label: "Analytics", link: "/ecommerce/analytics/reports"}}
                                 child={{label: "Reports"}}/>
            <div className={"max-w-md mx-auto"}><SearchProductInput/></div>
            <Container>
                <div className={"grid md:grid-cols-3 lg:grid-cols-4 gap-6"}>
                    <CreateReportComponent/>
                    <ReportsList reports={reports}/>
                </div>
            </Container>
            <div className={"max-w-md mx-auto mb-4"}><PaginationComponent length={totalCount} currentPage={parseInt(page)}/></div>
        </div>
    );
}

export default AnalyticsReportsPage;