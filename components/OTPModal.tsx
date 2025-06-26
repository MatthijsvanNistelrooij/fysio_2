"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogOverlay,
} from "./ui/alert-dialog"

import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp"
import React, { useState } from "react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { ExternalLinkIcon, Loader } from "lucide-react"

const OtpModal = ({
  accountId,
  email,
}: {
  accountId: string
  email: string
}) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          type: "verify",
          accountId,
          password,
        }),
      })

      const result = await res.json()

      if (res.ok && result?.sessionId) {
        router.push("/")
      } else {
        throw new Error("OTP verification failed")
      }
    } catch (error) {
      console.error("Failed to verify OTP", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "otp",
          email,
        }),
      })
    } catch (error) {
      console.error("Failed to resend OTP", error)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Optional: override or remove overlay */}
      <AlertDialogOverlay className="bg-white/10 backdrop-blur-sm" />

      <AlertDialogContent className="shad-alert-dialog w-full max-w-md p-6 bg-white text-black">
        <div className="flex justify-end">
          <ExternalLinkIcon onClick={() => setIsOpen(false)} />
        </div>
        <AlertDialogHeader className="flex flex-col items-center gap-2 relative -mt-6">
          <AlertDialogTitle className="text-center">
            Enter Your OTP
          </AlertDialogTitle>
          <AlertDialogDescription className="subtitle-2 text-center text-gray-600">
            We&apos;ve sent a code to{" "}
            <span className="pl-1 text-brand">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP maxLength={6} value={password} onChange={setPassword}>
          <InputOTPGroup className="shad-otp justify-center mt-4 mb-6 w-full">
            {Array.from({ length: 6 }).map((_, index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="shad-otp-slot"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>
          <div className="flex w-full flex-col gap-4 items-center justify-center">
            <AlertDialogAction
              onClick={handleSubmit}
              className="shad-submit-btn h-10 border w-40 bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
              type="button"
            >
              Submit
              {isLoading && <Loader />}
            </AlertDialogAction>

            <div className="subtitle-2 mt-2 text-center text-gray-600">
              Didn&apos;t get a code?
              <Button
                type="button"
                variant="link"
                className="pl-1 text-brand"
                onClick={handleResendOtp}
              >
                Click to resend
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default OtpModal
