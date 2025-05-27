import React, { ReactNode } from "react"
import { ArrowLeft, Edit, TrashIcon } from "lucide-react"
import Link from "next/link"

interface Detail {
  label: string
  value: ReactNode
}

interface DetailsCardProps {
  title?: string
  url: string
  details: Detail[]
  onEdit?: () => void
  onDelete?: () => void
  customActions?: ReactNode
}

const DetailsCard = ({
  title,
  url,
  details,
  onEdit,
  onDelete,
}: DetailsCardProps) => {
  return (
    <>
      <div className="flex justify-between w-full">
        <div className="flex">
          {title && (
            <Link
              href={url}
              className="flex text-gray-800 mb-2 text-sm cursor-pointer"
            >
              <ArrowLeft size={14} className="m-1" />
              {title}
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-xl flex flex-col justify-between border">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm mb-4 break-words">
          {details.map((detail, index) => (
            <React.Fragment key={index}>
              <div className="font-medium text-gray-600">{detail.label}:</div>
              <div className="text-gray-800 min-w-0">{detail.value}</div>
            </React.Fragment>
          ))}
        </div>
        <div className="flex gap-4 justify-end">
          <Edit
            size={14}
            onClick={onEdit}
            className="text-gray-400 hover:text-gray-800 cursor-pointer"
          />
          <TrashIcon
            size={14}
            onClick={onDelete}
            className="text-gray-400 hover:text-gray-800 cursor-pointer"
          />
        </div>
      </div>
    </>
  )
}

export default DetailsCard
