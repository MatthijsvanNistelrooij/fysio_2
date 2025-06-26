/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import type { Appointment } from "@/lib/types"
import {
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "@/lib/appwrite/appointments"

export async function GET(req: NextRequest, context: any) {
  const params = await context.params
  const id = params.id

  const appointment = await getAppointmentById(id)

  if (!appointment) {
    return NextResponse.json(
      { error: "Appointment not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(appointment)
}

export async function PUT(req: NextRequest, context: any) {
  const params = await context.params
  const id = params.id

  const data: Appointment = await req.json()

  await updateAppointment(id, data)

  const updated = await getAppointmentById(id)
  if (!updated) {
    return NextResponse.json(
      { error: "Appointment not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, context: any) {
  const params = await context.params
  const id = params.id

  await deleteAppointment(id)

  return NextResponse.json({ message: "Appointment deleted successfully" })
}
