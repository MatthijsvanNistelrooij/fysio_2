import React from "react"
import { toast } from "sonner"
import { Client } from "@/lib/types"
import { useAtom } from "jotai"
import { darkmodeAtom } from "@/lib/store"

type OwnerInfoProps = {
  client: Client
  handleEditToggle: () => void
}

const OwnerInfo = ({ client }: OwnerInfoProps) => {
  const [darkmode] = useAtom(darkmodeAtom)
  return (
    <div className="flex flex-col w-full pb-10">
      <div
        className={`flex items-center min-w-[140px] flex-1 text-sm p-1 ${
          darkmode ? "hover:bg-[#e9edf3] " : "hover:bg-gray-700"
        } cursor-pointer rounded-md `}
        onClick={() => {
          navigator.clipboard.writeText(client.name)
          toast.success("Client name copied to clipboard!")
        }}
      >
        <div className="text-sm ml-1">{client.name}</div>
      </div>
      <div
        className={`flex items-center min-w-[140px] flex-1 text-sm p-1 ${
          darkmode ? "hover:bg-[#e9edf3] " : "hover:bg-gray-700"
        } cursor-pointer rounded-md `}
        onClick={() => {
          navigator.clipboard.writeText(client.address)
          toast.success("Address copied to clipboard!")
        }}
      >
        <div className="ml-1">{client.address}</div>
      </div>
      <div
        className={`flex items-center min-w-[140px] flex-1 text-sm p-1 ${
          darkmode ? "hover:bg-[#e9edf3] " : "hover:bg-gray-700"
        } cursor-pointer rounded-md `}
        onClick={() => {
          navigator.clipboard.writeText(client.phone)
          toast.success("Phone number copied to clipboard!")
        }}
      >
        <div className="ml-1">{client.phone}</div>
      </div>

      <div
        className={`flex items-center min-w-[140px] flex-1 text-sm p-1 ${
          darkmode ? "hover:bg-[#e9edf3] " : "hover:bg-gray-700"
        } cursor-pointer rounded-md `}
        onClick={() => {
          navigator.clipboard.writeText(client.email)
          toast.success("Email copied to clipboard!")
        }}
      >
        <div className="ml-1">{client.email}</div>
      </div>
    </div>
  )
}

export default OwnerInfo
