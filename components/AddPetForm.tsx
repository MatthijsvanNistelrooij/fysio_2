"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { petTypes } from "@/constants"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Pet } from "@/types"

interface AddPetFormProps {
  initialData?: Pet
  clientId: string
  onSubmit: (data: Pet) => Promise<void>
}

export default function AddPetForm({
  initialData = {
    ownerId: "",
    name: "",
    type: "",
    age: "",
    $id: "",
    description: "",
    appointments: [],
  },
  clientId,
  onSubmit,
}: AddPetFormProps) {
  const [formData, setFormData] = useState<Pet>({
    ownerId: clientId || "",
    name: initialData.name || "",
    type: initialData.type || "",
    age: initialData.age || "",
    $id: initialData.$id || "",
    description: initialData.description || "",
    appointments: initialData.appointments || [],
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting form data:", formData)
    await onSubmit(formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 rounded-xl shadow-xl"
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
        <label htmlFor="type" className="block font-semibold mb-1">
          Type
        </label>
        <Select
          value={formData.type}
          onValueChange={(value: string) =>
            setFormData({ ...formData, type: value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select pet type" />
          </SelectTrigger>
          <SelectContent>
            {petTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="age" className="block font-semibold">
          Age
        </label>
        <input
          id="age"
          name="age"
          type="text"
          value={formData.age}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-white hover:bg-gray-100 text-gray-900 cursor-pointer"
        >
          <Check />
        </Button>
      </div>
    </form>
  )
}
