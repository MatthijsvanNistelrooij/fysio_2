"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { Client } from "@/types"

interface ClientFormProps {
  initialData?: Partial<Client>
  onSubmit: (data: Client) => Promise<void>
}

export default function ClientForm({
  initialData = {},
  onSubmit,
}: ClientFormProps) {
  const [formData, setFormData] = useState({
    $id: initialData.$id || "",
    name: initialData.name || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    address: initialData.address || "",
    pets: initialData.pets || [],
    userId: initialData.$id || "",
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
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 rounded shadow"
    >
      <div>
        <label htmlFor="name" className="block font-semibold">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block font-semibold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="block font-semibold">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <label htmlFor="address" className="block font-semibold">
          Address
        </label>
        <input
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-gray-800 hover:bg-gray-700 cursor-pointer"
        >
          <Check />
        </Button>
      </div>
    </form>
  )
}
