/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react"

import { Client } from "@/lib/types"
import { useAtom } from "jotai"
import { clientsAtom, loadingAtom, userAtom } from "@/lib/store"
import { getCurrentUser } from "@/app/api/users/route"
import { getClientsByUserId } from "@/app/api/clients/route"

export const useClients = () => {
  const [, setClients] = useAtom(clientsAtom)
  const [, setLoading] = useAtom(loadingAtom)
  const [, setUser] = useAtom(userAtom)

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      if (!currentUser) return

      setLoading(true)

      const data = await getClientsByUserId(currentUser.$id)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedClients: Client[] = data.map((doc: any) => ({
        $id: doc.$id,
        userId: doc.userId,
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        address: doc.address,
        pets: doc.pets,
      }))

      setClients(formattedClients)
      setLoading(false)
    }

    fetchData()
  }, [])
}
