import { NextResponse } from "next/server"
import type { Appointment } from "@/lib/types"
import {
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "@/lib/appwrite/appointments"

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const appointment = await getAppointmentById(params.id)

  if (!appointment) {
    return NextResponse.json(
      { error: "Appointment not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(appointment)
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data: Appointment = await req.json()

    // Update appointment with jouw helper
    await updateAppointment(params.id, data)

    // Daarna de geüpdatete appointment ophalen (optioneel)
    const updatedAppointment = await getAppointmentById(params.id)

    if (!updatedAppointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedAppointment)
  } catch (error) {
    console.error("Failed to update appointment:", error)
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteAppointment(params.id)
    return NextResponse.json({ message: "Appointment deleted successfully" })
  } catch (error) {
    console.error("Failed to delete appointment:", error)
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    )
  }
}
