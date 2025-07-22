import React from "react"
import { Card } from "./ui/card"
import { useAtom } from "jotai"
import { darkmodeAtom } from "@/lib/store"

interface InfoCardProps {
  title?: React.ReactNode
  action?: React.ReactNode
  children?: React.ReactNode
}

const InfoCard = ({ title, action, children }: InfoCardProps) => {
  const [darkmode] = useAtom(darkmodeAtom)

  return (
    <Card
      className={`w-full p-5 ${
        darkmode ? "bg-white" : "bg-gray-800 border border-gray-700"
      } rounded-md shadow-xl ${darkmode ? "text-gray-800" : "text-amber-50"}`}
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
