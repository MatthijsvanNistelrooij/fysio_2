import React from "react"
import { Card } from "./ui/card"

interface InfoCardProps {
  title?: React.ReactNode
  action?: React.ReactNode
  children?: React.ReactNode
}

const InfoCard = ({ title, action, children }: InfoCardProps) => {
  return (
    <Card className={`w-full p-5 bg-white border-none`}>
      {(title || action) && (
        <div className="flex justify-between items-center mb-3">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </Card>
  )
}

export default InfoCard
