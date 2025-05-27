"use client"
import React, { useEffect, useState } from "react"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Event, MyCalendar } from "@/components/MyCalendar"
import { Appointment, User } from "@/types"
import { getCurrentUser } from "@/lib/user.actions"
import { getAppointmentsByUserId } from "@/lib/appointment.actions"

const Appointments = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (!user) return

    const fetchClients = async () => {
      const data = await getAppointmentsByUserId(user.$id)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedAppointments: Appointment[] = data.map((doc: any) => ({
        $id: doc.$id,
        description: doc.description,
        treatment: doc.treatment,
        date: doc.date,
        petId: doc.petId,
        userId: doc.userId,
      }))

      setAppointments(formattedAppointments)

      // 🔁 Convert to events for calendar
      const calendarEvents: Event[] = formattedAppointments.map((appt) => {
        const start = new Date(appt.date)
        const end = new Date(start.getTime() + 30 * 60 * 1000) // default 30min duration

        return {
          id: appt.$id,
          title: `${appt.description} – ${appt.treatment}`,
          start,
          end,
        }
      })

      setEvents(calendarEvents)
    }

    fetchClients()
  }, [user])

  console.log("appointments  here", appointments)

  return (
    <div className="h-screen flex justify-center bg-gray-50">
      <div className="main-container  bg-white max-w-7xl w-full border rounded-3xl m-5">
        <MyCalendar events={events} setEvents={setEvents} />
      </div>
    </div>
  )
}

export default Appointments
