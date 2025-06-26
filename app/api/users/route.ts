import {
  createAccount,
  getCurrentUser,
  sendEmailOTP,
  verifySecret,
} from "@/lib/appwrite/users"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "No user found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (body.type === "sign-up") {
      const { fullName, email } = body
      if (!fullName || !email) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        )
      }
      const account = await createAccount({ fullName, email })
      return NextResponse.json(account, { status: 201 })
    } else if (body.type === "otp") {
      const { email } = body
      if (!email) {
        return NextResponse.json(
          { error: "Missing email field for OTP" },
          { status: 400 }
        )
      }
      // Hier moet je je logica voor versturen OTP zetten, bijvoorbeeld:
      await sendEmailOTP(email) // implementeer deze functie
      return NextResponse.json({ message: "OTP sent" })
    } else if (body.type === "verify") {
      const { accountId, password } = body
      if (!accountId || !password) {
        return NextResponse.json(
          { error: "Missing accountId or password for verification" },
          { status: 400 }
        )
      }
      // Hier verifieer je de OTP code
      const sessionId = await verifySecret({ accountId, password }) // implementeer deze functie
      if (!sessionId) {
        return NextResponse.json({ error: "Invalid OTP" }, { status: 401 })
      }
      return NextResponse.json({ sessionId })
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
