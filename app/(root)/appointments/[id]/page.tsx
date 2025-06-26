import { notFound } from "next/navigation"

import AppointmentDetailsComponent from "@/components/AppointmentDetailsComponent"
import { Appointment } from "@/lib/types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDocumentToAppointment(doc: any): Appointment {
  return {
    $id: doc.$id,
    description: doc.description,
    treatment: doc.treatment,
    date: new Date(doc.date),
    petId: doc.petId,
    userId: doc.userId,
    type: doc.type,
  }
}

const AppointmentDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const awaitedParams = await params
  const id = awaitedParams.id
  if (!id) return notFound()

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/appointments/${id}`,
    {
      method: "GET",
      next: { revalidate: 0 }, // geen cache
    }
  )

  if (!res.ok) return notFound()

  const doc = await res.json()

  const appointment = mapDocumentToAppointment(doc)

  return <AppointmentDetailsComponent appointment={appointment} />
}

export default AppointmentDetails
