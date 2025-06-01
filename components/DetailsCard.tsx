import React, { ReactNode } from "react"
import { ArrowLeft, Edit, TrashIcon } from "lucide-react"
import Link from "next/link"

interface DetailsCardProps {
 url: string
  details: []
  onEdit?: () => void
  onDelete?: () => void
  customActions?: ReactNode
}

const DetailsCard = ({
  url,
  onEdit,
  onDelete,
}: DetailsCardProps) => {
  return (
    <>
      <div className="bg-white">
        <div className="bg-gray-800 h-8 w-full rounded-t-xl">
          <div className="flex justify-between">
            <Link
              href={url}
              className="flex text-gray-800 mb-3 text-sm cursor-pointer"
            >
              <ArrowLeft
                size={20}
                className="m-2 text-gray-400 hover:text-gray-100"
              />
            </Link>
            <div className="flex m-2 gap-2">
              <Edit
                size={18}
                onClick={onEdit}
                className="text-gray-400 hover:text-gray-100 cursor-pointer"
              />
              <TrashIcon
                size={18}
                onClick={onDelete}
                className="text-orange-400 hover:bg-orange-50 cursor-pointer"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row">

        </div>
      </div>
    </>
  )
}

export default DetailsCard
