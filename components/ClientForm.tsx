"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Contact, HomeIcon, Mail, Phone, Trash } from "lucide-react"
import { Input } from "./ui/input"
import { Client } from "@/lib/types"
import { darkmodeAtom } from "@/lib/store"
import { useAtom } from "jotai"

interface ClientFormProps {
  initialData?: Partial<Client>
  userId: string
  setEdit?: (value: boolean) => void // 👈 Add this
  onSubmit: (data: Client) => Promise<void>
  handleDelete: (id: string) => void
}

export default function ClientForm({
  initialData = {},
  onSubmit,
  userId,
  handleDelete,
}: ClientFormProps) {
  const [formData, setFormData] = useState({
    $id: initialData.$id || "",
    name: initialData.name || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    address: initialData.address || "",
    pets: initialData.pets || [],
    userId: userId,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const [darkmode] = useAtom(darkmodeAtom)

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col justify-between w-full">
        <div className="w-full flex rounded">
          <Contact size={20} className="text-gray-600 m-2" />
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`${
              darkmode ? "bg-[#e9edf3]" : "bg-gray-700"
            } border-none shadow-none rounded   p-0 mt-1 `}
          />
        </div>
        <div className="w-full flex rounded">
          <HomeIcon size={20} className="text-gray-600 m-2" />
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`${
              darkmode ? "bg-[#e9edf3]" : "bg-gray-700"
            } border-none shadow-none rounded   p-0 mt-1 `}
          />
        </div>
        <div className="w-full flex">
          <Phone size={20} className="text-gray-600 m-2" />
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`${
              darkmode ? "bg-[#e9edf3]" : "bg-gray-700"
            } border-none shadow-none rounded   p-0 mt-1 `}
          />
        </div>
        <div className="w-full flex">
          <Mail size={20} className="text-gray-600 m-2" />
          <Input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`${
              darkmode ? "bg-[#e9edf3]" : "bg-gray-700"
            } border-none shadow-none rounded p-0 mt-1 `}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <Button
          type="submit"
          className="bg-white hover:bg-green-50 text-green-800 cursor-pointer p-5"
        >
          <Check />
        </Button>
        <Button
          className="bg-white hover:bg-orange-100 text-orange-800 cursor-pointer p-5"
          onClick={() => handleDelete(formData.$id)}
        >
          <Trash size={18} />
        </Button>
      </div>
    </form>
  )
}
