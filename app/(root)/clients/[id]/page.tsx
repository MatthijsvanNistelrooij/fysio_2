import ClientDetailsComponent from "@/components/ClientDetailsComponent"
import { getClientById } from "@/lib/client.actions"

import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string | string[] }>
}

const ClientDetails = async ({ params }: Props) => {
  const { id } = await params

  const clientId = Array.isArray(id) ? id[0] : id

  const client = await getClientById(clientId)
  if (!client) return notFound()

  return (
    <div className="min-h-screen flex justify-center bg-gray-50">
      <div className="bg-white max-w-5xl w-full border rounded-3xl m-10">
        <div className="h-screen  bg-white max-w-5xl w-full border rounded-3xl m-5 shadow-xl">
          <ClientDetailsComponent client={client} />
        </div>
      </div>
    </div>
  )
}

export default ClientDetails
