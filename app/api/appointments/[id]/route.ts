import { NextResponse, type NextRequest } from "next/server"
import type { Appointment } from "@/lib/types"
import {
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "@/lib/appwrite/appointments"

export async function GET(
  req: NextRequest,
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
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data: Appointment = await req.json()
    await updateAppointment(params.id, data)

    const updated = await getAppointmentById(params.id)
    if (!updated) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = (await context).params.id

  await deleteAppointment(id)
  return NextResponse.json({ message: "Appointment deleted successfully" })
}
