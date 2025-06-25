import { darkmodeAtom } from "@/lib/store"
import { useAtom } from "jotai"
import React from "react"

interface Props {
  children: React.ReactNode
}

const CustomContainer = ({ children }: Props) => {
  const [darkmode] = useAtom(darkmodeAtom)

  return (
    <div
      className={`flex min-h-screen ${
        darkmode ? "bg-[#e9edf3]" : "bg-gray-800"
      } `}
    >
      <div className="w-full p-5 md:p-5">{children}</div>
    </div>
  )
}

export default CustomContainer
