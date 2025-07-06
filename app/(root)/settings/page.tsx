"use client"
import CustomContainer from "@/components/CustomContainer"
import InfoCard from "@/components/InfoCard"
import CustomButton from "@/components/shared/CustomButton"
import { useUser } from "@/context/UserContextProvider"
import { darkmodeAtom } from "@/lib/store"
import { useAtom } from "jotai"
import { Edit } from "lucide-react"
import React from "react"

const SettingsPage = () => {
  const [fontSize, setFontSize] = React.useState("12px")
  const [darkmode, setDarkmode] = useAtom(darkmodeAtom)
  const { user } = useUser()

  React.useEffect(() => {
    document.documentElement.style.setProperty("--global-font-size", fontSize)
  }, [fontSize])

  const fontSizes = [
    { size: "10px", label: "A", fontWeight: "lighter" },
    { size: "12px", label: "A", fontWeight: "normal" },
    { size: "14px", label: "A", fontWeight: "bold" },
  ]

  return (
    <CustomContainer>
      <div className="mx-auto space-y-8">
        <InfoCard title="Appearance">
          <div className="space-y-4">
            <div
              className={` ${
                darkmode ? "text-gray-700" : "text-gray-100"
              } flex justify-start`}
            >
              <div className="w-1/3 flex flex-col gap-12">
                <span className="font-semibold">Darkmode:</span>
                <span className="font-semibold">Fontsize:</span>
              </div>
              <div className="w-1/3 flex flex-col gap-12">
                <span>
                  {" "}
                  <button
                    onClick={() => setDarkmode(!darkmode)}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-300 cursor-pointer ${
                      !darkmode ? "bg-gray-700" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        !darkmode ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </span>
                <span className="flex gap-5">
                  {fontSizes.map(({ size, label, fontWeight }) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      style={{
                        fontSize: size,
                        fontWeight: fontWeight,
                      }}
                      className={`cursor-pointer px-2 py-1 rounded transition ${
                        fontSize === size
                          ? darkmode
                            ? "bg-gray-200 text-gray-800 border-b"
                            : "bg-gray-800 text-gray-200 border-b"
                          : darkmode
                          ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                      aria-label={`Set font size to ${size}`}
                    >
                      {label}
                    </button>
                  ))}
                </span>
              </div>
            </div>
          </div>
        </InfoCard>
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

export default SettingsPage
