import React from "react"

interface Props {
  children: React.ReactNode
}

const CustomContainer = ({ children }: Props) => {
  return (
    <div className="min-h-screen flex justify-center [bg-[#e9edf3]">
      <div className="w-full p-5 md:p-5">{children}</div>
    </div>
  )
}

export default CustomContainer
