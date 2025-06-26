/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { updatePet, deletePet, getPetById } from "@/lib/appwrite/pets"

export async function PUT(request: NextRequest, context: any) {
  try {
    const params = await context.params
    const id = params.id
    const data = await request.json()

    await updatePet(id, data) // updatePet returned waarschijnlijk niks

    // Haal het bijgewerkte pet object op
    const updatedPet = await getPetById(id)

    if (!updatedPet) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 })
    }

    // Maak clean object
    const cleanPet = {
      $id: updatedPet.$id,
      name: updatedPet.name,
      type: updatedPet.type,
      age: updatedPet.age,
      breed: updatedPet.breed,
      description: updatedPet.description,
      notes: updatedPet.notes,
      ownerId: updatedPet.ownerId,
      createdAt: updatedPet.createdAt
        ? updatedPet.createdAt.toISOString()
        : null,
      updatedAt: updatedPet.updatedAt
        ? updatedPet.updatedAt.toISOString()
        : null,
    }

    return NextResponse.json(cleanPet)
  } catch (error) {
    console.error("Failed to update pet:", error)
    return NextResponse.json({ error: "Failed to update pet" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: any) {
  try {
    const params = await context.params
    const id = params.id
    await deletePet(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete pet:", error)
    return NextResponse.json({ error: "Failed to delete pet" }, { status: 500 })
  }
}
