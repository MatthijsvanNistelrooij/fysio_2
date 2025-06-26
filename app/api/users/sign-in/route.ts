import { signInUser } from "@/lib/appwrite/users"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 })
  }

  try {
    const session = await signInUser({ email })
    return NextResponse.json(session)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to sign in" }, { status: 500 })
  }
}
