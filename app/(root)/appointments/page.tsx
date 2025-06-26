"use client"
import React, { useEffect, useState } from "react"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Event, MyCalendar } from "@/components/MyCalendar"
import { Appointment, User } from "@/lib/types"

import InfoCard from "@/components/InfoCard"
import CustomContainer from "@/components/CustomContainer"
import { getCurrentUser } from "@/lib/appwrite/users"

const Appointments = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [, setAppointments] = useState<Appointment[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.log(error)
        setError("Failed to fetch user")
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (!user) return

    async function fetchAppointments() {
      try {
        const response = await fetch(`/api/appointments?userId=${user?.$id}`)
        if (!response.ok) throw new Error("Failed to fetch appointments")

        const data = await response.json()

        // Formatteer de appointments
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

        // Maak events voor de kalender
        const calendarEvents: Event[] = formattedAppointments.map((appt) => {
          const start = new Date(appt.date)
          const end = new Date(start.getTime() + 30 * 60 * 1000) // 30 minuten

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
      } catch (e) {
        setError((e as Error).message || "Failed to fetch appointments")
      }
    }
    fetchAppointments()
  }, [user])

  if (loading)
    return (
      <div className="h-screen w-full flex justify-center items-center text-center">
        Loading...
      </div>
    )
  if (error)
    return (
      <div className="h-screen w-full flex justify-center items-center text-center">
        {error}
      </div>
    )

  return (
    <CustomContainer>
      <InfoCard>
        <MyCalendar events={events} setEvents={setEvents} />
      </InfoCard>
    </CustomContainer>
  )
}

export default Appointments
