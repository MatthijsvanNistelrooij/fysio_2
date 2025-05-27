"use client"
import React from "react"
import { Input } from "./ui/input"

const Header = () => {
  return (
    <div className="flex justify-center bg-gray-50 m-2">
      <div className="main-container bg-white max-w-7xl w-full flex">
        <Input className="bg-white" placeholder="search..." />
      </div>
    </div>
  )
}

export default Header
