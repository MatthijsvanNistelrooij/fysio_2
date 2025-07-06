// DeepgramDemo.tsx
import { useDeepgram } from "@/hooks/useDeepgram"
import React from "react"
import { Button } from "./ui/button"
import { useAtom } from "jotai"
import { darkmodeAtom } from "@/lib/store"
import { Mic } from "lucide-react"

const Deepgram: React.FC = () => {
  const { transcript, startListening, stopListening } = useDeepgram(
    process.env.NEXT_PUBLIC_DEEPGRAM_API!
  )

  const [darkmode] = useAtom(darkmodeAtom)

  return (
    <div className="w-full mx-auto">
      <div className={`p-4 ${darkmode ? "bg-[#e9edf3] text-gray-800": "bg-gray-700 text-gray-100"} rounded min-h-[100px] whitespace-pre-wrap`}>
        {transcript || "Nog geen input..."}
      </div>
      <div className="mt-4 flex gap-2">
        <Button
          onClick={startListening}
          className={` ${
            darkmode
              ? "bg-white hover:bg-gray-100 text-gray-800"
              : "bg-gray-600 text-gray-200 hover:bg-gray-700"
          }  cursor-pointer `}
        >
          Start
          <Mic />
        </Button>
        <Button
          onClick={stopListening}
          className={` ${
            darkmode
              ? "bg-red-600 hover:bg-gray-500 text-white"
              : "bg-red-600 text-gray-200 hover:bg-gray-700"
          }  cursor-pointer `}
        >
          Stop
        </Button>
      </div>
    </div>
  )
}

export default Deepgram
