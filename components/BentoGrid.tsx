import React, { useState } from "react"
import { useDrag, useDrop, DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

const ItemTypes = {
  BOX: "box",
}

interface BoxData {
  id: number
  color: string
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
      {box.id}
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
        width: 100,
        height: 100,
        border: "3px dashed gray",
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
            width: 80,
            height: 80,
            backgroundColor: boxInZone.color,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            userSelect: "none",
            border: "3px solid black",
          }}
        >
          {boxInZone.id}
        </div>
      )}
    </div>
  )
}

export default function BentoGrid() {
  // Initial boxes
  const [boxes, setBoxes] = useState<BoxData[]>([
    { id: 1, color: "purple" },
    { id: 2, color: "orange" },
    { id: 3, color: "teal" },
    { id: 4, color: "crimson" },
  ])

  // Box currently in the drop zone (null means empty)
  const [dropZoneBoxIndex, setDropZoneBoxIndex] = useState<number | null>(null)

  // Handle drop on drop zone: swap boxes
  const handleDrop = (draggedBoxIndex: number) => {
    if (dropZoneBoxIndex === null) {
      // Drop zone empty: move dragged box to drop zone, remove from row
      setDropZoneBoxIndex(draggedBoxIndex)
    } else if (draggedBoxIndex !== dropZoneBoxIndex) {
      // Swap positions between dragged box and box in drop zone
      setBoxes((prevBoxes) => {
        const newBoxes = [...prevBoxes]
        ;[newBoxes[draggedBoxIndex], newBoxes[dropZoneBoxIndex]] = [
          newBoxes[dropZoneBoxIndex],
          newBoxes[draggedBoxIndex],
        ]
        return newBoxes
      })
      // Drop zone box index now becomes draggedBoxIndex (box swapped)
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
        {/* Render boxes, excluding the one currently in drop zone */}
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
