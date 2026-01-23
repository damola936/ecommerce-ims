import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
    return (
        <Card className="w-75 pt-0">
            <Skeleton className="w-full h-48 rounded-b-none" />
            <CardContent>
                <div className="flex flex-col items-center text-center">
                    <div className={"flex flex-col justify-evenly w-full"}>
                        <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                        <Skeleton className="h-4 w-1/2 mx-auto mb-6" />
                        <div className={"flex justify-center items-center gap-4 mt-6"}>
                            <Skeleton className="h-6 w-12" />
                            <Skeleton className="h-6 w-16" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
