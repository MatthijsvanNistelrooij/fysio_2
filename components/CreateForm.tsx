"use client"
import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client.actions"
import { toast } from "sonner"
import { X } from "lucide-react"
import Link from "next/link"

interface Props {
  fullName?: string
  $id?: string
  email?: string
}

export const CreateForm = ({ $id }: Props) => {
  const router = useRouter()

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    userId: "",
  })

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    userId: $id,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = {
      name: formData.name ? "" : "Name is required",
      email: formData.email ? "" : "Email is required",
      phone: formData.phone ? "" : "Phone is required",
      address: formData.address ? "" : "Address is required",
      userId: $id ? "" : "Missing user ID",
    }

    setErrors(newErrors)

    const hasErrors = Object.values(newErrors).some((msg) => msg !== "")
    if (hasErrors) return

    try {
      const payload = { ...formData, userId: $id! }
      const newClient = await createClient(payload)

      toast.success("Client added successfully!")

      // Redirect to the new client's detail page using the new ID
      router.push(`/clients/${newClient.$id}`)
    } catch (error) {
      console.error("Error creating client:", error)
      toast.error("Error creating client")
    }
  }

  return (
    <div className="mt-2">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold mb-4">Create New Client</h1>
        <Link
          href={"/clients"}
          className="text-gray-500 ml-2 hover:text-gray-800"
        >
          <X />
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-200"
            />
            {errors.name && (
              <p className="text-sm text-red-500 ml-2">{errors.name}!</p>
            )}
          </div>

          <div>
            <Input
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="border border-gray-200"
            />
            {errors.address && (
              <p className="text-sm text-red-500 ml-2">{errors.address}!</p>
            )}
          </div>

          <div>
            <Input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-200"
            />
            {errors.email && (
              <p className="text-sm text-red-500 ml-2">{errors.email}!</p>
            )}
          </div>

          <div>
            <Input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="border border-gray-200"
            />
            {errors.phone && (
              <p className="text-sm text-red-500 ml-2">{errors.phone}!</p>
            )}
          </div>
        </div>

        <div className="flex justify-end w-full">
          <Button
            type="submit"
            className="cursor-pointer bg-gray-800 hover:bg-gray-700"
          >
            Create Client
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateForm
