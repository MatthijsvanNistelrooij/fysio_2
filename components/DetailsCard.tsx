import React, { ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface Detail {
  label: string
  value: ReactNode
}

interface DetailsCardProps {
  title?: string
  details: Detail[]
  onEdit?: () => void
  onDelete?: () => void
  customActions?: ReactNode
}

const DetailsCard = ({
  title,
  details,
  onEdit,
  onDelete,
  customActions,
}: DetailsCardProps) => {
  return (
    <div className="bg-white rounded p-5 flex flex-col justify-between min-w-[400px]">
      {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}

      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
        {details.map((detail, index) => (
          <React.Fragment key={index}>
            <div className="font-medium text-gray-600">{detail.label}:</div>
            <div className="text-gray-800">{detail.value}</div>
          </React.Fragment>
        ))}
      </div>

      {(onEdit || onDelete || customActions) && (
        <div className="flex justify-end gap-2 mt-4">
          {customActions}
          {onEdit && (
            <Button
              onClick={onEdit}
              className="cursor-pointer bg-gray-800 hover:bg-gray-700"
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              onClick={onDelete}
              className="cursor-pointer bg-gray-800 hover:bg-gray-700"
            >
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default DetailsCard
