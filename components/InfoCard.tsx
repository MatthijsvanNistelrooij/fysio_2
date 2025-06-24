import React from "react"
import { Card } from "./ui/card"
import { useAtom } from "jotai"
import { selectedPetAtom } from "@/lib/store"

interface InfoCardProps {
  title?: React.ReactNode
  action?: React.ReactNode
  children?: React.ReactNode
  active?: boolean
}

const InfoCard = ({ title, action, children, active }: InfoCardProps) => {
  const [selectedPet] = useAtom(selectedPetAtom)

  return (
    <Card
      className={`w-full p-5 bg-white rounded-xl ${
        selectedPet ? "" : ""
      } shadow-xl ${active ? "bg-[#e9edf3]" : ""}`}
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
