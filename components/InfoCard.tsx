import React from "react"
import { Card } from "./ui/card"

interface InfoCardProps {
  title?: React.ReactNode
  action?: React.ReactNode
  children?: React.ReactNode
  active?: boolean
}

const InfoCard = ({ title, action, children, active }: InfoCardProps) => {
  return (
    <Card
      className={`w-full p-5 rounded-xl shadow-2xl ${
        active ? "border-blue-300" : ""
      }`}
    >
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
