import { NextResponse } from "next/server"
import { createPet, addPetToClient } from "@/lib/appwrite/pets"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { ownerId, name, type, age } = data

    if (!ownerId || !name || !type) {
      return NextResponse.json(
        { error: "Missing required fields (ownerId, name, type)" },
        { status: 400 }
      )
    }

    // Maak de pet aan
    const newPet = await createPet({
      ownerId,
      name,
      type,
      age,
    })

    // Koppel de pet aan de client (owner)
    await addPetToClient(ownerId, newPet.$id)

    // Stuur de volledige pet terug als respons
    return NextResponse.json(newPet, { status: 201 })
  } catch (error) {
    console.error("Failed to create pet:", error)
    return NextResponse.json({ error: "Failed to create pet" }, { status: 500 })
  }
}
