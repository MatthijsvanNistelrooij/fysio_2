"use client"
import React, { useEffect, useState } from "react"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Event, MyCalendar } from "@/components/MyCalendar"
import { Appointment, User } from "@/lib/types"

import InfoCard from "@/components/InfoCard"
import CustomContainer from "@/components/CustomContainer"
import { getCurrentUser } from "@/app/api/users/route"
import { getAppointmentsByUserId } from "@/app/api/appointments/route"

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
        type: doc.type,
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

  console.log("appointments here", appointments)

  return (
    <CustomContainer>
      <InfoCard>
        <MyCalendar events={events} setEvents={setEvents} />
      </InfoCard>
    </CustomContainer>
  )
}

export default Appointments
