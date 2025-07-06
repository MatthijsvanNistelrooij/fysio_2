"use client"
import CustomContainer from "@/components/CustomContainer"
import InfoCard from "@/components/InfoCard"
import CustomButton from "@/components/shared/CustomButton"
import { useUser } from "@/context/UserContextProvider"
import { darkmodeAtom } from "@/lib/store"
import { useAtom } from "jotai"
import { Edit } from "lucide-react"
import React, { useEffect, useState } from "react"

const Profile = () => {
  const [fontSize] = useState("12px")
  const [darkmode] = useAtom(darkmodeAtom)
  const { user } = useUser()

  useEffect(() => {
    document.documentElement.style.setProperty("--global-font-size", fontSize)
  }, [fontSize])

  return (
    <CustomContainer>
      <div className="mx-auto space-y-8">
        <InfoCard
          title={"Account"}
          action={
            <CustomButton>
              <Edit />
            </CustomButton>
          }
        >
          <div className="space-y-4">
            <div
              className={` ${
                darkmode ? "text-gray-700" : "text-gray-100"
              } flex justify-start`}
            >
              <div className="w-1/3 flex flex-col gap-12">
                <span className="font-semibold">Full name:</span>
                <span className="font-semibold">Email:</span>
              </div>
              <div className="w-1/3 flex flex-col gap-12">
                <span>{user?.fullName || "—"}</span>
                <span>{user?.email || "—"}</span>
              </div>
            </div>
          </div>
        </InfoCard>
      </div>
    </CustomContainer>
  )
}

export default Profile
