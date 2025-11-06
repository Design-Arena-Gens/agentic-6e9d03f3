'use client'

import { useState, useEffect, useCallback } from 'react'
import { SparseNetwork } from './components/SparseNetwork'
import { SparseLLM } from './lib/sparseLLM'

export default function Home() {
  const [llm] = useState(() => new SparseLLM(512, 2048, 512, 0.1))
  const [input, setInput] = useState('')
  const [activeNeurons, setActiveNeurons] = useState<Set<string>>(new Set())
  const [output, setOutput] = useState<number[]>([])
  const [stats, setStats] = useState({ total: 0, active: 0, sparsity: 0 })
  const [isProcessing, setIsProcessing] = useState(false)

  const processInput = useCallback(async (text: string) => {
    if (!text.trim()) {
      setActiveNeurons(new Set())
      setOutput([])
      setStats({ total: 0, active: 0, sparsity: 0 })
      return
    }

    setIsProcessing(true)

    // Simulate async processing
    await new Promise(resolve => setTimeout(resolve, 100))

    const result = llm.forward(text)
    setActiveNeurons(result.activeNeurons)
    setOutput(result.output)
    setStats({
      total: result.totalNeurons,
      active: result.activeNeurons.size,
      sparsity: ((1 - result.activeNeurons.size / result.totalNeurons) * 100)
    })

    setIsProcessing(false)
  }, [llm])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setInput(value)
    processInput(value)
  }

  const examples = [
    "Tell me about machine learning",
    "What is quantum computing?",
    "Explain neural networks",
    "How does attention work?"
  ]

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%)',
      color: '#ffffff',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '3rem',
            margin: '0 0 10px 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            Sparse LLM Architecture
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#a0aec0',
            margin: 0
          }}>
            Selective Neuron Activation - Only Fire What You Need
          </p>
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '30px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginTop: 0,
              marginBottom: '20px',
              color: '#667eea'
            }}>
              Input Text
            </h2>
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Type or select an example prompt..."
              style={{
                width: '100%',
                height: '120px',
                padding: '15px',
                fontSize: '1rem',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#ffffff',
                resize: 'vertical',
                fontFamily: 'inherit',
                marginBottom: '15px'
              }}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {examples.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(example)
                    processInput(example)
                  }}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(102, 126, 234, 0.2)',
                    border: '1px solid rgba(102, 126, 234, 0.4)',
                    borderRadius: '6px',
                    color: '#667eea',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(102, 126, 234, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)'
                  }}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '30px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginTop: 0,
              marginBottom: '20px',
              color: '#667eea'
            }}>
              Activation Statistics
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#a0aec0',
                  marginBottom: '8px'
                }}>
                  Total Neurons
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {stats.total.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#a0aec0',
                  marginBottom: '8px'
                }}>
                  Active Neurons
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#48bb78'
                }}>
                  {stats.active.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#a0aec0',
                  marginBottom: '8px'
                }}>
                  Sparsity Level
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#667eea'
                }}>
                  {stats.sparsity.toFixed(1)}%
                </div>
                <div style={{
                  marginTop: '10px',
                  height: '8px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${stats.sparsity}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '30px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '30px'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            marginTop: 0,
            marginBottom: '20px',
            color: '#667eea'
          }}>
            Network Visualization
          </h2>
          <SparseNetwork
            activeNeurons={activeNeurons}
            isProcessing={isProcessing}
          />
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '30px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            marginTop: 0,
            marginBottom: '20px',
            color: '#667eea'
          }}>
            Architecture Details
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            color: '#cbd5e0',
            lineHeight: '1.8'
          }}>
            <div>
              <h3 style={{ color: '#667eea', fontSize: '1.1rem', marginBottom: '10px' }}>
                Sparse Activation
              </h3>
              <p style={{ margin: 0 }}>
                Neurons activate based on input relevance using learned routing scores and top-k selection.
              </p>
            </div>
            <div>
              <h3 style={{ color: '#667eea', fontSize: '1.1rem', marginBottom: '10px' }}>
                Mixture of Experts
              </h3>
              <p style={{ margin: 0 }}>
                Expert neurons specialize in different patterns, with dynamic expert selection per token.
              </p>
            </div>
            <div>
              <h3 style={{ color: '#667eea', fontSize: '1.1rem', marginBottom: '10px' }}>
                Energy Efficient
              </h3>
              <p style={{ margin: 0 }}>
                Only 10-30% of neurons fire for any input, reducing computation by 70-90%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
