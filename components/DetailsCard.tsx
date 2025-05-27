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
    <div className="bg-white rounded-2xl p-5 shadow-xl flex flex-col justify-between w-full max-w-full">
      {title && (
        <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm mb-4 break-words">
        {details.map((detail, index) => (
          <React.Fragment key={index}>
            <div className="font-medium text-gray-600">{detail.label}:</div>
            <div className="text-gray-800 min-w-0">{detail.value}</div>
          </React.Fragment>
        ))}
      </div>

      {(onEdit || onDelete || customActions) && (
        <div className="flex justify-end flex-wrap gap-2 mt-4">
          {customActions}
          {onEdit && (
            <Button
              onClick={onEdit}
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              onClick={onDelete}
              className="bg-gray-800 hover:bg-gray-700 text-white"
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
