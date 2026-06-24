import { type ReactNode } from "react"
import { Wallet, TrendingUp } from "lucide-react"
import "../css/Card.css"

interface CardProps {
    cardTitle: string
    cardBody: number
    format?: "currency" | "percent"
    variant?: "highlight" | "default" | "dark"
    change?: number // only used on the highlight card
}

function Card({ cardTitle, cardBody, format = "currency", variant = "default", change }: CardProps) {
    const formattedValue =
        format === "percent"
            ? `${cardBody}%`
            : `$${cardBody.toLocaleString()}`

    return (
        <div className={`asset-card asset-card--${variant}`}>
            <div className="asset-card__header">
                {variant === "highlight" && (
                    <span className="asset-card__icon-badge">
                        <Wallet size={16} strokeWidth={2.5} />
                    </span>
                )}
                <span className="asset-card__title">{cardTitle}</span>
            </div>

            <div className="asset-card__value-row">
                <span className="asset-card__value">{formattedValue}</span>
                {variant === "dark" && (
                    <TrendingUp size={20} className="asset-card__trend-icon" />
                )}
            </div>

            {variant === "highlight" && typeof change === "number" && (
                <div className="asset-card__change">
                    {change >= 0 ? "+" : ""}{change.toFixed(1)}% from previous entry
                </div>
            )}
        </div>
    )
}

export default Card