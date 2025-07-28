"use client"

import React from "react"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { MyCalendar } from "@/components/MyCalendar"
import InfoCard from "@/components/InfoCard"
import CustomContainer from "@/components/CustomContainer"
import { useUser } from "@/context/UserContextProvider"
import { useAppointments } from "@/hooks/useAppointments"

const Appointments = () => {
  const { user } = useUser()
  const { events, loading, error } = useAppointments(user?.$id ?? null)

  if (loading)
    return (
      <div className="h-screen text-gray-800 w-full flex justify-center items-center text-center">
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
        <MyCalendar events={events} setEvents={() => {}} />
      </InfoCard>
    </CustomContainer>
  )
}

export default Appointments
