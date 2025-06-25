import CreateForm from "@/components/CreateClientForm"
import { getCurrentUser } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"
import React from "react"

const Create = async () => {
  const currentUser = await getCurrentUser()

  if (!currentUser) return redirect("/sign-in")

  return <CreateForm {...currentUser} />
}

export default Create
