import React from "react"

interface Props {
  children: React.ReactNode
}

const CustomContainer = ({ children }: Props) => {
  return (
    <div className="min-h-screen w-full flex justify-center">
      <div className="w-full p-5">{children}</div>
    </div>
  )
}

export default CustomContainer
