import { NextResponse } from "next/server"
import type { Appointment } from "@/lib/types"
import {
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "@/lib/appwrite/appointments"

export async function GET(
  req: Request,
  context: { params: Record<string, string> }
) {
  const { id } = context.params

  const appointment = await getAppointmentById(id)

  if (!appointment) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
  }

  return NextResponse.json(appointment)
}

export async function PUT(
  req: Request,
  context: { params: Record<string, string> }
) {
  try {
    const { id } = context.params
    const data: Appointment = await req.json()

    await updateAppointment(id, data)

    const updated = await getAppointmentById(id)
    if (!updated) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  context: { params: Record<string, string> }
) {
  try {
    const { id } = context.params
    await deleteAppointment(id)
    return NextResponse.json({ message: "Appointment deleted successfully" })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
