import { type ReactNode } from "react"
import Card from "./Card"
interface props {
    totalAssets: number
    endOfDayBal: number
    RobinHoodBal: number
    percentChange: number
    isLoading: boolean
}
function AssetSummary({ totalAssets, endOfDayBal, RobinHoodBal, percentChange, isLoading }: props) {
    const placeHolder: ReactNode =
        <div className="col-12 col-lg-3 col-sm-6 mb-2 pe-2 placeholder-glow">
            <div className="placeholder rounded w-100" style={{ height: '75px' }}>
            </div>
        </div>

    const renderCard = (body: number, title: string) => (
        isLoading ? placeHolder :
            <div className="col-12 col-lg-3 col-sm-6 mb-2 pe-2">
                <Card cardBody={body} cardTitle={title}></Card>
            </div>
    )

    return (
        <div className="row p-3 pb-0">
            {renderCard(totalAssets, "Total Assets")}
            {renderCard(endOfDayBal, "End of Day Balance")}
            {renderCard(RobinHoodBal, "RobinHood Balance")}
            {renderCard(percentChange, "Percent Change")}
        </div>
    )
}


export default AssetSummary