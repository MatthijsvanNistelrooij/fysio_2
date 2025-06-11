import Image from "next/image"
import React, { useRef, useState } from "react"
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas"
import horse from "../public/horse_1.png"
import { Button } from "./ui/button"
import { ArrowLeft, Check, Eraser, Pencil } from "lucide-react"
import { toast } from "sonner"

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

      // Use the natural size of your canvas/image here
      const width = 450
      const height = 400

      // Generate a snapshot image by combining background + strokes
      const snapshot = await generateSnapshot({
        backgroundSrc: horse.src, // Access src of imported Next.js image
        paths,
        width,
        height,
      })

      // Pass the merged snapshot along with raw JSON paths
      onSave({
        imageDataUrl: snapshot,
        drawingJson: paths,
      })

      console.log("SUCCESS")
      toast.success("Canvas saved!")
    } catch (err) {
      console.error("Failed to export drawing:", err)
    }
  }

  const [color, setColor] = useState("green")

  const handleSelectColor = (color: string) => {
    setColor(color)
  }

  const handleClear = () => canvasRef.current?.clearCanvas()

  const handleUndo = () => canvasRef.current?.undo()

  const generateSnapshot = async ({
    backgroundSrc,
    paths,
    width,
    height,
  }: {
    backgroundSrc: string
    paths: StrokeGroup[]
    width: number
    height: number
  }): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      if (!ctx) return reject("Could not get canvas context")

      const background = new window.Image()
      background.crossOrigin = "anonymous"
      background.src = backgroundSrc
      background.crossOrigin = "anonymous"
      background.src = backgroundSrc

      background.onload = () => {
        // Draw background
        ctx.drawImage(background, 0, 0, width, height)

        // Draw strokes
        paths.forEach((group) => {
          ctx.strokeStyle = group.strokeColor
          ctx.lineWidth = group.strokeWidth
          ctx.lineJoin = "round"
          ctx.lineCap = "round"
          ctx.beginPath()
          group.paths.forEach((point, index) => {
            if (index === 0) {
              ctx.moveTo(point.x, point.y)
            } else {
              ctx.lineTo(point.x, point.y)
            }
          })
          ctx.stroke()
        })

        // Export
        const dataURL = canvas.toDataURL("image/png")
        resolve(dataURL)
      }

      background.onerror = () => reject("Failed to load background image")
    })
  }

  return (
    <div className="flex flex-col  w-full mx-auto max-h-[600px] h-full gap-4">
      <div
        style={{
          position: "relative",
          width: 460,
          height: 400,
          overflow: "hidden",
        }}
      >
        <Image
          src={horse}
          alt={`${petType} outline`}
          width={800}
          height={600}
          className="absolute inset-0 object-contain opacity-100 pointer-events-none"
        />
        <ReactSketchCanvas
          ref={canvasRef}
          strokeWidth={1.5}
          strokeColor={color}
          canvasColor="transparent"
          allowOnlyPointerType="all"
          style={{
            position: "absolute",
            inset: 1,
            cursor: "crosshair",
          }}
        />
      </div>

      <div className="flex">
        <div className="flex w-full gap-2 justify-between">
          <div />
          <div className="flex gap-2">
            <Button
              onClick={handleUndo}
              className="text-gray-800 bg-white hover:bg-gray-100 border cursor-pointer"
            >
              <ArrowLeft />
            </Button>
            <Button
              onClick={handleClear}
              className="text-gray-800 bg-white hover:bg-gray-100 border cursor-pointer"
            >
              <Eraser />
            </Button>

            <Button
              onClick={() => handleSelectColor("orange")}
              className="text-orange-800 bg-white hover:bg-gray-100 border cursor-pointer"
            >
              <Pencil />
            </Button>
            <Button
              onClick={() => handleSelectColor("limegreen")}
              className="text-green-800 bg-white hover:bg-gray-100 border cursor-pointer"
            >
              <Pencil />
            </Button>
            <Button
              onClick={() => handleSelectColor("blue")}
              className="text-blue-800 bg-white hover:bg-gray-100 border cursor-pointer"
            >
              <Pencil />
            </Button>
          </div>
          <div>
            <Button
              onClick={handleExport}
              className="text-gray-800 bg-white hover:bg-gray-100 border cursor-pointer ml-10"
            >
              <Check />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
