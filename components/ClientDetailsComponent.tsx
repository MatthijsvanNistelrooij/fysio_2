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
  Trash,
  X,
} from "lucide-react"
import { deleteClient, updateClient } from "@/lib/client.actions"
import { toast } from "sonner"
import image from "../public/logo.png"
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

import Image from "next/image"
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ClientDetailsComponent({ client }: { client: any }) {
  const router = useRouter()
  const [addPet, setAddPet] = useState(false)
  const [edit, setEdit] = useState(false)
  const [editAppointment, setEditAppointment] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [localClient, setLocalClient] = useState<Client>(client)
  const [addAppointment, setAddAppointment] = useState(false)
  const [editPet, setEditPet] = useState(false)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)

  const [openAppointment, setOpenAppointment] = useState(false)

  useEffect(() => {
    setLocalClient(client)
  }, [client])

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    }
    fetchUser()
  }, [])

  if (!user) return

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
    console.log(data)
    try {
      const appointment = await createAppointment(petId, {
        ...data,
        date: data.date.toISOString(),
      })

      await addAppointmentToPet(petId, appointment.$id)

      toast.success("Appointment added successfully!")
      setAddAppointment((prev) => !prev)

      setSelectedPet((prevPet) => {
        if (!prevPet) return null
        const cleanAppointment: Appointment = {
          $id: appointment.$id,
          date: new Date(appointment.date),
          treatment: appointment.treatment,
          description: appointment.description,
          petId: appointment.petId,
          userId: appointment.userId,
        }
        return {
          ...prevPet,
          appointments: [...prevPet.appointments, cleanAppointment],
        }
      })
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

  return (
    <>
      <div className="pb-5 rounded-2xl ">
        <div className="mb-6">
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
                className="p-1 bg-gray-800 rounded-xl min-w-[140px] flex-1 text-white flex"
                onClick={() => {
                  navigator.clipboard.writeText(client.name)
                  toast.success("Client name copied to clipboard!")
                }}
              >
                <Contact size={18} className="text-xs text-gray-300 m-1" />
                <div className="text-sm mt-1 ml-1">{client.name}</div>
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
                onClick={handleEditToggle}
                className="text-gray-800 bg-white hover:bg-gray-100 cursor-pointer"
              >
                <Edit size={20} />
              </Button>
            </div>
          )}
        </div>

        <div className="mt-10 ">
          {addPet ? (
            <AddPetForm
              clientId={client.$id}
              onSubmit={handleCreate}
              handleClose={handleCloseAddPet}
            />
          ) : selectedPet ? (
            <div className={`shadow-xl text-gray-800 rounded bg-white `}>
              <div className="bg-gray-800 px-4 py-2 rounded-t text-sm text-white font-medium flex justify-between mt-5">
                {selectedPet.name}
                <div className="flex justify-end">
                  {(addPet || selectedPet) && (
                    <X
                      size={20}
                      onClick={() => {
                        setAddPet(false)
                        setSelectedPet(null)
                        setOpenAppointment(false)
                        setSelectedAppointment(null)
                      }}
                      className="cursor-pointer text-gray-400 hover:text-gray-200"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-1">
                {editPet ? (
                  <div className="">
                    <PetForm
                      initialData={selectedPet}
                      onSubmit={handleUpdatePet}
                      handleClose={handleToggleUpdatePet}
                    />
                  </div>
                ) : (
                  <div className="">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 pt-2">
                        <p className="text-sm font-medium mb-1">Name:</p>
                        <p className="text-base mb-4">
                          {selectedPet?.name || "N/A"}
                        </p>

                        <p className="text-sm font-medium mb-1">Type:</p>
                        <p className="text-base mb-4">
                          {selectedPet?.type || "N/A"}
                        </p>

                        <p className="text-sm font-medium mb-1">Breed:</p>
                        <p className="text-base mb-4">
                          {selectedPet?.breed || "N/A"}
                        </p>
                      </div>

                      <div className="p-5 pt-2">
                        <p className="text-sm font-medium mb-1">Age:</p>
                        <p className="text-base mb-4">
                          {selectedPet?.age || "N/A"}
                        </p>
                        <p className="text-sm font-medium mb-1">Description:</p>
                        <p className="text-base mb-4">
                          {selectedPet?.description || "N/A"}
                        </p>

                        <p className="text-sm font-medium mb-1">Notes:</p>
                        <p className="text-base mb-4">
                          {selectedPet?.notes || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 p-5">
                  {editPet ? (
                    <Button
                      className="text-gray-800 bg-white hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleToggleUpdatePet()}
                    >
                      <X size={18} />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleToggleUpdatePet()}
                      className="text-gray-800 bg-white hover:bg-gray-100 cursor-pointer"
                    >
                      <Edit size={18} />
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDeletePet(selectedPet.$id)}
                    className="text-gray-800 bg-white hover:bg-gray-100 cursor-pointer"
                  >
                    <Trash size={18} />
                  </Button>
                </div>
                {openAppointment ? (
                  <div
                    className={`bg-white overflow-hidden mt-6 rounded ${
                      openAppointment
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-85 py-0"
                    }`}
                  >
                    <div className="flex justify-between bg-gray-800 rounded-t">
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
                    <div className="flex flex-col md:flex-row bg-white border pb-12 p-5 gap-6">
                      {editAppointment ? (
                        <div className="flex justify-between w-full">
                          <AppointmentForm
                            initialData={selectedAppointment ?? undefined}
                            onSubmit={handleUpdateAppointment}
                            onClick={handleEditToggleAppointment}
                          />
                        </div>
                      ) : (
                        <div className="flex w-full">
                          <div className="flex-1 text-gray-800">
                            <p className="text-sm font-medium mb-1">
                              Description:
                            </p>
                            <p className="text-base mb-4">
                              {selectedAppointment?.description || "N/A"}
                            </p>

                            <p className="text-sm font-medium mb-1">
                              Treatment:
                            </p>
                            <p className="text-base">
                              {selectedAppointment?.treatment || "N/A"}
                            </p>
                          </div>

                          <div className="flex flex-col">
                            <Image
                              width={40}
                              height={40}
                              src={image}
                              alt="Appointment"
                              className="w-full h-auto max-h-48 object-cover shadow"
                            />
                            {selectedAppointment && (
                              <div className="flex w-full mt-5 justify-end gap-3">
                                <Edit
                                  size={20}
                                  onClick={handleEditToggleAppointment}
                                  className="cursor-pointer text-gray-400 hover:text-gray-800"
                                />
                                <Trash
                                  size={20}
                                  onClick={() =>
                                    handleDeleteAppointment(
                                      selectedAppointment.$id
                                    )
                                  }
                                  className="cursor-pointer text-gray-400 hover:text-gray-800"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="border-t p-5">
                    {addAppointment ? (
                      <div>
                        <div className="bg-gray-800 text-sm font-medium mb-1 text-white p-2 flex justify-between rounded-t mt-5 px-4">
                          Add New Appointment
                          <X
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
                          <div
                            className="cursor-pointer rounded shadow hover:shadow-md transition-shadow bg-white text-sm"
                            onClick={() => handleToggleAddAppointment()}
                          >
                            <div className="bg-gray-800 px-4 py-2 rounded-t text-sm text-white font-medium">
                              Add New Appointment
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
                                  className="cursor-pointer rounded shadow hover:shadow-md transition-shadow bg-white text-sm"
                                >
                                  <div className="bg-gray-800 px-4 py-2 rounded-t text-sm text-white font-medium">
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
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
              <div
                onClick={() => setAddPet(true)}
                className={`cursor-pointer shadow text-gray-800 rounded hover:bg-gray-200 text-sm hover:bg-opacity-80`}
              >
                <div className="bg-gray-800 px-4 py-2 rounded-t text-sm text-white font-medium">
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
                  className={`cursor-pointer shadow text-gray-800 rounded hover:bg-gray-200 text-sm hover:bg-opacity-80 ${getPetColorClass(
                    pet.type
                  )}`}
                >
                  <div className="bg-gray-800 px-4 py-2 rounded-t text-sm text-white font-medium">
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
