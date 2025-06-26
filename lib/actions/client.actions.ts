import { Client, Databases, ID, Query } from "node-appwrite"
import { appwriteConfig } from "../../appwrite/config"

const client = new Client()
  .setEndpoint(appwriteConfig.endpointUrl)
  .setProject(appwriteConfig.projectId)

const databases = new Databases(client)

export { client, databases }

export const getClientsByUserId = async (userId: string) => {
  console.log("[getClientsByUserId] Fetching clients for userId:", userId)

  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.clientsCollectionId,
      [Query.equal("userId", userId)]
    )
    console.log("[getClientsByUserId] Found clients:", response.documents)
    return response.documents
  } catch (error) {
    console.error("[getClientsByUserId] Failed to fetch clients:", error)
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
  console.log("[createClient] Creating client with data:", {
    name,
    email,
    phone,
    address,
    userId,
  })

  try {
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
    console.log("[createClient] Created client:", newClient)
    return newClient
  } catch (error) {
    console.error("[createClient] Failed to create client:", error)
    throw error
  }
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
  console.log("[updateClient] Updating client", id, "with data:", {
    name,
    email,
    phone,
    address,
    pets,
    userId,
  })

  try {
    const updated = await databases.updateDocument(
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
    console.log("[updateClient] Update successful:", updated)
    return updated
  } catch (error) {
    console.error("[updateClient] Failed to update client:", error)
    throw error
  }
}

export const deleteClient = async (id: string) => {
  console.log("[deleteClient] Deleting client with id:", id)

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.clientsCollectionId,
      id
    )
    console.log("[deleteClient] Client deleted:", id)
  } catch (error) {
    console.error("[deleteClient] Failed to delete client:", error)
    throw error
  }
}

export const getClientById = async (id: string) => {
  console.log("[getClientById] Fetching client with id:", id)

  try {
    const response = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.clientsCollectionId,
      id
    )
    console.log("[getClientById] Found client:", response)
    return response
  } catch (error) {
    console.error("[getClientById] Failed to fetch client:", error)
    return null
  }
}
