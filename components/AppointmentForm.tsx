"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Trash } from "lucide-react"
import { Appointment } from "@/lib/types"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { appointmentTypes } from "@/constants"
import { darkmodeAtom } from "@/lib/store"
import { useAtom } from "jotai"

interface AppointmentFormProps {
  initialData?: Appointment
  onSubmit: (data: Appointment) => Promise<void>
  onDelete: (appointmentId: string) => void
  onClick: () => void
}

export default function AppointmentForm({
  initialData = {
    $id: "",
    description: "",
    treatment: "",
    date: new Date(),
    petId: "",
    userId: "",
    type: "",
  },
  onSubmit,
  onClick,
  onDelete,
}: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    $id: initialData.$id || "",
    description: initialData.description || "",
    treatment: initialData.treatment || "",
    date: initialData.date || new Date(),
    petId: initialData.petId || "",
    userId: initialData.userId || "",
    type: initialData.type || "",
  })

  const formatDateForInput = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date

    if (isNaN(d.getTime())) return "" // handle invalid dates safely

    const year = d.getFullYear()
    const month = (d.getMonth() + 1).toString().padStart(2, "0")
    const day = d.getDate().toString().padStart(2, "0")

    return `${year}-${month}-${day}`
  }

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

    const payload: Appointment = {
      ...formData,
      date: new Date(formData.date),
    }

    await onSubmit(payload)
    onClick()
    onClick()
  }

  const [darkmode] = useAtom(darkmodeAtom)

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-5 ${darkmode ? "bg-white" : "bg-gray-800" } rounded-xl w-full `}  
    >
      <div className="w-full">
        <label htmlFor="date" className="block font-semibold">
          Date
        </label>
        <Input
          id="date"
          name="date"
          type="date"
          value={formData.date ? formatDateForInput(formData.date) : ""}
          onChange={handleChange}
          className={`border-none p-1 w-full rounded ${
            darkmode ? "bg-[#e9edf3]" : "bg-gray-700"
          }`}
        />
      </div>
      <div className="w-full">
        <label htmlFor="type" className="text-sm font-medium mb-1">
          Type
        </label>
        <Select
          value={formData.type}
          onValueChange={(value: string) =>
            setFormData({ ...formData, type: value })
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
            {appointmentTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="description" className="block font-semibold mt-2">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`border-none p-1 w-full rounded ${
            darkmode ? "bg-[#e9edf3]" : "bg-gray-700"
          }`}
          required
          rows={3}
        />
      </div>
      <div>
        <label htmlFor="treatment" className="block font-semibold">
          Treatment
        </label>
        <Input
          id="treatment"
          name="treatment"
          type="text"
          value={formData.treatment}
          onChange={handleChange}
          className={`border-none p-1 w-full rounded ${
            darkmode ? "bg-[#e9edf3]" : "bg-gray-700"
          }`}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="submit"
          className="bg-white hover:bg-green-50 text-green-800 cursor-pointer"
        >
          <Check />
        </Button>
        <Button
          type="button"
          onClick={() => onDelete(initialData.$id)}
          className="text-orange-800 bg-white hover:bg-orange-100 cursor-pointer"
        >
          <Trash size={20} />
        </Button>
      </div>
    </form>
  )
}
