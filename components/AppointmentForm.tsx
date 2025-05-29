"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { Appointment } from "@/types"

interface AppointmentFormProps {
  initialData?: Appointment
  onSubmit: (data: Appointment) => Promise<void>
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
  },
  onSubmit,
  onClick,
}: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    $id: initialData.$id || "",
    description: initialData.description || "",
    treatment: initialData.treatment || "",
    date: initialData.date || new Date(),
    petId: initialData.petId || "",
    userId: initialData.userId || "",
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
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white rounded-xl w-full"
    >
      <div className="w-full flex justify-end">
        <X onClick={onClick} className="cursor-pointer text-gray-400 hover:text-gray-800" />
      </div>
      <div>
        <label htmlFor="description" className="block font-semibold">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="treatment" className="block font-semibold">
          Treatment
        </label>
        <input
          id="treatment"
          name="treatment"
          type="text"
          value={formData.treatment}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="date" className="block font-semibold">
          Date
        </label>
        <input
          id="date"
          name="date"
          type="date"
          value={formData.date ? formatDateForInput(formData.date) : ""}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-white hover:bg-gray-100 text-gray-800 cursor-pointer"
        >
          <Check />
        </Button>
      </div>
    </form>
  )
}
