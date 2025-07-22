"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { darkmodeAtom, layoutModeAtom, openSettingsAtom } from "@/lib/store"
import { DialogOverlay } from "@radix-ui/react-dialog"
import { useAtom } from "jotai"
import {
  // AlignCenter,
  // AlignCenterHorizontalIcon,
  // AlignCenterVertical,
  AlignEndHorizontal,
  AlignVerticalSpaceAround,
} from "lucide-react"
import { useEffect, useState } from "react"

const SettingsDialog = () => {
  const [darkmode, setDarkmode] = useAtom(darkmodeAtom)
  const [openSettings, setOpenSettings] = useAtom(openSettingsAtom)
  const [fontSize, setFontSize] = useState("12px")
  const [layoutMode, setLayoutMode] = useAtom(layoutModeAtom)

  useEffect(() => {
    document.documentElement.style.setProperty("--global-font-size", fontSize)
  }, [fontSize])

  const fontSizes = [
    { size: "10px", label: "A", fontWeight: "lighter" },
    { size: "12px", label: "A", fontWeight: "normal" },
    { size: "14px", label: "A", fontWeight: "bold" },
  ]

  const layoutPresets = {
    horizontalSplit: "flex flex-row justify-between w-full gap-2 mb-20",
    verticalSplit: "flex flex-col justify-between w-full gap-2 mb-20",
    reverseSplit: "flex flex-row justify-between w-full gap-2 mb-20",
    centered: "flex flex-row justify-between w-full gap-2 mb-20",
    endAligned: "flex flex-row justify-between w-full gap-2 mb-20",
  }

  return (
    <Dialog open={openSettings} onOpenChange={setOpenSettings}>
      <DialogOverlay className="bg-black/30 backdrop-blur-sm" />
      <DialogContent
        className={`p-10 ${
          darkmode
            ? "bg-gray-100 text-gray-800 border-none"
            : "bg-gray-800 text-gray-200 border-none"
        }`}
      >
        <DialogHeader>
          <DialogTitle>Appearance</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-10">
          <div
            className={` ${
              darkmode ? "text-gray-700" : "text-gray-100"
            } flex justify-start`}
          >
            <div className="w-1/3 flex flex-col gap-12">
              <span
                className={` ${darkmode ? "text-gray-700" : "text-gray-300"}`}
              >
                Darkmode:
              </span>
              <span
                className={` ${darkmode ? "text-gray-700" : "text-gray-300"}`}
              >
                Fontsize:
              </span>
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
        <hr />
        <DialogHeader className="mt-10">
          <DialogTitle>Layout</DialogTitle>
        </DialogHeader>
        <div className="flex justify-start py-10 gap-6">
          <AlignEndHorizontal
            className={`cursor-pointer ${
              layoutMode === layoutPresets.horizontalSplit
                ? "text-gray-500"
                : "text-gray-400"
            }`}
            onClick={() => setLayoutMode(layoutPresets.horizontalSplit)}
          />
          <AlignVerticalSpaceAround
            className={`cursor-pointer ${
              layoutMode === layoutPresets.verticalSplit
                ? "text-gray-500"
                : "text-gray-400"
            }`}
            onClick={() => setLayoutMode(layoutPresets.verticalSplit)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SettingsDialog
