import { Client, Databases, ID } from "node-appwrite"
import { appwriteConfig } from "../appwrite/config"

const client = new Client()
  .setEndpoint(appwriteConfig.endpointUrl)
  .setProject(appwriteConfig.projectId)

const databases = new Databases(client)

export { client, databases }

export const getAllPets = async () => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.petsCollectionId
    )
    return response.documents
  } catch (error) {
    console.error("Failed to fetch pets:", error)
    return []
  }
}

export const getPetById = async (id: string) => {
  try {
    const response = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.petsCollectionId,
      id
    )

    return response
  } catch (error) {
    console.error("Failed to fetch pet", error)
    return null
  }
}

export const createPet = async ({
  name,
  type,
  age,
  ownerId,
}: {
  name: string
  type: string
  age?: string
  ownerId: string
}) => {
  try {
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.petsCollectionId,
      ID.unique(),
      {
        name,
        type,
        age,
        ownerId,
      }
    )
    return response
  } catch (error) {
    console.error("Failed to create pet:", error)
    throw error
  }
}

export const addPetToClient = async (clientId: string, petId: string) => {
  try {
    // Fetch current pets relation (optional if you use arrayUnion)
    const client = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.clientsCollectionId,
      clientId
    )

    const existingPets = client.pets || []

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.clientsCollectionId,
      clientId,
      {
        pets: [...existingPets, petId],
      }
    )
  } catch (error) {
    console.error("Failed to add pet to client:", error)
    throw error
  }
}

export const updatePet = async (
  id: string,
  {
    name,
    type,
    age,
    breed,
    notes,
    ownerId,
    description,
    drawing,
  }: {
    name: string
    type: string
    age?: string
    breed?: string
    notes?: string
    ownerId: string
    description: string
    drawing: string
  }
) => {
  try {
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.petsCollectionId,
      id,
      {
        name,
        description,
        type,
        age,
        ownerId,
        breed,
        notes,
        drawing,
      }
    )
  } catch (error) {
    console.error("Failed to update pet:", error)
    throw error
  }
}

export const deletePet = async (id: string) => {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.petsCollectionId,
      id
    )
  } catch (error) {
    console.error("Failed to delete pet:", error)
    throw error
  }
}

export const storeDrawing = async ({
  petId,
  imageDataUrl,
}: {
  petId: string
  imageDataUrl: string
}) => {
  try {
    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.petsCollectionId,
      petId,
      {
        drawing: imageDataUrl,
      }
    )
    return response
  } catch (error) {
    console.error("Failed to store drawing:", error)
    throw error
  }
}
