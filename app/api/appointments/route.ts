// app/api/appointments/route.ts
import { NextResponse } from "next/server"
import {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  addAppointmentToPet,
} from "@/lib/appwrite/appointments"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const id = url.searchParams.get("id")

  try {
    if (id) {
      // Fetch 1 appointment by id
      const appointment = await getAppointmentById(id)
      if (!appointment) {
        return NextResponse.json(
          { error: "Appointment not found" },
          { status: 404 }
        )
      }
      return NextResponse.json(appointment)
    } else {
      // Fetch all appointments
      const appointments = await getAllAppointments()
      return NextResponse.json(appointments)
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Failed to fetch appointment(s)" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    // verwacht data: { petId, description, treatment, date, userId, type }
    if (!data.petId) {
      return NextResponse.json({ error: "petId is required" }, { status: 400 })
    }

    // 1. Maak de appointment
    const appointment = await createAppointment(data.petId, data)

    // 2. Voeg appointment ID toe aan pet
    await addAppointmentToPet(data.petId, appointment.$id)

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error("Failed to create appointment:", error)
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    // verwacht data bijvoorbeeld:
    // { id, updateData }
    if (!data.id || !data.updateData) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }
    await updateAppointment(data.id, data.updateData)
    return NextResponse.json({ message: "Appointment updated" })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")
    if (!id) {
      return NextResponse.json(
        { error: "Missing appointment id" },
        { status: 400 }
      )
    }
    await deleteAppointment(id)
    return NextResponse.json({ message: "Appointment deleted" })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    )
  }
}
