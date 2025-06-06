"use client"

import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { CalendarRange, Dog, Edit, Thermometer, X } from "lucide-react"
import { deleteClient, updateClient } from "@/lib/client.actions"
import { toast } from "sonner"
import horse from "../public/horse_1.png"
import {
  addPetToClient,
  createPet,
  deletePet,
  updatePet,
} from "@/lib/pet.actions"
import AddPetForm from "./AddPetForm"
import { Appointment, Client, Pet, User } from "@/types"
import { ShowerHead, Stethoscope, Lightbulb, Zap } from "lucide-react"
import { getCurrentUser } from "@/lib/user.actions"
import ClientForm from "./ClientForm"

import CreateAppointmentForm from "./CreateAppointmentForm"
import {
  addAppointmentToPet,
  createAppointment,
  deleteAppointment,
  updateAppointment,
} from "@/lib/appointment.actions"
import AppointmentForm from "./AppointmentForm"
import PetForm from "./PetForm"
import { Button } from "./ui/button"
import { PetDrawingCanvas } from "./PetDrawingCanvas"
import Image from "next/image"
import OwnerInfo from "./OwnerInfo"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ClientDetailsComponent({ client }: { client: any }) {
  const router = useRouter()
  const [addPet, setAddPet] = useState(true)
  const [edit, setEdit] = useState(false)
  const [editAppointment, setEditAppointment] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [localClient, setLocalClient] = useState<Client>(client)
  const [addAppointment, setAddAppointment] = useState(false)
  const [editPet, setEditPet] = useState(false)

  const [showCanvas, setShowCanvas] = useState(false)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [savedImage, setSavedImage] = useState<string | null>(null)

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)

  const [openAppointment, setOpenAppointment] = useState(false)

  useEffect(() => {
    if (localClient?.pets?.length) {
      setAddPet(false)
    } else {
      setAddPet(true)
    }
  }, [localClient])

  useEffect(() => {
    setLocalClient(client)
  }, [client])

  console.log(localClient)

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (!selectedAppointment) return

    const key = `petDrawing-${selectedAppointment.$id}`
    const saved = localStorage.getItem(key)
    if (saved) {
      const { imageDataUrl } = JSON.parse(saved)
      setSavedImage(imageDataUrl)

      // Optionally restore the drawingJson to canvas here
    } else {
      setSavedImage(null)
    }
  }, [selectedAppointment])

  if (!user) return

  const handleSave = ({
    imageDataUrl,
    drawingJson,
  }: {
    imageDataUrl: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    drawingJson: any
  }) => {
    if (!selectedAppointment) return

    const key = `petDrawing-${selectedAppointment.$id}`

    localStorage.setItem(
      key,
      JSON.stringify({
        imageDataUrl,
        drawingJson,
        selectedAppointment: selectedAppointment.$id,
      })
    )

    setSavedImage(imageDataUrl)
    setShowCanvas(false)
  }

  const handleDeleteClient = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client?"
    )
    if (!confirmDelete) return

    try {
      await deleteClient(id)
      toast.success("Client deleted successfully!")

      router.push("/clients")
    } catch (error) {
      console.error("Error deleting client:", error)
      toast.error("Failed to delete client.")
    }
  }

  const handleDeleteAppointment = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    )
    if (!confirmDelete) return

    try {
      await deleteAppointment(id)
      toast.success("Appointment deleted successfully!")
      setOpenAppointment(false)
      setEditAppointment(false)

      setSelectedPet((prevPet) => {
        if (!prevPet) return null

        return {
          ...prevPet,
          appointments: prevPet.appointments.filter(
            (app: Appointment) => app.$id !== id
          ),
        } as Pet
      })
    } catch (error) {
      console.error("Error deleting appointment:", error)
      toast.success("Failed to delete appointment.")
    }
  }

  const handleEditToggle = () => {
    setEdit((prev) => !prev)
  }

  const handleEditToggleAppointment = () => {
    setEditAppointment((prev) => !prev)
  }

  const handleUpdate = async (data: Client) => {
    try {
      await updateClient(client.$id, data)
      toast.success("Saved!")
      setEdit(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating client:", error)
      toast.error("Failed to update client.")
    }
  }

  const getPetColorClass = (type: string) => {
    switch (type.toLowerCase()) {
      case "dog":
        return "bg-white    "
      case "cat":
        return "bg-white"
      case "horse":
        return "bg-white"
      default:
        return "bg-white    "
    }
  }

  const handleCreate = async (data: Pet) => {
    try {
      const petResponse = await createPet({
        ...data,
        ownerId: data.ownerId,
      })

      await addPetToClient(data.ownerId, petResponse.$id)

      toast.success("Pet added successfully!")
      setAddPet((prev) => !prev)
      setSelectedPet({
        ...data, // contains name, type, description, etc.
        ...petResponse, // contains $id and any metadata
      })
      router.refresh()
    } catch (error) {
      console.error("Error creating pet:", error)
      toast.error("Failed to create pet.")
    }
  }

  const handleSelectPet = (pet: Pet) => {
    setAddPet(false)
    setSelectedPet(pet)
  }

  const handleSelectAppointment = (appointment: Appointment) => {
    console.log("CHECK", appointment)
    setSelectedAppointment(appointment)
    setOpenAppointment(true)
  }

  const handleCloseAppointment = () => {
    setOpenAppointment(false)
    setSelectedAppointment(null)
    setShowCanvas(false)
  }

  const handleToggleAddAppointment = () => {
    setAddAppointment((prev) => !prev)
  }

  const handleToggleUpdatePet = () => {
    setEditPet((prev) => !prev)
  }

  const handleUpdatePet = async (data: Pet) => {
    try {
      await updatePet(data.$id, data)

      toast.success("Pet info updated successfully!")
      setLocalClient((prevClient) => ({
        ...prevClient,
        pets: prevClient.pets.map((pet) => (pet.$id === data.$id ? data : pet)),
      }))

      setSelectedPet((prevPet) => {
        if (!prevPet) return null

        return {
          ...prevPet,
          ...data, // spreads in the new fields (name, description, etc.)
          appointments: prevPet.appointments, // keep existing appointments
        }
      })

      setEditPet(false)
    } catch (error) {
      console.error("Error updating pet:", error)
      toast.error("Failed to update pet.")
    }
  }

  const handleUpdateAppointment = async (appointment: Appointment) => {
    try {
      await updateAppointment(appointment.$id, appointment)
      toast.success("Appointment updated successfully!")
      setEditAppointment(false)

      // Update selectedPet.appointments array
      setSelectedPet((prevPet) => {
        if (!prevPet) return null

        const updatedAppointments = prevPet.appointments.map((a) =>
          a.$id === appointment.$id
            ? { ...a, ...appointment, date: new Date(appointment.date) }
            : a
        )

        return {
          ...prevPet,
          appointments: updatedAppointments,
        }
      })

      // ✅ Update selectedAppointment
      setSelectedAppointment({
        ...appointment,
        date: new Date(appointment.date),
      })
    } catch (error) {
      console.error("Error updating appointment:", error)
      toast.error("Failed to update appointment.")
    }
  }

  const handleCreateAppointment = async (
    petId: string,
    userId: string,
    data: Appointment
  ) => {
    try {
      const appointment = await createAppointment(petId, {
        ...data,
        date: data.date.toISOString(),
      })

      await addAppointmentToPet(petId, appointment.$id)

      const cleanAppointment: Appointment = {
        $id: appointment.$id,
        date: new Date(appointment.date),
        treatment: appointment.treatment,
        description: appointment.description,
        petId: appointment.petId,
        userId: appointment.userId,
        type: appointment.type,
      }

      // Set selected appointment here
      setSelectedAppointment(cleanAppointment)
      setOpenAppointment(true)
      // Update selected pet with new appointment
      setSelectedPet((prevPet) => {
        if (!prevPet) return null
        return {
          ...prevPet,
          appointments: [...prevPet.appointments, cleanAppointment],
        }
      })

      toast.success("Appointment added successfully!")
      setAddAppointment((prev) => !prev)
    } catch (error) {
      console.error("Error creating appointment:", error)
      toast.error("Failed to create appointment.")
    }
  }

  const handleDeletePet = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this pet?"
    )
    if (!confirmDelete) return

    try {
      await deletePet(id)
      toast.success("Pet deleted successfully!")
      setSelectedPet(null)
      setLocalClient((prevClient) => ({
        ...prevClient,
        pets: prevClient.pets.filter((pet) => pet.$id !== id),
      }))
    } catch (error) {
      console.error("Error deleting pet:", error)
      toast.error("Failed to delete pet.")
    }
  }

  const handleCloseAddPet = () => {
    setAddPet(false)
    setSelectedPet(null)
    setOpenAppointment(false)
    setSelectedAppointment(null)
  }

  const handleClickCanvas = () => {
    setShowCanvas((prev) => !prev)
  }

  function getAppointmentTypeIcon(type: string) {
    switch (type.toLowerCase()) {
      case "massage":
        return <Thermometer className="w-5 h-5 text-green-400" />
      case "hydrotherapy":
        return <ShowerHead className="w-5 h-5 text-blue-400" />
      case "chiropractic care":
        return <Stethoscope className="w-5 h-5 text-purple-400" />
      case "laser therapy":
        return <Lightbulb className="w-5 h-5 text-yellow-400" />
      case "shockwave therapy":
        return <Zap className="w-5 h-5 text-red-400" />
      default:
        return null
    }
  }

  return (
    <>
      <div className="p-5">
        {/* TOGGLE CLIENT  CREATE CLIENT */}

        <div className="">
          {edit ? (
            <ClientForm
              initialData={client}
              userId={user.$id}
              onSubmit={handleUpdate}
              setEdit={setEdit}
              handleDelete={handleDeleteClient}
            />
          ) : (
            <OwnerInfo client={client} handleEditToggle={handleEditToggle} />
          )}
        </div>

        <div className="mt-3">
          {addPet ? (
            <div>
              <AddPetForm
                clientId={client.$id}
                onSubmit={handleCreate}
                handleClose={handleCloseAddPet}
              />
            </div>
          ) : selectedPet ? (
            <>
              <div className={` text-gray-800 bg-white`}>
                <div className="p-2 text-sm font-medium flex justify-between border border-gray-800">
                  <div className="flex">{selectedPet.name}</div>

                  <div className="flex justify-end">
                    {(addPet || selectedPet) && (
                      <X
                        size={14}
                        onClick={() => {
                          setAddPet(false)
                          setEditPet(false)
                          setSelectedPet(null)
                          setOpenAppointment(false)
                          setSelectedAppointment(null)
                        }}
                        className="cursor-pointer text-gray-800 hover:text-gray-600"
                      />
                    )}
                  </div>
                </div>

                <div className="border-l border-b border-r border-gray-800 p-1">
                  <div className="flex justify-end gap-2">
                    {editPet ? (
                      <Button
                        type="button"
                        className="bg-white hover:bg-gray-100 cursor-pointer text-gray-800"
                        onClick={() => handleToggleUpdatePet()}
                      >
                        <X size={18} />
                      </Button>
                    ) : (
                      <Button
                        className="bg-white hover:bg-gray-100 cursor-pointer text-gray-800"
                        onClick={() => handleToggleUpdatePet()}
                      >
                        <Edit size={18} />
                      </Button>
                    )}
                  </div>
                  {editPet ? (
                    <div className="">
                      <PetForm
                        initialData={selectedPet}
                        onSubmit={handleUpdatePet}
                        handleClose={handleToggleUpdatePet}
                        handleDelete={handleDeletePet}
                      />
                    </div>
                  ) : (
                    <div className="p-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 ">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Name</p>
                          <p className="text-base">
                            {selectedPet?.name || "N/A"}
                          </p>

                          <p className="text-sm font-medium">Type</p>
                          <p className="text-base">
                            {selectedPet?.type || "N/A"}
                          </p>

                          <p className="text-sm font-medium">Breed</p>
                          <p className="text-base">
                            {selectedPet?.breed || "N/A"}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium">Age</p>
                          <p className="text-base">
                            {selectedPet?.age || "N/A"}
                          </p>
                          <p className="text-sm font-medium">Description</p>
                          <p className="text-base">
                            {selectedPet?.description || "N/A"}
                          </p>

                          <p className="text-sm font-medium">Notes</p>
                          <p className="text-base">
                            {selectedPet?.notes || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                {openAppointment ? (
                  <div className="bg-white overflow-hidden border-l border-r border-b border-gray-900">
                    <div className="flex justify-between border-b border-gray-800">
                      <div className=" p-2 px-4 text-sm flex gap-2">
                        <CalendarRange size={18} />
                        Date:&nbsp;
                        {selectedAppointment?.date
                          ? new Date(
                              selectedAppointment.date
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "N/A"}
                      </div>
                      <X
                        size={14}
                        onClick={handleCloseAppointment}
                        className="text-gray-800 cursor-pointer hover:text-gray-600 m-2 mr-4"
                      />
                    </div>
                    <div className="flex flex-col lg:flex-row bg-white pb-2 gap-6 p-1">
                      <div className="flex flex-col w-full">
                        <div>
                          {editAppointment ? (
                            <div className="flex justify-between w-full ">
                              <AppointmentForm
                                initialData={selectedAppointment ?? undefined}
                                onSubmit={handleUpdateAppointment}
                                onClick={handleEditToggleAppointment}
                                onDelete={handleDeleteAppointment}
                              />
                            </div>
                          ) : (
                            <div className="flex w-full">
                              <div className="w-full">
                                {selectedAppointment && (
                                  <div className="flex w-full justify-end gap-3">
                                    <Button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        e.currentTarget.blur()
                                        handleEditToggleAppointment()
                                      }}
                                      className="text-gray-800 bg-white hover:bg-gray-100 cursor-pointer"
                                    >
                                      <Edit size={20} />
                                    </Button>
                                  </div>
                                )}

                                <div className="space-y-4">
                                  <p className="text-sm font-medium mb-1">
                                    Date
                                  </p>

                                  <p className="text-base">
                                    {selectedAppointment?.date
                                      ? new Date(
                                          selectedAppointment.date
                                        ).toLocaleDateString("nl-NL")
                                      : "N/A"}{" "}
                                  </p>
                                  <p className="text-sm font-medium">Type</p>

                                  <p className="text-base">
                                    {selectedAppointment?.type || "N/A"}
                                  </p>

                                  <p className="text-sm font-medium">
                                    Description
                                  </p>
                                  <p className="text-base mb-4">
                                    {selectedAppointment?.description || "N/A"}
                                  </p>

                                  <p className="text-sm font-medium">
                                    Treatment
                                  </p>

                                  <p className="text-base">
                                    {selectedAppointment?.treatment || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="w-full">
                        <div className="w-full flex justify-end">
                          <Button
                            className="bg-white hover:bg-gray-100 cursor-pointer text-gray-600"
                            onClick={() => handleClickCanvas()}
                          >
                            {showCanvas ? <X /> : <Edit />}
                          </Button>
                        </div>

                        {!showCanvas && (
                          <div className="flex justify-center my-10 mr-20 w-full ">
                            <Image
                              width={450}
                              height={250}
                              src={savedImage ? savedImage : horse}
                              alt="Saved drawing"
                            />
                          </div>
                        )}

                        {showCanvas && (
                          <div className="p-1 mt-10">
                            <PetDrawingCanvas
                              petType={"horse"}
                              onSave={handleSave}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5">
                    {addAppointment ? (
                      <div>
                        <div className="text-sm font-medium mb-1 p-2 flex justify-between px-4">
                          Add Appointment
                          <X
                            size={18}
                            onClick={() => handleToggleAddAppointment()}
                            className="cursor-pointer text-gray-400 hover:text-gray-200"
                          />
                        </div>
                        <CreateAppointmentForm
                          userId={user.$id}
                          petId={selectedPet.$id}
                          onSubmit={(data) =>
                            handleCreateAppointment(
                              selectedPet.$id,
                              selectedPet.ownerId,
                              data
                            )
                          }
                        />
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          <div
                            className="cursor-pointer transition-bg-white text-sm border border-gray-800 hover:bg-gray-100"
                            onClick={() => handleToggleAddAppointment()}
                          >
                            <div className="border-b border-gray-800 px-4 py-2 text-sm text-gray-800 font-medium">
                              Add Appointment
                            </div>
                            <div className="p-4 flex justify-center">
                              <CalendarRange className="cursor-pointer text-gray-400 hover:text-gray-800" />
                            </div>
                          </div>

                          {selectedPet.appointments.map(
                            (appointment: Appointment, index) => (
                              <React.Fragment key={appointment.$id || index}>
                                <div
                                  key={appointment.$id || index}
                                  onClick={() =>
                                    handleSelectAppointment(appointment)
                                  }
                                  className="cursor-pointer border border-gray-800 hover:bg-gray-100 transition-shadow bg-white text-sm"
                                >
                                  <div className="flex justify-between border-b border-gray-800 px-4 py-2 text-sm text-gray-800 font-medium">
                                    {new Date(
                                      appointment.date
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}

                                    <div>
                                      {getAppointmentTypeIcon(appointment.type)}
                                    </div>
                                  </div>
                                  <div className="p-4 space-y-1">
                                    <p className="text-gray-800 font-semibold">
                                      Description: {appointment.description}
                                    </p>
                                    <p className="text-gray-500 font-light">
                                      Type: {appointment.type}
                                    </p>
                                  </div>
                                </div>
                              </React.Fragment>
                            )
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div>
              <Dog
                onClick={() => setAddPet(true)}
                className="text-gray-400 hover:text-gray-800 cursor-pointer"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
                {localClient.pets.map((pet: Pet, index: number) => (
                  <div
                    key={pet.$id || index}
                    onClick={() => handleSelectPet(pet)}
                    className={`cursor-pointer border border-gray-800 text-gray-800 hover:bg-gray-200 text-sm hover:bg-opacity-80 ${getPetColorClass(
                      pet.type
                    )}`}
                  >
                    <div className="border-b border-gray-800 px-4 py-2 text-sm text-gray-800 font-medium">
                      {pet.name}
                    </div>
                    <div className="p-4 space-y-1 relative">
                      <p className="text-gray-800 font-semibold">
                        Age: {pet.age}
                      </p>
                      <p className="text-gray-800 font-semibold">
                        Appointments: {pet.appointments.length}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
