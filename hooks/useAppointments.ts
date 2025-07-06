// hooks/useAppointments.ts
"use client"

import { useEffect, useState } from "react"
import { Appointment } from "@/lib/types"
import { Event } from "@/components/MyCalendar"

interface UseAppointmentsResult {
  appointments: Appointment[]
  events: Event[]
  loading: boolean
  error: string | null
}

export const useAppointments = (
  userId: string | null
): UseAppointmentsResult => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    const fetchAppointments = async () => {
      try {
        const response = await fetch(`/api/appointments?userId=${userId}`)
        if (!response.ok) throw new Error("Failed to fetch appointments")

        const data = await response.json()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedAppointments: Appointment[] = data.map((doc: any) => ({
          $id: doc.$id,
          description: doc.description,
          treatment: doc.treatment,
          date: doc.date,
          petId: doc.petId,
          userId: doc.userId,
          type: doc.type,
        }))

        setAppointments(formattedAppointments)

        const calendarEvents: Event[] = formattedAppointments.map((appt) => {
          const start = new Date(appt.date)
          const end = new Date(start.getTime() + 30 * 60 * 1000)

          return {
            id: appt.$id,
            title: `${appt.description} – ${appt.type}`,
            start,
            end,
            petId: appt.petId,
            type: appt.type,
          }
        })

        setEvents(calendarEvents)
      } catch (err) {
        setError((err as Error).message || "Failed to fetch appointments")
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [userId])

  return { appointments, events, loading, error }
}
