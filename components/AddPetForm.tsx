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
import { Pet } from "@/lib/types"
import { Input } from "./ui/input"
import InfoCard from "./InfoCard"
import { useAtom } from "jotai"
import { addPetAtom } from "@/lib/store"

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
    drawing: "",
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

  const [, setAddPet] = useAtom(addPetAtom)

  return (
    <InfoCard
      title="Add Pet"
      action={
        <Button
          className="bg-white cursor-pointer hover:bg-gray-100 text-gray-800"
          onClick={() => setAddPet(false)}
        >
          <X />
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-1 w-full rounded"
            required
          />
        </div>

        {/* Type */}
        <div className="space-y-1">
          <label htmlFor="type" className="text-sm font-medium">
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

        {/* Age */}
        <div className="space-y-1">
          <label htmlFor="age" className="text-sm font-medium">
            Age
          </label>
          <Input
            id="age"
            name="age"
            type="text"
            placeholder="age"
            value={formData.age}
            onChange={handleChange}
            className="border p-1 w-full rounded"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            className="bg-white hover:bg-green-50 text-green-900 cursor-pointer"
          >
            <Check />
          </Button>
        </div>
      </form>
    </InfoCard>
  )
}
