import React from "react"
interface Props {
  children: React.ReactNode
}

const CustomContainer = ({ children }: Props) => {
  return (
    <div>
      <div className="w-full p-3">{children}</div>
    </div>
  )
}

export default CustomContainer
