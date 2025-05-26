import { notFound } from "next/navigation"

import { getAppointmentById } from "@/lib/appointment.actions"
import AppointmentDetailsComponent from "@/components/AppointmentDetailsComponent"
import { Appointment } from "@/types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDocumentToAppointment(doc: any): Appointment {
  return {
    $id: doc.$id,
    description: doc.description,
    treatment: doc.treatment,
    date: new Date(doc.date),
    petId: doc.petId,
    userId: doc.userId
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

  const doc = await getAppointmentById(id)
  if (!doc) return notFound()

  const appointment = mapDocumentToAppointment(doc)

  return <AppointmentDetailsComponent appointment={appointment} />
}

export default AppointmentDetails
