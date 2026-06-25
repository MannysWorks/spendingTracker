import { type ReactNode } from "react"
import Card from "./Card"

interface props {
    totalAssets: number
    totalAssetsChange: number
    endOfDayBal: number
    RobinHoodBal: number
    percentChange: number
    isLoading: boolean
}

function AssetSummary({ totalAssets, totalAssetsChange, endOfDayBal, RobinHoodBal, percentChange, isLoading }: props) {
    const placeHolder: ReactNode =
        <div className="col-12 col-lg-3 col-sm-6 mb-2 pe-2 placeholder-glow">
            <div className="placeholder rounded w-100" style={{ height: '110px' }}>
            </div>
        </div>

    const renderCard = (
        body: number,
        title: string,
        variant: "highlight" | "default" | "dark" = "default",
        format: "currency" | "percent" = "currency",
        change?: number,
        border?: boolean
    ) => (
        isLoading ? placeHolder :
            <div className="col-12 col-lg-3 col-sm-6 mb-2 pe-2">
                <Card cardBody={body} cardTitle={title} variant={variant} format={format} change={change} border={border} />
            </div>
    )

    return (
        <div className="row p-3 pb-0">
            {renderCard(totalAssets, "Total Assets", "highlight", "currency", totalAssetsChange)}
            {renderCard(endOfDayBal, "End of Day Balance", "default", "currency", endOfDayBal, true)}
            {renderCard(RobinHoodBal, "Robin Hood", "default", "currency", RobinHoodBal, true)}
            {renderCard(percentChange, "Percent Change", "dark", "percent")}
        </div>
    )
}

export default AssetSummary