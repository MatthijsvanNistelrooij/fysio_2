export const appwriteConfig = {
  endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
  
  usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS!,
  clientsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_CLIENTS!,
  petsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_PETS!,
  appointmentsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_APPOINTMENTS!,
  
  bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET!,
  secretKey: process.env.NEXT_APPWRITE_SECRET_KEY!,
}
