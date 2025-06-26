/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { updateAppointment } from "@/app/api/appointments/route"

const locales = {
  "en-US": enUS,
}

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
}

interface FormData {
  name: string
  service: string
  time: string
  start: Date | null
  end: Date | null
}

interface MyCalendarProps {
  events: Event[]
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>
}

export const MyCalendar = ({ events, setEvents }: MyCalendarProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    service: "",
    time: "",
    start: null,
    end: null,
  })
  const [open, setOpen] = useState(false)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)

  const combineDateAndTime = (date: Date, time: string): Date => {
    const [hours, minutes] = time.split(":").map(Number)
    const combined = new Date(date)
    combined.setHours(hours)
    combined.setMinutes(minutes)
    combined.setSeconds(0)
    combined.setMilliseconds(0)
    return combined
  }

  const handleSlotSelect = (slotInfo: SlotInfo) => {
    // Check for overlapping event
    const overlappingEvent = events.find(
      (event) => slotInfo.start >= event.start && slotInfo.start < event.end
    )

    if (overlappingEvent) {
      handleEventClick(overlappingEvent)
    } else {
      setEditingEventId(null)
      setFormData({
        name: "",
        service: "",
        time: "",
        start: slotInfo.start,
        end: slotInfo.end,
      })
      setOpen(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.start && formData.time) {
      const combinedStart = combineDateAndTime(formData.start, formData.time)
      const combinedEnd = new Date(combinedStart.getTime() + 30 * 60 * 1000) // 30min default duration

      const newEventData = {
        name: formData.name,
        service: formData.service,
        date: combinedStart.toISOString(),
      }

      try {
        if (editingEventId) {
          await updateAppointment(editingEventId, newEventData as any)

          setEvents((prev) =>
            prev.map((evt) =>
              evt.id === editingEventId
                ? {
                    ...evt,
                    title: `${formData.name} – ${formData.service}`,
                    start: combinedStart,
                    end: combinedEnd,
                  }
                : evt
            )
          )
        } else {
          // const newAppointment = await createAppointment(petId, newEventData)
          // setEvents([
          //   ...events,
          //   {
          //     id: newAppointment.$id,
          //     title: `${formData.name} – ${formData.service}`,
          //     start: combinedStart,
          //     end: combinedEnd,
          //   },
          // ])
        }

        setOpen(false)
        setEditingEventId(null)
      } catch (error) {
        console.error("Failed to save appointment", error)
      }
    }
  }

  const handleEventClick = (event: Event) => {
    // router.push(`/appointments/${event.id}`)
    setEditingEventId(event.id)

    const [name, service] = event.title.split(" – ")
    const hours = event.start.getHours().toString().padStart(2, "0")
    const minutes = event.start.getMinutes().toString().padStart(2, "0")

    setFormData({
      name,
      service,
      time: `${hours}:${minutes}`,
      start: event.start,
      end: event.end,
    })

    setOpen(true)
  }
  return (
    <div className="text-white">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Description"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <Input
              placeholder="Service (e.g. Massage, Exercise)"
              value={formData.service}
              onChange={(e) =>
                setFormData({ ...formData, service: e.target.value })
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
              <Button type="submit">Confirm Appointment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Calendar
        localizer={localizer}
        events={events}
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
