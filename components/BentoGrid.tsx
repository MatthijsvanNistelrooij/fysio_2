"use client"

import React, { useState } from "react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

type ItemType = {
  id: number
  text: string
}

const ItemTypes = {
  BOX: "box",
}

interface DraggableBoxProps {
  item: ItemType
  index: number
  onDrop: (from: number, to: number) => void
}

const DraggableBox: React.FC<DraggableBoxProps> = ({ item, index, onDrop }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const [, drop] = useDrop({
    accept: ItemTypes.BOX,
    drop(draggedItem: { index: number }) {
      if (draggedItem.index !== index) {
        onDrop(draggedItem.index, index)
      }
    },
  })

  const ref = React.useRef<HTMLDivElement>(null)
  drag(drop(ref))

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        padding: 20,
        backgroundColor: "#e0aaff",
        margin: 8,
        borderRadius: 8,
        textAlign: "center",
        userSelect: "none",
        transition: "transform 0.3s ease",
      }}
    >
      {item.text}
    </div>
  )
}


const BentoGrid: React.FC = () => {
  const [items, setItems] = useState<ItemType[]>([
    { id: 1, text: "🍱 Bento 1" },
    { id: 2, text: "🍙 Bento 2" },
    { id: 3, text: "🍣 Bento 3" },
    { id: 4, text: "🍛 Bento 4" },
    { id: 5, text: "🍜 Bento 5" },
    { id: 6, text: "🍤 Bento 6" },
  ])

  const handleDrop = (from: number, to: number) => {
    setItems((prev) => {
      const updated = [...prev]
      const [moved] = updated.splice(from, 1)
      updated.splice(to, 0, moved)
      return updated
    })
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          width: 360,
          margin: "20px auto",
        }}
      >
        {items.map((item, index) => (
          <DraggableBox
            key={item.id}
            item={item}
            index={index}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </DndProvider>
  )
}

export default BentoGrid
