"use client"
import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Check } from "lucide-react"
import InfoCard from "./InfoCard"
import { darkmodeAtom } from "@/lib/store"
import { useAtom } from "jotai"
import Head from "next/head"

interface Props {
  fullName?: string
  $id?: string
  email?: string
  edit?: boolean
  padding: string
}

export const CreateClientForm = ({ $id, padding }: Props) => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    if (isSubmitting) return // voorkom dubbele submit

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

    setIsSubmitting(true) // zet isSubmitting aan

    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          userId: $id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create client")
      }

      const newClient = await response.json()

      toast.success("Client added successfully!")
      router.push(`/clients/${newClient.$id}`)
    } catch (error) {
      console.error("Error creating client:", error)
      toast.error("Error creating client")
    } finally {
      setIsSubmitting(false) // zet isSubmitting weer uit
    }
  }

  const [darkmode] = useAtom(darkmodeAtom)

  return (
    <>
      <Head>
        <title>Fysio App 2025</title>
        <meta name="description" content="Fysio App 2025" />
      </Head>
      <div>
        <div className={`main-container w-full rounded-3xl ${padding} `}>
          <InfoCard title="Create New Contact">
            <form onSubmit={handleSubmit} className="space-y-2 ">
              <div className="">
                <div className="flex flex-col md:flex-row gap-2 justify-between">
                  <div className="w-full flex">
                    <Input
                      name="name"
                      placeholder={errors.name ? errors.name : "Name"}
                      value={formData.name}
                      onChange={handleChange}
                      className={`${
                        darkmode ? "bg-[#e9edf3]" : "bg-gray-700"
                      } border-none shadow-none rounded p-0 mt-1 `}
                    />
                  </div>

                  <div className="w-full flex ">
                    <Input
                      name="address"
                      placeholder={errors.address ? errors.address : "Address"}
                      value={formData.address}
                      onChange={handleChange}
                      className={`${
                        darkmode ? "bg-[#e9edf3]" : "bg-gray-700"
                      } border-none shadow-none rounded p-0 mt-1 `}
                    />
                  </div>

                  <div className="w-full flex ">
                    <Input
                      name="email"
                      placeholder={errors.email ? errors.email : "Email"}
                      value={formData.email}
                      onChange={handleChange}
                      className={`${
                        darkmode ? "bg-[#e9edf3]" : "bg-gray-700"
                      } border-none shadow-none rounded p-0 mt-1 `}
                    />
                  </div>

                  <div className="w-full flex ">
                    <Input
                      name="phone"
                      placeholder={errors.phone ? errors.phone : "Phone"}
                      value={formData.phone}
                      onChange={handleChange}
                      className={`${
                        darkmode ? "bg-[#e9edf3]" : "bg-gray-700"
                      } border-none shadow-none rounded p-0 mt-1 `}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-5">
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    className={` ${
                      darkmode
                        ? "bg-white hover:bg-green-50 text-green-800"
                        : "bg-gray-600 hover:bg-gray-700 text-green-200"
                    }  cursor-pointer p-5 `}
                  >
                    <Check />
                  </Button>
                </div>
              </div>
            </form>
          </InfoCard>
        </div>
      </div>
    </>
  )
}

export default CreateClientForm
