import React from "react"
import ShadowCard from "./ShadowCard"

const PetShadow = () => {
  return (
    <div className="flex flex-col">
      <ShadowCard>
        <div className="h-[37vh]"></div>
      </ShadowCard>
      <div className="mt-2 flex gap-2">
        <ShadowCard />
        <ShadowCard />
        <ShadowCard />
        <ShadowCard />
        <ShadowCard />
      </div>
    </div>
  )
}

export default PetShadow
