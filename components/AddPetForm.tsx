"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { petTypes } from "@/constants"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Pet } from "@/types"
import { Input } from "./ui/input"

interface AddPetFormProps {
  initialData?: Pet
  clientId: string
  onSubmit: (data: Pet) => Promise<void>
  handleClose: () => void
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
    drawing: "",
  },
  clientId,
  onSubmit,
  handleClose,
}: AddPetFormProps) {
  const [formData, setFormData] = useState<Pet>({
    ownerId: clientId || "",
    name: initialData.name || "",
    type: initialData.type || "",
    age: initialData.age || "",
    $id: initialData.$id || "",
    description: initialData.description || "",
    appointments: initialData.appointments || [],
    drawing: initialData.drawing || "",
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
      className="space-y-5 bg-white rounded-xl shadow-xl mt-5"
    >
      <div className="bg-gray-800 px-4 py-2 rounded-t-xl text-sm text-white font-medium flex justify-between">
        Add New Pet
        <X
          size={18}
          className="cursor-pointer text-gray-400 hover:text-gray-200"
          onClick={handleClose}
        />
      </div>

      <div className="space-y-4 p-4 max-w-3xl">
        <div className="">
          <label htmlFor="name" className="text-sm font-medium mb-1">
            Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="border p-1 w-full rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="type" className="text-sm font-medium mb-1">
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
          <label htmlFor="age" className="text-sm font-medium mb-1">
            Age
          </label>
          <Input
            id="age"
            name="age"
            type="text"
            value={formData.age}
            onChange={handleChange}
            className="border p-1 w-full rounded"
          />
        </div>
      </div>

      <div className="flex justify-end p-4">
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
