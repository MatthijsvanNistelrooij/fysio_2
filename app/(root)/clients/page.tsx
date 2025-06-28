"use client"
import React, { useEffect } from "react"
import { useClients } from "@/hooks/useClients"
import { useAtom } from "jotai"
import { clientsAtom, toggleEditAtom, loadingAtom, userAtom } from "@/lib/store"

import CreateClientForm from "@/components/CreateClientForm"
import ClientList from "@/components/ClientList"
import NoClients from "@/components/NoClients"
import Searchbar from "@/components/Searchbar"
import Loading from "@/components/Loading"
import CustomContainer from "@/components/CustomContainer"

const Clients = () => {
  useClients()

  const [clients] = useAtom(clientsAtom)
  const [loading] = useAtom(loadingAtom)
  const [user] = useAtom(userAtom)
  const [edit, setEdit] = useAtom(toggleEditAtom)

  useEffect(() => {
    setEdit(false)
  }, [])

  if (loading && clients?.length === 0) return <Loading />
  if (clients?.length === 0) return <NoClients />

  return (
    <CustomContainer>
      <Searchbar />
      {edit ? <CreateClientForm $id={user?.$id} padding="" /> : <ClientList />}
    </CustomContainer>
  )
}

export default Clients
