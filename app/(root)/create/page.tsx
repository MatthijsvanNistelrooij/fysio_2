import CreateForm from "@/components/CreateForm"
import { getCurrentUser } from "@/lib/user.actions"
import { redirect } from "next/navigation"
import React from "react"

const Create = async () => {
  const currentUser = await getCurrentUser()

  if (!currentUser) return redirect("/sign-in")

  return (
    <div className="min-h-screen flex justify-center bg-gray-50">
      <div className="main-container max-w-7xl w-full rounded-3xl m-5">
        <CreateForm {...currentUser} />
      </div>
    </div>
  )
}

export default Create
