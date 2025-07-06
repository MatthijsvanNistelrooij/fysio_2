"use client"
import React from "react"
import { Button } from "../ui/button"
import { useAtom } from "jotai"
import { darkmodeAtom } from "@/lib/store"

type CustomButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
}

const CustomButton = ({ children, className = "", ...props }: CustomButtonProps) => {
  const [darkmode] = useAtom(darkmodeAtom)

  const darkClass = darkmode
    ? "bg-white hover:bg-gray-100 text-gray-800"
    : "bg-gray-600 text-gray-200 hover:bg-gray-700"

  return (
    <Button {...props} className={`${darkClass} cursor-pointer ${className}`}>
      {children}
    </Button>
  )
}

export default CustomButton
