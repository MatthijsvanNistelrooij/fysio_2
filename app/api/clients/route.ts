// app/api/clients/route.ts
import { NextResponse } from "next/server"
import {
  getClientsByUserId,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from "@/lib/appwrite/clients"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const id = url.searchParams.get("id")
  const userId = url.searchParams.get("userId")

  try {
    if (id) {
      // 1 client ophalen via id
      const client = await getClientById(id)
      if (!client) {
        return NextResponse.json({ error: "Client not found" }, { status: 404 })
      }
      return NextResponse.json(client)
    } else if (userId) {
      // alle clients ophalen van 1 user
      const clients = await getClientsByUserId(userId)
      return NextResponse.json(clients)
    } else {
      // fallback, als je een endpoint wilt om alle clients te krijgen (optioneel)
      return NextResponse.json(
        { error: "Missing query param id or userId" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Failed to fetch client(s)" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    // verwacht data: { name, email, phone, address, userId }
    if (!data.name || !data.email || !data.userId) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }
    const newClient = await createClient(data)
    return NextResponse.json(newClient, { status: 201 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    // verwacht data: { id, updateData }
    if (!data.id || !data.updateData) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }
    const updated = await updateClient(data.id, data.updateData)
    return NextResponse.json({ message: "Client updated", updated })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Failed to update client" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "Missing client id" }, { status: 400 })
    }
    await deleteClient(id)
    return NextResponse.json({ message: "Client deleted" })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 }
    )
  }
}
