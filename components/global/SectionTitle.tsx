import { Separator } from "../ui/separator"

function SectionTitle({ title }: { title: string }) {
    return (
        <div>
            <h2 className="text-3xl font-bold tracking-wider capitalize mb-8">{title}</h2>
            <Separator />
        </div>
    )
}
export default SectionTitle