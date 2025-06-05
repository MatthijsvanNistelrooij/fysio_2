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
    <div className="min-h-screen flex justify-center p-1">
      <div className="w-full">
        <ClientDetailsComponent client={client} />
      </div>
    </div>
  )
}

export default ClientDetails
