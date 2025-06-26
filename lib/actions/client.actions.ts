import { Client, Databases, ID, Query } from "node-appwrite"
import { appwriteConfig } from "../../appwrite/config"

const client = new Client()
  .setEndpoint(appwriteConfig.endpointUrl)
  .setProject(appwriteConfig.projectId)

const databases = new Databases(client)

export { client, databases }

export const getClientsByUserId = async (userId: string) => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.clientsCollectionId,
      [Query.equal("userId", userId)]
    )
    return response.documents
  } catch (error) {
    console.error("Failed to fetch clients:", error)
    return []
  }
}

export const createClient = async ({
  name,
  email,
  phone,
  address,
  userId,
}: {
  name: string
  email: string
  phone: string
  address: string
  userId: string
}) => {
  const newClient = await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.clientsCollectionId,
    ID.unique(),
    {
      name,
      email,
      phone,
      address,
      userId,
    }
  )

  return newClient // This includes the newClient.$id
}

export const updateClient = async (
  id: string,
  {
    name,
    email,
    phone,
    address,
    pets,
    userId,
  }: {
    name: string
    email: string
    phone: string
    address: string
    userId: string
    pets: {
      name: string
      type: string
      age?: string
      ownerId?: string
    }[]
  }
) => {
  try {
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.clientsCollectionId,
      id,
      {
        name,
        email,
        phone,
        address,
        pets,
        userId,
      }
    )
  } catch (error) {
    console.error("Failed to update client:", error)
    throw error
  }
}

export const deleteClient = async (id: string) => {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.clientsCollectionId,
      id
    )
  } catch (error) {
    console.error("Failed to delete client:", error)
    throw error
  }
}

export const getClientById = async (id: string) => {
  try {
    const response = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.clientsCollectionId,
      id
    )
    return response
  } catch (error) {
    console.error("Failed to fetch client:", error)
    return null
  }
}
