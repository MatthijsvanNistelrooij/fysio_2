"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { deleteAppointment, updateAppointment } from "@/lib/appointment.actions"
import AppointmentForm from "./AppointmentForm"
import { toast } from "sonner"
import { CalendarRange, Edit, Trash, X } from "lucide-react"
import { Appointment } from "@/types"
import Link from "next/link"
import Image from "next/image"
import image from "../public/logo.png"

export default function AppointmentDetailsComponent({
  appointment,
}: {
  appointment: Appointment
}) {
  const router = useRouter()
  const [edit, setEdit] = useState(false)

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    )
    if (!confirmDelete) return

    try {
      await deleteAppointment(id)
      toast.success("Appointment deleted successfully!")
      router.push("/appointments")
    } catch (error) {
      console.error("Error deleting appointment:", error)
      toast.success("Failed to delete appointment.")
    }
  }

  const handleEditToggle = () => {
    setEdit((prev) => !prev)
  }

  const handleUpdate = async (data: Appointment) => {
    try {
      await updateAppointment(appointment.$id, data)
      toast.success("Appointment updated successfully!")
      setEdit(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating appointment:", error)
      toast.error("Failed to update appointment.")
    }
  }

  return (
    <div className="min-h-screen flex justify-center bg-gray-50">
      <div className="w-full bg-white overflow-hidden inset-0 z-10 p-2 fixed">
        <div
          className={`w-full bg-white overflow-hidden inset-0 z-10 fixed p-2`}
        >
          <div className="flex justify-between bg-gray-800">
            <div className="text-white p-2 px-4 text-sm flex gap-2">
              <CalendarRange size={18} />
              Date:&nbsp;
              {appointment?.date
                ? new Date(appointment.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </div>

            <Link href={`/pets/${appointment.petId}`}>
              <X
                size={20}
                className="cursor-pointer text-gray-400 hover:text-gray-200 m-2"
              />
            </Link>
          </div>
          <div className="flex flex-col md:flex-row bg-white border p-5 gap-6">
            {edit ? (
              <div className="flex justify-between w-full">
                <AppointmentForm
                  initialData={appointment}
                  onSubmit={handleUpdate}
                  onClick={handleEditToggle}
                  onDelete={handleDelete}
                />
              </div>
            ) : (
              <div className="flex w-full">
                <div className="flex-1 text-gray-800">
                  <p className="text-sm font-medium mb-1">Description:</p>
                  <p className="text-base mb-4">{appointment?.description}</p>

                  <p className="text-sm font-medium mb-1">Treatment:</p>
                  <p className="text-base">{appointment?.treatment}</p>
                </div>

                <div className="flex flex-col">
                  <Image
                    width={40}
                    height={40}
                    src={image}
                    alt="Appointment"
                    className="w-full h-auto max-h-48 object-cover shadow"
                  />

                  <div className="flex mt-5 gap-2">
                    <Edit
                      size={20}
                      className="cursor-pointer text-gray-400 hover:text-gray-800"
                      onClick={handleEditToggle}
                    />

                    <Trash
                      size={20}
                      onClick={() => handleDelete(appointment.$id)}
                      className="cursor-pointer text-gray-400 hover:text-gray-800"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
