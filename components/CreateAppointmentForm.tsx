"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
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
import { useAtom } from "jotai"
import { darkmodeAtom } from "@/lib/store"

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
    type: "",
  })
  const [darkmode] = useAtom(darkmodeAtom)

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
    <form
      onSubmit={handleSubmit}
      className={`  ${darkmode ? "bg-white" : "bg-gray-800"}`}
    >
      <div className="flex justify-between">
        <div className="w-full">
          <div className="mb-2">
            <Select
              value={formData.type}
              onValueChange={(value: string) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger
                className={`${
                  darkmode ? "bg-[#e9edf3]" : "bg-gray-700"
                } border-none shadow-none rounded p-0 mt-1 `}
              >
                <SelectValue placeholder="Select appointment type" />
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
            <Input
              id="date"
              name="date"
              type="date"
              value={formatDateForInput(formData.date)}
              onChange={handleChange}
              className={`${
                darkmode ? "bg-[#e9edf3]" : "bg-gray-700"
              } border-none shadow-none rounded p-0 mt-1 `}
              required
            />
          </div>
          <div>
            <Textarea
              id="description"
              name="description"
              placeholder="description"
              value={formData.description}
              onChange={handleChange}
              className={`${
                darkmode ? "bg-[#e9edf3]" : "bg-gray-700"
              } border-none shadow-none rounded p-0 mt-1 `}
              required
              rows={3}
            />
          </div>

          <div>
            <Input
              id="treatment"
              name="treatment"
              type="text"
              placeholder="treatment"
              value={formData.treatment}
              onChange={handleChange}
              className={`${
                darkmode ? "bg-[#e9edf3]" : "bg-gray-700"
              } border-none shadow-none rounded p-0 mt-1 `}
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-2">
        <Button
          type="submit"
          className="bg-white text-green-800 hover:bg-green-50 cursor-pointer"
        >
          <Check />
        </Button>
      </div>
    </form>
  )
}
