import React from "react"
import { Button } from "./ui/button"
import { Edit, X } from "lucide-react"
import InfoCard from "./InfoCard"
import { toast } from "sonner"
import { darkmodeAtom, toggleEditAtom, userAtom } from "@/lib/store"
import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { deleteClient, updateClient } from "@/lib/actions/client.actions"
import type { Client } from "@/lib/types" // or wherever your Client type is defined
import ClientForm from "./ClientForm"
import OwnerInfo from "./OwnerInfo"

const Info = ({ client }: { client: Client }) => {
  const [edit, setEdit] = useAtom(toggleEditAtom)
  const [user] = useAtom(userAtom)
  const [darkmode] = useAtom(darkmodeAtom)
  const router = useRouter()

  const handleEditToggle = () => {
    setEdit((prev) => !prev)
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

  return (
    <InfoCard
      title="Owner"
      action={
        edit ? (
          <Button
            type="button"
            className={` ${
              darkmode
                ? "bg-white hover:bg-gray-100 text-gray-800"
                : "bg-gray-600 text-gray-200 hover:bg-gray-700"
            }  cursor-pointer `}
            onClick={() => handleEditToggle()}
          >
            <X size={18} />
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              e.currentTarget.blur()
              handleEditToggle()
            }}
            className={` ${
              darkmode
                ? "bg-white hover:bg-gray-100 text-gray-800"
                : "bg-gray-600 text-gray-200 hover:bg-gray-700"
            }  cursor-pointer `}
          >
            <Edit size={20} />
          </Button>
        )
      }
    >
      {edit ? (
        <ClientForm
          initialData={client}
          userId={user?.$id || ""}
          onSubmit={handleUpdate}
          setEdit={setEdit}
          handleDelete={handleDeleteClient}
        />
      ) : (
        <OwnerInfo client={client} handleEditToggle={handleEditToggle} />
      )}
    </InfoCard>
  )
}

export default Info
