import CreateClientForm from "@/components/CreateClientForm"
import { getCurrentUser } from "@/lib/appwrite/users"

import { redirect } from "next/navigation"
import React from "react"

const Create = async () => {
  const currentUser = await getCurrentUser()

  if (!currentUser) return redirect("/sign-in")

  return <CreateClientForm {...currentUser} padding="p-5" />
}

export default Create
