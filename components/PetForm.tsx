"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { Pet } from "@/types"

interface PetFormProps {
  initialData?: Partial<Pet>
  onSubmit: (data: Pet) => Promise<void>
}

export default function PetForm({ initialData = {}, onSubmit }: PetFormProps) {
  const [formData, setFormData] = useState({
    $id: initialData.$id || "",
    name: initialData.name || "",
    type: initialData.type || "",
    breed: initialData.breed || "",
    age: initialData.age || "",
    notes: initialData.notes || "",
    ownerId: initialData.ownerId || "",
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
        <label htmlFor="type" className="block font-semibold">
          Type
        </label>
        <input
          id="type"
          name="type"
          type="text"
          value={formData.type}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="breed" className="block font-semibold">
          Breed
        </label>
        <input
          id="breed"
          name="breed"
          type="text"
          value={formData.breed}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <label htmlFor="age" className="block font-semibold">
          Age
        </label>
        <input
          id="age"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <label htmlFor="age" className="block font-semibold">
          Description
        </label>
        <input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block font-semibold">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="border p-2 w-full rounded resize-none"
          rows={3}
        />
      </div>

      <div className="flex gap-2 justify-end">
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
