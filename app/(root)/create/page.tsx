import CreateForm from "@/components/CreateForm"
import { getCurrentUser } from "@/lib/user.actions"
import { redirect } from "next/navigation"
import React from "react"

const Create = async () => {
  const currentUser = await getCurrentUser()

  if (!currentUser) return redirect("/sign-in")

  return (
    <div className="min-h-screen flex justify-center bg-gray-50">
      <div className="main-container p-8 py-5 bg-white max-w-5xl w-full border rounded-3xl m-10">
        <CreateForm {...currentUser} />
      </div>
    </div>
  )
}

export default Create
