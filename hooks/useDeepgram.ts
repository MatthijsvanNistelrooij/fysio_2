// useDeepgram.ts (custom hook)
import { useRef, useState } from "react"

export const useDeepgram = (apiKey: string) => {
  const [transcript, setTranscript] = useState<string>("")
  const socketRef = useRef<WebSocket | null>(null)

  const startListening = async () => {
    // Vraag om microfoon toegang
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    const socket = new WebSocket(
      `wss://api.deepgram.com/v1/listen?punctuate=true&language=nl`,
      ["token", apiKey]
    )

    socket.onopen = () => {
      console.log("WebSocket open")
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const processor = audioContext.createScriptProcessor(4096, 1, 1)

      source.connect(processor)
      processor.connect(audioContext.destination)

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0)
        const int16Data = convertFloat32ToInt16(inputData)
        socket.send(int16Data)
      }
    }

    socket.onmessage = (message) => {
      const data = JSON.parse(message.data)
      const transcriptText = data.channel?.alternatives[0]?.transcript
      if (transcriptText) setTranscript(transcriptText)
    }

    socketRef.current = socket
  }

  const stopListening = () => {
    if (socketRef.current) {
      socketRef.current.close()
      socketRef.current = null
    }
  }

  return { transcript, startListening, stopListening }
}

// helper
function convertFloat32ToInt16(buffer: Float32Array) {
  let l = buffer.length
  const buf = new Int16Array(l)
  while (l--) {
    buf[l] = Math.min(1, buffer[l]) * 0x7fff
  }
  return buf
}
