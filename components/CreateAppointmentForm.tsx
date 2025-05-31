"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { Appointment } from "@/types"

interface CreateAppointmentFormProps {
  petId: string
  userId: string
  onSubmit: (data: Appointment) => Promise<void>
}

export default function CreateAppointmentForm({
  petId,
  onSubmit,
  userId,
}: CreateAppointmentFormProps) {
  const [formData, setFormData] = useState({
    $id: "",
    description: "",
    treatment: "",
    date: new Date(),
    petId: petId,
    userId: userId,
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

    console.log("Submitting payload:", payload)

    await onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 shadow-xl rounded">
      <div>
        <input
          id="date"
          name="date"
          type="date"
          value={formatDateForInput(formData.date)}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
      </div>
      <div>
        <textarea
          id="description"
          name="description"
          placeholder="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full rounded font-light"
          required
          rows={3}
        />
      </div>

      <div>
        <input
          id="treatment"
          name="treatment"
          type="text"
          placeholder="treatment"
          value={formData.treatment}
          onChange={handleChange}
          className="border p-2 w-full rounded font-light"
          required
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-white text-gray-800 hover:bg-gray-100 cursor-pointer"
        >
          <Check />
        </Button>
      </div>
    </form>
  )
}
