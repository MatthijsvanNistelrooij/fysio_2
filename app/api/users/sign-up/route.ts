import { createAccount } from "@/lib/appwrite/users"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { fullName, email } = await request.json()

  if (!fullName || !email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    const account = await createAccount({ fullName, email })
    return NextResponse.json(account, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
  }
}
