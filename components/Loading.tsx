import React from "react"

const Loading = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-96 text-gray-400 text-xl space-x-3">
      <span>Loading clients...</span>
      <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

export default Loading
