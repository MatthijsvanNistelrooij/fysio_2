"use client"

import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import {
  CalendarRange,
  Contact,
  Edit,
  HomeIcon,
  Mail,
  Phone,
  Plus,
  X,
} from "lucide-react"
import { deleteClient, updateClient } from "@/lib/client.actions"
import { toast } from "sonner"
import horse from "../public/horse.jpg"
import {
  addPetToClient,
  createPet,
  deletePet,
  updatePet,
} from "@/lib/pet.actions"
import AddPetForm from "./AddPetForm"
import { Appointment, Client, Pet, User } from "@/types"

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
        return "bg-yellow-100"
      case "cat":
        return "bg-purple-100"
      case "horse":
        return "bg-green-100"
      default:
        return "bg-gray-100"
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

  return (
    <>
      <div className="pb-1 rounded-2xl mt-1">
        <div className=" bg-white p-3 rounded-xl shadow-xl mb-10">
          {edit ? (
            <div>
              <ClientForm
                initialData={client}
                userId={user.$id}
                onSubmit={handleUpdate}
                setEdit={setEdit}
                handleDelete={handleDeleteClient}
              />
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-2 w-full ">
              <div
                className="p-1 rounded-xl text-gray-100 flex items-center bg-gray-800 min-w-[140px] flex-1 text-sm"
                onClick={() => {
                  navigator.clipboard.writeText(client.name)
                  toast.success("Client name copied to clipboard!")
                }}
              >
                <Contact size={18} className="text-xs text-gray-300 m-1" />
                <div className="text-sm ml-1">{client.name}</div>
              </div>

              <div
                className="p-1 rounded-xl text-gray-600 flex items-center bg-gray-100 min-w-[140px] flex-1 text-sm"
                onClick={() => {
                  navigator.clipboard.writeText(client.address)
                  toast.success("Address copied to clipboard!")
                }}
              >
                <HomeIcon size={18} className="text-xs text-gray-300 m-1" />
                <div className="ml-1">{client.address}</div>
              </div>
              <div
                className="p-1 rounded-xl text-gray-600 flex items-center bg-gray-100 min-w-[140px] flex-1 text-sm"
                onClick={() => {
                  navigator.clipboard.writeText(client.phone)
                  toast.success("Phone number copied to clipboard!")
                }}
              >
                <Phone size={18} className="text-xs text-gray-300 m-1" />

                <div className="ml-1">{client.phone}</div>
              </div>

              <div
                className="p-1 rounded-xl text-gray-600 flex items-center bg-gray-100 min-w-[140px] flex-1 text-sm"
                onClick={() => {
                  navigator.clipboard.writeText(client.email)
                  toast.success("Email copied to clipboard!")
                }}
              >
                <Mail size={18} className="text-xs text-gray-300 m-1" />
                <div className="ml-1">{client.email}</div>
              </div>
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  e.currentTarget.blur()
                  handleEditToggle()
                }}
                className="text-gray-800 bg-white hover:bg-gray-100 cursor-pointer"
              >
                <Edit size={20} />
              </Button>
            </div>
          )}
        </div>

        <div className="mt-1">
          {addPet ? (
            <AddPetForm
              clientId={client.$id}
              onSubmit={handleCreate}
              handleClose={handleCloseAddPet}
            />
          ) : selectedPet ? (
            <>
              <div className={`shadow-xl text-gray-800 rounded-xl bg-white `}>
                <div className="bg-gray-800 px-4 py-2 text-sm text-white font-medium flex justify-between mt-5 rounded-t-xl">
                  <div className="flex">{selectedPet.name}</div>

                  <div className="flex justify-end">
                    {(addPet || selectedPet) && (
                      <X
                        size={20}
                        onClick={() => {
                          setAddPet(false)
                          setEditPet(false)
                          setSelectedPet(null)
                          setOpenAppointment(false)
                          setSelectedAppointment(null)
                        }}
                        className="cursor-pointer text-gray-400 hover:text-gray-200"
                      />
                    )}
                  </div>
                </div>

                <div className="p-5">
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
                    <div className="">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="pt-2">
                          <p className="text-sm font-medium mb-1">Name:</p>
                          <p className="text-base mb-4">
                            {selectedPet?.name || "N/A"}
                          </p>

                          <p className="text-sm font-medium mb-1">Type:</p>
                          <p className="text-base mb-4">
                            {selectedPet?.type || "N/A"}
                          </p>

                          <p className="text-sm font-medium mb-1 mt-7">Breed:</p>
                          <p className="text-base mb-4">
                            {selectedPet?.breed || "N/A"}
                          </p>
                        </div>

                        <div className="p-5 pt-2">
                          <p className="text-sm font-medium mb-1">Age:</p>
                          <p className="text-base mb-4">
                            {selectedPet?.age || "N/A"}
                          </p>
                          <p className="text-sm font-medium mb-1">
                            Description:
                          </p>
                          <p className="text-base mb-4">
                            {selectedPet?.description || "N/A"}
                          </p>

                          <p className="text-sm font-medium mb-1 mt-8">Notes:</p>
                          <p className="text-base mb-4">
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
                  <div
                    className={`bg-white overflow-hidden shadow-xl mt-5 rounded-xl ${
                      openAppointment
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-85 py-0"
                    }`}
                  >
                    <div className="flex justify-between bg-gray-800 rounded-t-xl">
                      <div className="text-white p-2 px-4 text-sm flex gap-2">
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
                        size={20}
                        onClick={handleCloseAppointment}
                        className="text-gray-400 cursor-pointer hover:text-gray-200 m-2"
                      />
                    </div>
                    <div className="flex flex-col md:flex-row bg-white pb-2 gap-6 p-5">
                      <div className="flex flex-col w-full">
                        <div>
                          {editAppointment ? (
                            <div className="flex justify-between w-full">
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

                                <div className="">
                                  <p className="text-sm font-medium mb-1">
                                    Description
                                  </p>
                                  <p className="text-base mb-4">
                                    {selectedAppointment?.description || "N/A"}
                                  </p>

                                  <p className="text-sm font-medium mb-1 mt-14">
                                    Treatment
                                  </p>

                                  <p className="text-base">
                                    {selectedAppointment?.treatment || "N/A"}
                                  </p>

                                  <p className="text-sm font-medium mb-1 mt-8">
                                    Date
                                  </p>

                                  <p className="text-base">
                                    {selectedAppointment?.date
                                      ? new Date(
                                          selectedAppointment.date
                                        ).toLocaleDateString("nl-NL")
                                      : "N/A"}{" "}
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
                          <div
                            style={{
                              position: "relative",
                              width: 460,
                              height: 385,
                              borderRadius: 8,
                              overflow: "hidden",
                              margin: "20px",
                            }}
                          >
                            <Image
                              width={440}
                              height={250}
                              src={savedImage ? savedImage : horse}
                              alt="Saved drawing"
                            />
                          </div>
                        )}

                        {showCanvas && (
                          <div className="w-full p-5 ">
                            <div className="flex flex-col pr-5">
                              <PetDrawingCanvas
                                petType={"horse"}
                                onSave={handleSave}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5">
                    {addAppointment ? (
                      <div>
                        <div className="bg-gray-800 text-sm font-medium mb-1 text-white p-2 flex justify-between rounded-t-xl px-4 -mt-10">
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
                            className="cursor-pointer rounded-xl shadow hover:shadow-md transition-shadow bg-white text-sm"
                            onClick={() => handleToggleAddAppointment()}
                          >
                            <div className="bg-gray-800 px-4 py-2 text-sm text-white font-medium rounded-t-xl">
                              Add Appointment
                            </div>
                            <div className="p-4 flex justify-center">
                              <Plus className="cursor-pointer text-gray-400 hover:text-gray-800" />
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
                                  className="cursor-pointer rounded-xl shadow hover:shadow-md transition-shadow bg-white text-sm"
                                >
                                  <div className="bg-gray-800 px-4 py-2 rounded-t-xl text-sm text-white font-medium">
                                    {new Date(
                                      appointment.date
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </div>
                                  <div className="p-4 space-y-1">
                                    <p className="text-gray-800 font-semibold">
                                      Description: {appointment.description}
                                    </p>
                                    <p className="text-gray-500 font-light">
                                      Treatment: {appointment.treatment}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
              <div
                onClick={() => setAddPet(true)}
                className={`cursor-pointer shadow text-gray-800 rounded-xl hover:bg-gray-200 text-sm hover:bg-opacity-80`}
              >
                <div className="bg-gray-800 px-4 py-2 rounded-t-xl text-sm text-white font-medium">
                  Add New Pet
                </div>
                <div className="p-4 flex justify-center">
                  <Plus className="text-gray-400 hover:text-gray-800" />
                </div>
              </div>

              {localClient.pets.map((pet: Pet, index: number) => (
                <div
                  key={pet.$id || index}
                  onClick={() => handleSelectPet(pet)}
                  className={`cursor-pointer shadow text-gray-800 rounded-xl hover:bg-gray-200 text-sm hover:bg-opacity-80 ${getPetColorClass(
                    pet.type
                  )}`}
                >
                  <div className="bg-gray-800 px-4 py-2 text-sm text-white font-medium rounded-t-xl">
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
          )}
        </div>
      </div>
    </>
  )
}
