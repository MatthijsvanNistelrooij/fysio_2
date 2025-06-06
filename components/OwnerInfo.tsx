import React from "react"
import { Button } from "./ui/button"
import { Contact, Edit, HomeIcon, Mail, Phone } from "lucide-react"
import { toast } from "sonner"
import { Client } from "@/types"

type OwnerInfoProps = {
  client: Client
  handleEditToggle: () => void
}

const OwnerInfo = ({ client, handleEditToggle }: OwnerInfoProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-2 w-full">
      <div
        className="flex items-center min-w-[140px] flex-1 text-sm p-1"
        onClick={() => {
          navigator.clipboard.writeText(client.name)
          toast.success("Client name copied to clipboard!")
        }}
      >
        <Contact size={18} className="text-xs text-gray-300 m-1" />
        <div className="text-sm ml-1">{client.name}</div>
      </div>
      <div
        className="flex items-center min-w-[140px] flex-1 text-sm p-1"
        onClick={() => {
          navigator.clipboard.writeText(client.address)
          toast.success("Address copied to clipboard!")
        }}
      >
        <HomeIcon size={18} className="text-xs text-gray-300 m-1" />
        <div className="ml-1">{client.address}</div>
      </div>
      <div
        className="flex items-center min-w-[140px] flex-1 text-sm p-1"
        onClick={() => {
          navigator.clipboard.writeText(client.phone)
          toast.success("Phone number copied to clipboard!")
        }}
      >
        <Phone size={18} className="text-xs text-gray-300 m-1" />

        <div className="ml-1">{client.phone}</div>
      </div>

      <div
        className="flex items-center min-w-[140px] flex-1 text-sm p-1"
        onClick={() => {
          navigator.clipboard.writeText(client.email)
          toast.success("Email copied to clipboard!")
        }}
      >
        <Mail size={18} className="text-xs text-gray-300 m-1" />
        <div className="ml-1">{client.email}</div>
      </div>

      <Button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          e.currentTarget.blur()
          handleEditToggle()
        }}
        className="text-gray-800 bg-white rounded-none p-5 hover:bg-gray-100 cursor-pointer"
      >
        <Edit size={20} />
      </Button>
    </div>
  )
}

export default OwnerInfo
