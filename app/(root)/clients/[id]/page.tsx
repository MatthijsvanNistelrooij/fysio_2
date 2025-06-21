import ClientDetailsComponent from "@/components/ClientDetailsComponent"
import { getClientById } from "@/lib/actions/client.actions"
import { Client } from "@/lib/types"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string | string[] }>
}

const ClientDetails = async ({ params }: Props) => {
  const { id } = await params

  const clientId = Array.isArray(id) ? id[0] : id

  const client = (await getClientById(clientId)) as unknown as Client
  if (!client) return notFound()

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full">
        <ClientDetailsComponent client={client} />
      </div>
    </div>
  )
}

export default ClientDetails
