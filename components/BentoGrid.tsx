import React, { useState } from "react"
import { useDrag, useDrop, DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import horse1 from "/public/horse_1.png"
import horse2 from "/public/horse_2.png"
import horse3 from "/public/horse_3.png"
import horse4 from "/public/horse_4.png"
import horse5 from "/public/horse_5.png"
import horse6 from "/public/horse_6.png"
import Image, { StaticImageData } from "next/image"

const ItemTypes = {
  BOX: "box",
}

interface BoxData {
  id: number
  color: string
  type: string
  img: StaticImageData
}

interface DraggableBoxProps {
  box: BoxData
  index: number
  onDropToDropZone: (boxIndex: number) => void
  isInDropZone: boolean
}

const DraggableBox: React.FC<DraggableBoxProps> = ({
  box,
  index,
  isInDropZone,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const ref = React.useRef<HTMLDivElement>(null)
  drag(drag(ref))

  return (
    <div
      ref={ref}
      style={{
        width: 40,
        height: 40,
        backgroundColor: box.color,
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        margin: "0 10px",
        border: isInDropZone ? "3px solid black" : undefined,
      }}
    >
      <Image src={box.img || ""} alt="horse" width={40} height={40} />
    </div>
  )
}

const DropZone: React.FC<{
  onDrop: (boxIndex: number) => void
  boxInZone: BoxData | null
}> = ({ onDrop, boxInZone }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.BOX,
    drop: (item: { index: number }) => onDrop(item.index),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  const isActive = isOver && canDrop

  const ref = React.useRef<HTMLDivElement>(null)
  drop(drop(ref))

  return (
    <div

      ref={ref}
      style={{
        // width: 100,
        // height: 100,
        border: isActive ? "3px dashed gray" : "1px dashed lightgray",
        backgroundColor: isActive ? "lightgreen" : "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
        position: "relative",
      }}
    >
      {isActive ? "Release to drop" : "Drop zone"}

      {boxInZone && (
        <div
          style={{
            // width: 420,
            // height: 420,
            backgroundColor: boxInZone.color,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // position: "absolute",
            // top: "50%",
            // left: "50%",
            // transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            userSelect: "none",
            border: "3px solid black",
          }}
        >
          <Image src={boxInZone.img || ""} alt="horse" width={200} height={200} />
        </div>
      )}
    </div>
  )
}

export default function BentoGrid() {
  const [boxes, setBoxes] = useState<BoxData[]>([
    { id: 1, color: "purple", type: "massage", img: horse1 },
    { id: 2, color: "orange", type: "hydrotherapy", img: horse2 },
    { id: 3, color: "teal", type: "chiropractic care", img: horse3 },
    { id: 4, color: "crimson", type: "laser therapy", img: horse4 },
    { id: 5, color: "black", type: "shockwave therapy", img: horse5 },
    { id: 6, color: "black", type: "shockwave therapy", img: horse6 },
  ])

  const [dropZoneBoxIndex, setDropZoneBoxIndex] = useState<number | null>(null)

  const handleDrop = (draggedBoxIndex: number) => {
    if (dropZoneBoxIndex === null) {
      setDropZoneBoxIndex(draggedBoxIndex)
    } else if (draggedBoxIndex !== dropZoneBoxIndex) {
      setBoxes((prevBoxes) => {
        const newBoxes = [...prevBoxes]
        ;[newBoxes[draggedBoxIndex], newBoxes[dropZoneBoxIndex]] = [
          newBoxes[dropZoneBoxIndex],
          newBoxes[draggedBoxIndex],
        ]
        return newBoxes
      })
      setDropZoneBoxIndex(draggedBoxIndex)
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          display: "flex",

          justifyContent: "center",
          marginTop: 40,
          userSelect: "none",
        }}
      >
        {boxes.map((box, i) =>
          i === dropZoneBoxIndex ? null : (
            <DraggableBox
              key={box.id}
              box={box}
              index={i}
              onDropToDropZone={handleDrop}
              isInDropZone={false}
            />
          )
        )}
      </div>

      <DropZone
        boxInZone={dropZoneBoxIndex !== null ? boxes[dropZoneBoxIndex] : null}
        onDrop={handleDrop}
      />
    </DndProvider>
  )
}
