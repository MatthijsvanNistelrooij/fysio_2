/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { updateClient, deleteClient } from "@/lib/appwrite/clients"

export async function PUT(request: NextRequest, context: any) {
  try {
    const params = await context.params
    const id = params.id
    const data = await request.json()

    // Optionele validatie kan hier toegevoegd worden

    const updatedClient = await updateClient(id, data)
    return NextResponse.json(updatedClient)
  } catch (error) {
    console.error("Failed to update client:", error)
    return NextResponse.json(
      { error: "Failed to update client" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, context: any) {
  try {
    const params = await context.params
    const id = params.id
    await deleteClient(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete client:", error)
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 }
    )
  }
}
