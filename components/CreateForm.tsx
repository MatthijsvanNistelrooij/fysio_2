"use client"
import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client.actions"
import { toast } from "sonner"
import { Check, Contact, HomeIcon, Mail, Phone } from "lucide-react"

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
    console.log("SUBMIT")
    e.preventDefault()

    const newErrors = {
      name: formData.name ? "" : "Name is required!",
      email: formData.email ? "" : "Email is required!",
      phone: formData.phone ? "" : "Phone is required!",
      address: formData.address ? "" : "Address is required!",
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col justify-between gap-4 border border-gray-100 shadow-xl rounded-xl p-3">
          <div className="flex flex-row gap-2 justify-between">
            <div className="w-full flex bg-gray-800 rounded-xl">
              <Contact size={18} className="text-gray-400 m-2" />
              <Input
                name="name"
                placeholder={errors.name ? errors.name : "Name"}
                value={formData.name}
                onChange={handleChange}
                className="border-none shadow-none rounded-xl text-white"
              />
            </div>

            <div className="w-full flex bg-gray-100 rounded-xl">
              <HomeIcon size={18} className="text-gray-400 m-2" />
              <Input
                name="address"
                placeholder={errors.address ? errors.address : "Address"}
                value={formData.address}
                onChange={handleChange}
                className="border-none shadow-none rounded-xl"
              />
            </div>

            <div className="w-full flex bg-gray-100 rounded-xl">
              <Mail size={18} className="text-gray-400 m-2" />
              <Input
                name="email"
                placeholder={errors.email ? errors.email : "Email"}
                value={formData.email}
                onChange={handleChange}
                className="border-none shadow-none rounded-xl"
              />
            </div>

            <div className="w-full flex bg-gray-100 rounded-xl">
              <Phone size={18} className="text-gray-400 m-2" />
              <Input
                name="phone"
                placeholder={errors.phone ? errors.phone : "Phone"}
                value={formData.phone}
                onChange={handleChange}
                className="border-none shadow-none rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end w-full">
            <Button
              type="submit"
              className="cursor-pointer bg-white hover:bg-gray-100 text-gray-800"
            >
              <Check />
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CreateForm
