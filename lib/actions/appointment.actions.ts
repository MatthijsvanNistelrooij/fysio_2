import { Client, Databases, ID, Query } from "node-appwrite"
import { appwriteConfig } from "../../appwrite/config"
import { Appointment } from "@/lib/types"

const client = new Client()
  .setEndpoint(appwriteConfig.endpointUrl)
  .setProject(appwriteConfig.projectId)

const databases = new Databases(client)

export { client, databases }

export const getAllAppointments = async () => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.appointmentsCollectionId
    )
    return response.documents
  } catch (error) {
    console.error("Failed to fetch appointments:", error)
    return []
  }
}

export const getAppointmentById = async (id: string) => {
  try {
    const response = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.appointmentsCollectionId,
      id
    )
    return response
  } catch (error) {
    console.error("Failed to fetch pet", error)
    return null
  }
}

export const getAppointmentsByUserId = async (userId: string) => {
  return await databases
    .listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.appointmentsCollectionId,
      [Query.equal("userId", userId)]
    )
    .then((res) => res.documents)
}

export const updateAppointment = async (id: string, data: Appointment) => {
  try {
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.appointmentsCollectionId,
      id,
      data
    )
  } catch (error) {
    console.error("Failed to update appointment:", error)
    throw error
  }
}

export const deleteAppointment = async (id: string) => {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.appointmentsCollectionId,
      id
    )
  } catch (error) {
    console.error("Failed to delete appointment:", error)
    throw error
  }
}

export const createAppointment = async (
  petId: string,
  appointmentData: {
    description: string
    treatment: string
    date: string
    userId: string
    type: string
  }
) => {
  try {
    const appointment = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.appointmentsCollectionId,
      ID.unique(), // generate new id here
      {
        userId: appointmentData.userId,
        description: appointmentData.description,
        treatment: appointmentData.treatment,
        date: appointmentData.date, // string ISO date
        petId: petId,
        type: appointmentData.type,
      }
    )
    return appointment
  } catch (error) {
    console.error("Failed to create appointment:", error)
    throw error
  }
}

export const addAppointmentToPet = async (
  petId: string,
  appointmentId: string
) => {
  try {
    // First, fetch the current appointments array
    const pet = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.petsCollectionId,
      petId
    )

    const currentAppointments = pet.appointments || []

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.petsCollectionId,
      petId,
      {
        appointments: [...currentAppointments, appointmentId],
      }
    )
  } catch (error) {
    console.error("Failed to add appointment to pet:", error)
    throw error
  }
}

export const getAppointmentsByPetId = async (petId: string) => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.appointmentsCollectionId,
      [Query.equal("petId", petId), Query.orderDesc("$createdAt")]
    )
    return response.documents
  } catch (error) {
    console.error(`Failed to fetch appointments for pet ${petId}:`, error)
    return []
  }
}
