'use client'

import { useEffect, useRef } from 'react'

interface SparseNetworkProps {
  activeNeurons: Set<string>
  isProcessing: boolean
}

export function SparseNetwork({ activeNeurons, isProcessing }: SparseNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const layers = [
      { name: 'Input', neurons: 16, x: 0.1 },
      { name: 'Hidden 1', neurons: 32, x: 0.3 },
      { name: 'Hidden 2', neurons: 32, x: 0.5 },
      { name: 'Hidden 3', neurons: 32, x: 0.7 },
      { name: 'Output', neurons: 16, x: 0.9 }
    ]

    const neuronPositions: Array<{ x: number, y: number, layer: number, index: number, id: string }> = []

    layers.forEach((layer, layerIdx) => {
      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio
      const x = layer.x * width
      const spacing = height / (layer.neurons + 1)

      for (let i = 0; i < layer.neurons; i++) {
        neuronPositions.push({
          x,
          y: spacing * (i + 1),
          layer: layerIdx,
          index: i,
          id: `${layerIdx}-${i}`
        })
      }
    })

    let pulsePhase = 0

    const animate = () => {
      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio

      ctx.clearRect(0, 0, width, height)

      // Draw connections
      ctx.strokeStyle = 'rgba(102, 126, 234, 0.1)'
      ctx.lineWidth = 1

      for (let i = 0; i < neuronPositions.length; i++) {
        const neuron = neuronPositions[i]
        if (neuron.layer < layers.length - 1) {
          const nextLayerNeurons = neuronPositions.filter(n => n.layer === neuron.layer + 1)

          // Only connect to a subset to reduce clutter
          const connections = Math.min(8, nextLayerNeurons.length)
          for (let j = 0; j < connections; j++) {
            const targetIdx = Math.floor(j * nextLayerNeurons.length / connections)
            const target = nextLayerNeurons[targetIdx]

            const isActive = activeNeurons.has(neuron.id) && activeNeurons.has(target.id)

            if (isActive) {
              ctx.strokeStyle = `rgba(102, 126, 234, ${0.4 + Math.sin(pulsePhase) * 0.2})`
              ctx.lineWidth = 2
            } else {
              ctx.strokeStyle = 'rgba(102, 126, 234, 0.05)'
              ctx.lineWidth = 1
            }

            ctx.beginPath()
            ctx.moveTo(neuron.x, neuron.y)
            ctx.lineTo(target.x, target.y)
            ctx.stroke()
          }
        }
      }

      // Draw neurons
      neuronPositions.forEach(neuron => {
        const isActive = activeNeurons.has(neuron.id)
        const radius = isActive ? 6 : 4

        ctx.beginPath()
        ctx.arc(neuron.x, neuron.y, radius, 0, Math.PI * 2)

        if (isActive) {
          const pulse = 0.5 + Math.sin(pulsePhase + neuron.index * 0.1) * 0.3
          ctx.fillStyle = `rgba(102, 126, 234, ${pulse})`
          ctx.fill()

          // Glow effect
          ctx.shadowBlur = 15
          ctx.shadowColor = '#667eea'
          ctx.fillStyle = '#667eea'
          ctx.fill()
          ctx.shadowBlur = 0
        } else {
          ctx.fillStyle = 'rgba(160, 174, 192, 0.3)'
          ctx.fill()
        }

        ctx.strokeStyle = isActive ? '#764ba2' : 'rgba(160, 174, 192, 0.2)'
        ctx.lineWidth = isActive ? 2 : 1
        ctx.stroke()
      })

      // Draw layer labels
      ctx.font = '14px system-ui'
      ctx.fillStyle = '#a0aec0'
      ctx.textAlign = 'center'

      layers.forEach(layer => {
        const x = layer.x * width
        ctx.fillText(layer.name, x, 30)

        const activeCount = neuronPositions.filter(
          n => n.layer === layers.indexOf(layer) && activeNeurons.has(n.id)
        ).length

        if (activeCount > 0) {
          ctx.fillStyle = '#48bb78'
          ctx.fillText(`${activeCount}/${layer.neurons}`, x, height - 20)
          ctx.fillStyle = '#a0aec0'
        }
      })

      pulsePhase += 0.05
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [activeNeurons])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '500px',
        borderRadius: '8px',
        background: 'rgba(0, 0, 0, 0.2)'
      }}
    />
  )
}
