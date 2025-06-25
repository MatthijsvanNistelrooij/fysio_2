import Image from "next/image"
import React, { useRef, useState } from "react"
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas"
import horse from "../public/horse_1.png"
import cat from "../public/cat.jpg"
import dog from "../public/dog.jpg"

import { Button } from "./ui/button"
import { ArrowLeft, Check, Eraser, Pencil } from "lucide-react"
import { toast } from "sonner"
import { darkmodeAtom } from "@/lib/store"
import { useAtom } from "jotai"

type PetType = "Dog" | "Horse" | "Cat" | "Other"

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

  const getPetImage = (type: PetType) => {
    switch (type) {
      case "Dog":
        return dog
      case "Horse":
        return horse
      case "Cat":
        return cat
      default:
        return horse // fallback or a default silhouette
    }
  }

  const petImage = getPetImage(petType)

  const handleExport = async () => {
    if (!canvasRef.current) return

    try {
      const paths = await canvasRef.current.exportPaths()

      // Use the natural size of your canvas/image here
      const width = 550
      const height = 350
      const petImage = getPetImage(petType)
      // Generate a snapshot image by combining background + strokes
      const snapshot = await generateSnapshot({
        backgroundSrc: petImage.src, // Access src of imported Next.js image
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

  const [darkmode] = useAtom(darkmodeAtom)

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
    <div className="flex flex-col">
      <div
        style={{
          position: "relative",
          height: 400,
          overflow: "hidden",
        }}
      >
        <Image
          src={petImage}
          alt={`${petType} outline`}
          width={800}
          height={600}
          className="absolute inset-0 object-contain opacity-100 pointer-events-none"
        />
        <div className="flex">
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
      </div>

      <div className="flex">
        <div className="flex w-full gap-2 justify-between">
          <div />
          <div className="flex gap-2">
            <Button
              onClick={handleUndo}
              className={` ${
                darkmode
                  ? "bg-white hover:bg-gray-100 text-gray-800 border-gray-200"
                  : "bg-gray-600 text-gray-200 hover:bg-gray-700"
              }  cursor-pointer border`}
            >
              <ArrowLeft />
            </Button>
            <Button
              onClick={handleClear}
              className={` ${
                darkmode
                  ? "bg-white hover:bg-gray-100 text-gray-800 border-gray-200"
                  : "bg-gray-600 text-gray-200 hover:bg-gray-700"
              }  cursor-pointer border`}
            >
              <Eraser />
            </Button>

            <Button
              onClick={() => handleSelectColor("orange")}
              className={` ${
                darkmode
                  ? "bg-white hover:bg-gray-100 text-orange-800 border-gray-200"
                  : "bg-gray-600 text-orange-200 hover:bg-gray-700"
              }  cursor-pointer border`}
            >
              <Pencil />
            </Button>
            <Button
              onClick={() => handleSelectColor("limegreen")}
              className={` ${
                darkmode
                  ? "bg-white hover:bg-gray-100 text-green-800 border-gray-200"
                  : "bg-gray-600 text-green-200 hover:bg-gray-700"
              }  cursor-pointer border`}
            >
              <Pencil />
            </Button>
            <Button
              onClick={() => handleSelectColor("blue")}
              className={` ${
                darkmode
                  ? "bg-white hover:bg-gray-100 text-blue-800 border-gray-200"
                  : "bg-gray-600 text-blue-200 hover:bg-gray-700"
              }  cursor-pointer border`}
            >
              <Pencil />
            </Button>
          </div>
          <div>
            <Button
              onClick={handleExport}
              className={` ${
                darkmode
                  ? "bg-white hover:bg-green-50 text-green-800"
                  : "bg-gray-600 hover:bg-gray-700 text-green-200"
              }  cursor-pointer p-5 `}
            >
              <Check />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
