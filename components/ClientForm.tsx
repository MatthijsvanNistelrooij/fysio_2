"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Contact, HomeIcon, Mail, Phone, Trash, X } from "lucide-react"
import { Client } from "@/types"
import { Input } from "./ui/input"

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
  setEdit,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex flex-row gap-2">
      <div className="w-full">
        <div className="flex flex-col lg:flex-row gap-2 justify-between w-full">
          <div className="w-full flex rounded">
            <Contact size={20} className="text-gray-600 m-2" />
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-blue-50 border-none shadow-none rounded-none text-gray-800  p-0 mt-1"
            />
          </div>
          <div className="w-full flex rounded">
            <HomeIcon size={20} className="text-gray-600 m-2" />
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="bg-blue-50 border-none shadow-none p-0 rounded-none text-gray-800 mt-1"
            />
          </div>
          <div className="w-full flex">
            <Phone size={20} className="text-gray-600 m-2" />
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="bg-blue-50 border-none shadow-none p-0 rounded-none text-gray-800 mt-1"
            />
          </div>
          <div className="w-full flex">
            <Mail size={20} className="text-gray-600 m-2" />
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-blue-50 border-none shadow-none p-0 rounded-none text-gray-800 mt-1"
            />
          </div>

          <Button
            type="button"
            className="bg-white hover:bg-gray-100 text-gray-800 cursor-pointer p-5"
            onClick={() => setEdit?.(false)}
          >
            <X size={18} />
          </Button>
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
      </div>
    </form>
  )
}
