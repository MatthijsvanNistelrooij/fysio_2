"use client"
import { useState } from "react"
import { Calendar, dateFnsLocalizer, SlotInfo } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { enUS } from "date-fns/locale"
import "react-big-calendar/lib/css/react-big-calendar.css"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { clientsAtom, darkmodeAtom } from "@/lib/store"
import { useAtom } from "jotai"
import { Pet } from "@/lib/types"
import { useClients } from "@/hooks/useClients"
import { Select } from "@radix-ui/react-select"
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { appointmentTypes } from "@/constants"
import { toast } from "sonner"

const locales = { "en-US": enUS }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export interface Event {
  id: string
  title: string
  start: Date
  end: Date
  petId?: string
  petName?: string
}

interface FormData {
  name: string
  type: string
  time: string
  start: Date | null
  end: Date | null
  petId: string
  petName: string
}
interface MyCalendarProps {
  events: Event[]
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>
}

export const MyCalendar = ({ events, setEvents }: MyCalendarProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    type: "",
    time: "",
    start: null,
    end: null,
    petId: "",
    petName: "",
  })

  const [open, setOpen] = useState(false)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [clients] = useAtom(clientsAtom)
  useClients()

  const pets: Pet[] = clients?.flatMap((client) => client.pets || []) || []

  const combineDateAndTime = (date: Date, time: string): Date => {
    const [hours, minutes] = time.split(":").map(Number)
    const combined = new Date(date)
    combined.setHours(hours, minutes, 0, 0)
    return combined
  }

  const handleSlotSelect = (slotInfo: SlotInfo) => {
    const overlappingEvent = events.find(
      (event) => slotInfo.start >= event.start && slotInfo.start < event.end
    )

    if (overlappingEvent) {
      handleEventClick(overlappingEvent)
    } else {
      setEditingEventId(null)
      setFormData({
        name: "",
        type: "",
        time: "",
        start: slotInfo.start,
        end: slotInfo.end,
        petId: "",
        petName: "",
      })
      setOpen(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.start || !formData.time || !formData.petId) {
      console.warn("Missing required data")
      return
    }

    const combinedStart = combineDateAndTime(formData.start, formData.time)

    const payload = {
      description: formData.name,
      treatment: formData.type,
      date: combinedStart.toISOString(),
      petId: formData.petId,
      type: formData.type,
    }

    try {
      if (editingEventId) {
        // update appointment
        const response = await fetch(`/api/appointments/${editingEventId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!response.ok) throw new Error("Failed to update")
        const updated = await response.json()

        const matchedPet = pets.find((p) => p.$id === updated.petId)
        setEvents((prev) =>
          prev.map((evt) =>
            evt.id === editingEventId
              ? {
                  id: updated.$id,
                  title: `${updated.description} – ${updated.treatment}`,
                  start: new Date(updated.date),
                  end: new Date(
                    new Date(updated.date).getTime() + 30 * 60 * 1000
                  ),
                  petId: updated.petId,
                  petName: matchedPet?.name || "",
                }
              : evt
          )
        )
        toast.success("Appointment updated successfully!")
      } else {
        // create appointment
        const response = await fetch(`/api/appointments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!response.ok) throw new Error("Failed to create")
        const created = await response.json()

        const matchedPet = pets.find((p) => p.$id === created.petId)
        setEvents((prev) => [
          ...prev,
          {
            id: created.$id,
            title: `${created.description} – ${created.treatment}`,
            start: new Date(created.date),
            end: new Date(new Date(created.date).getTime() + 30 * 60 * 1000),
            petId: created.petId,
            petName: matchedPet?.name || "",
          },
        ])
        toast.success("Appointment added successfully!")
      }

      setOpen(false)
      setEditingEventId(null)
    } catch (error) {
      console.error("Failed to save appointment", error)
    }
  }

  const handleEventClick = (event: Event) => {
    setEditingEventId(event.id)
    const [petName, name, type] = event.title.split(" – ")
    const hours = event.start.getHours().toString().padStart(2, "0")
    const minutes = event.start.getMinutes().toString().padStart(2, "0")

    setFormData({
      name,
      type,
      time: `${hours}:${minutes}`,
      start: event.start,
      end: event.end,
      petId: event?.petId || "",
      petName: petName || "",
    })

    setOpen(true)
  }

  const [darkmode] = useAtom(darkmodeAtom)

  const enrichedEvents = events.map((event) => {
    const matchedPet = pets.find((p) => p.$id === event.petId)
    const petName = matchedPet?.name || "Pet"
    const [name, type] = event.title.split(" – ")
    return {
      ...event,
      title: `${petName} – ${name} – ${type}`,
    }
  })

  return (
    <div
      className={
        !darkmode ? "text-white bg-gray-800" : "text-gray-800 bg-white"
      }
    >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="text-gray-700">
          <DialogHeader>
            <DialogTitle>
              {!!formData.petId ? "Edit Appointment" : "Add Appointment"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              value={formData.petId}
              disabled={!!formData.petId} // true als petId bestaat, dus select is uitgeschakeld
              onValueChange={(value: string) => {
                const selectedPet = pets.find((p) => p.$id === value)
                setFormData({
                  ...formData,
                  petId: value,
                  petName: selectedPet?.name || "",
                })
              }}
            >
              <SelectTrigger className={`w-full rounded`}>
                <SelectValue placeholder="Select pet" />
              </SelectTrigger>
              <SelectContent>
                {pets?.map((pet) => (
                  <SelectItem key={pet.$id} value={pet.$id}>
                    {pet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={formData.type}
              onValueChange={(value: string) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger className={`w-full rounded `}>
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
            <Input
              placeholder="Description"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <Input
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              required
            />

            <DialogFooter>
              <Button type="submit" className="bg-gray-800 cursor-pointer">
                Confirm
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Calendar
        localizer={localizer}
        events={enrichedEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSlotSelect}
        onSelectEvent={handleEventClick}
      />
    </div>
  )
}
