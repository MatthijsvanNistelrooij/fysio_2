"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import AppointmentForm from "./AppointmentForm"
import { toast } from "sonner"
import { CalendarRange, Edit, X } from "lucide-react"
import { Appointment } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"
import { Button } from "./ui/button"
import { PetDrawingCanvas } from "./PetDrawingCanvas"
import horse from "../public/horse_1.png"

export default function AppointmentDetailsComponent({
  appointment,
}: {
  appointment: Appointment
}) {
  const router = useRouter()
  const [edit, setEdit] = useState(false)
  const [showCanvas, setShowCanvas] = useState(false)
  const [savedImage, setSavedImage] = useState<string | null>(null)

  const handleEditToggle = () => {
    setEdit((prev) => !prev)
  }

  async function deleteAppointmentApi(id: string) {
    const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Failed to delete appointment")
    }
    return await res.json()
  }

  async function updateAppointmentApi(id: string, data: Appointment) {
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || "Failed to update appointment")
    }
    return await res.json()
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this appointment?"))
      return

    try {
      await deleteAppointmentApi(id)
      toast.success("Appointment deleted successfully!")
      router.push("/appointments")
    } catch (error) {
      console.error("Error deleting appointment:", error)
      toast.error("Failed to delete appointment.")
    }
  }

  const handleUpdate = async (data: Appointment) => {
    try {
      await updateAppointmentApi(appointment.$id, data)
      toast.success("Appointment updated successfully!")
      setEdit(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating appointment:", error)
      toast.error("Failed to update appointment.")
    }
  }

  const selectedAppointment = appointment

  useEffect(() => {
    if (!selectedAppointment) return

    const key = `petDrawing-${selectedAppointment.$id}`
    const saved = localStorage.getItem(key)
    if (saved) {
      const { imageDataUrl } = JSON.parse(saved)
      setSavedImage(imageDataUrl)
    } else {
      setSavedImage(null)
    }
  }, [selectedAppointment])

  const handleSave = ({
    imageDataUrl,
    drawingJson,
  }: {
    imageDataUrl: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    drawingJson: any
  }) => {
    try {
      const key = `petDrawing-${selectedAppointment.$id}`

      localStorage.setItem(
        key,
        JSON.stringify({
          imageDataUrl,
          drawingJson,
          selectedAppointment: appointment.$id,
        })
      )

      setSavedImage(imageDataUrl)
      setShowCanvas(false)
    } catch (err) {
      console.error("Error in handleSave:", err)
      toast.error("Something went wrong saving the canvas.")
    }
  }

  const handleClickCanvas = () => {
    setShowCanvas((prev) => !prev)
  }

  return (
    <div className="min-h-screen flex justify-center p-5">
      <div className="w-full rounded bg-white shadow-xl">
        <div className="flex justify-between bg-gray-100">
          <div className=" p-2 px-4 text-sm flex gap-2">
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
              className="cursor-pointer text-gray-400 hover:text-gray-800 m-2"
            />
          </Link>
        </div>
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-col w-full md:flex-row bg-white p-5 gap-6">
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
                <div className="flex-1 text-gray-800 space-y-4">
                  <p className="text-sm font-medium">Type:</p>
                  <p className="text-base">{appointment?.type}</p>
                  <p className="text-sm font-medium">Description:</p>
                  <p className="text-base">{appointment?.description}</p>

                  <p className="text-sm font-medium">Treatment:</p>
                  <p className="text-base">{appointment?.treatment}</p>
                </div>

                <div className="flex flex-col">
                  <div className="flex gap-2">
                    <Button
                      onClick={handleEditToggle}
                      className="bg-white hover:bg-gray-100 cursor-pointer text-gray-800 "
                    >
                      <Edit size={20} />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="w-full  overflow-hidden">
            <div className="w-full p-5 flex justify-end">
              <Button
                className="bg-white hover:bg-gray-100 cursor-pointer text-gray-600 "
                onClick={() => handleClickCanvas()}
              >
                {showCanvas ? <X /> : <Edit />}
              </Button>
            </div>

            <div className="w-full">
              {!showCanvas && (
                <div
                  style={{
                    position: "relative",
                    width: 460,
                    height: 400,
                    borderRadius: 8,
                    overflow: "hidden",
                    margin: "20px",
                  }}
                >
                  <Image
                    width={450}
                    height={300}
                    src={savedImage ? savedImage : horse}
                    alt="Saved drawing"
                  />
                </div>
              )}
              {showCanvas && (
                <div className="flex w-full">
                  <PetDrawingCanvas petType={"Horse"} onSave={handleSave} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
