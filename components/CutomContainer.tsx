import React from "react"

interface Props {
  children: React.ReactNode
}

const CustomContainer = ({ children }: Props) => {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full p-5 md:p-10">{children}</div>
    </div>
  )
}

export default CustomContainer
