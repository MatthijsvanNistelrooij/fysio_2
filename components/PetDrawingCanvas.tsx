import Image from "next/image"
import React, { useRef } from "react"
import {
  ReactSketchCanvas,
  ReactSketchCanvasRef,
  ExportImageType,
} from "react-sketch-canvas"
import horse from "../public/horse.jpg"
import { Button } from "./ui/button"
import { Check, Eraser, Recycle } from "lucide-react"

type PetType = "dog" | "horse" | "cat" | "other"

type StrokePoint = { x: number; y: number }
type StrokeGroup = {
  paths: StrokePoint[]
  strokeWidth: number
  strokeColor: string
}

interface PetDrawingCanvasProps {
  petType: PetType
  onSave: (data: { imageDataUrl: string; drawingJson: StrokeGroup[] }) => void
}

export const PetDrawingCanvas: React.FC<PetDrawingCanvasProps> = ({
  petType,
  onSave,
}) => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null)

  const handleExport = async () => {
    if (!canvasRef.current) return

    try {
      const paths = await canvasRef.current.exportPaths()
      const image = await canvasRef.current.exportImage(
        "png" as ExportImageType
      )

      onSave({
        imageDataUrl: image,
        drawingJson: paths,
      })
    } catch (err) {
      console.error("Failed to export drawing:", err)
    }
  }

  const handleClear = () => canvasRef.current?.clearCanvas()
  const handleUndo = () => canvasRef.current?.undo()

  return (
    <div className="flex flex-col w-full mx-auto max-h-[600px] h-full gap-4">
      <div className="relative w-full aspect-video max-h-[500px] rounded overflow-hidden">
        <Image
          height={800}
          width={800}
          src={horse}
          alt={`${petType} outline`}
          className="absolute inset-0 w-full h-full object-contain opacity-70 pointer-events-none"
        />

        <ReactSketchCanvas
          ref={canvasRef}
          strokeWidth={2}
          strokeColor="limegreen"
          canvasColor="transparent"
          allowOnlyPointerType="all"
          style={{
            position: "absolute",
            inset: 0,
            border: "none",
            cursor: "crosshair",
          }}
        />
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            onClick={handleUndo}
            className="text-gray-800 bg-white hover:bg-gray-100 border cursor-pointer"
          >
            <Recycle />
          </Button>
          <Button
            onClick={handleClear}
            className="text-gray-800 bg-white hover:bg-gray-100 border cursor-pointer"
          >
            <Eraser />
          </Button>
        </div>

        <Button
          onClick={handleExport}
          className="text-gray-800 bg-white hover:bg-gray-100 border cursor-pointer"
        >
          <Check />
        </Button>
      </div>
    </div>
  )
}
