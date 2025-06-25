"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Trash } from "lucide-react"
import { Pet } from "@/lib/types"
import { Input } from "./ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { useAtom } from "jotai"
import { darkmodeAtom } from "@/lib/store"

interface PetFormProps {
  initialData?: Partial<Pet>
  onSubmit: (data: Pet) => Promise<void>
  handleClose: () => void
  handleDelete: (id: string) => void
}

export default function PetForm({
  initialData = {},
  onSubmit,
  handleDelete,
}: PetFormProps) {
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
    await onSubmit(formData)
  }

  const [darkmode] = useAtom(darkmodeAtom)

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`${darkmode ? "bg-white" : "bg-gray-800"} rounded`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-1">
          {/* LEFT COLUMN */}
          <div className="space-y-3">
            <div>
              <label htmlFor="name" className="text-sm font-medium mb-1">
                Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="name"
                value={formData.name}
                onChange={handleChange}
                className={`border-none p-1 w-full rounded ${
                  darkmode ? "bg-[#e9edf3]" : "bg-gray-700"
                }`}
                required
              />
            </div>
            <div>
              <label htmlFor="age" className="text-sm font-medium mb-1">
                Age
              </label>
              <Input
                id="age"
                name="age"
                placeholder="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                className={`border-none p-1 w-full rounded ${
                  darkmode ? "bg-[#e9edf3]" : "bg-gray-700"
                }`}
              />
            </div>
            <div>
              <label htmlFor="type" className="text-sm font-medium mb-1">
                Type
              </label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger
                  className={`border-none p-1 w-full rounded ${
                    darkmode ? "bg-[#e9edf3]" : "bg-gray-700"
                  }`}
                >
                  <SelectValue placeholder="Select pet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dog">Dog</SelectItem>
                  <SelectItem value="Cat">Cat</SelectItem>
                  <SelectItem value="Horse">Horse</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="breed" className="text-sm font-medium mb-1">
                Breed
              </label>
              <Input
                id="breed"
                name="breed"
                type="text"
                placeholder="breed"
                value={formData.breed}
                onChange={handleChange}
                className={`border-none p-1 w-full rounded ${
                  darkmode ? "bg-[#e9edf3]" : "bg-gray-700"
                }`}
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-3">
            <div>
              <label htmlFor="description" className="text-sm font-medium mb-1">
                Description
              </label>
              <Input
                id="description"
                name="description"
                placeholder="description"
                value={formData.description}
                onChange={handleChange}
                className={`border-none p-1 w-full rounded ${
                  darkmode ? "bg-[#e9edf3]" : "bg-gray-700"
                }`}
              />
            </div>

            <div>
              <label htmlFor="notes" className="text-sm font-medium mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                placeholder="notes"
                value={formData.notes}
                onChange={handleChange}
                className={`border-none p-1 w-full rounded ${
                  darkmode ? "bg-[#e9edf3]" : "bg-gray-700"
                }`}
                rows={3}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            type="submit"
            className={` ${
              darkmode
                ? "bg-white hover:bg-gray-100 text-green-800"
                : "bg-gray-600 text-green-200 hover:bg-gray-700"
            }  cursor-pointer `}
          >
            <Check />
          </Button>
          <Button
            onClick={() => handleDelete(formData.$id)}
            className={` ${
              darkmode
                ? "bg-white hover:bg-gray-100 text-orange-800"
                : "bg-gray-600 text-orange-200 hover:bg-gray-700"
            }  cursor-pointer `}
          >
            <Trash size={18} />
          </Button>
        </div>
      </form>
    </>
  )
}
