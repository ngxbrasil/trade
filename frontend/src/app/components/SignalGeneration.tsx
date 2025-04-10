"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface SignalGenerationProps {
  isGenerating: boolean
  onComplete: () => void
  selectedAsset?: string
  selectedCategory?: "CRYPTO" | "FOREX" | "STOCKS" | ""
}

export default function SignalGeneration({
  isGenerating,
  onComplete,
  selectedAsset,
  selectedCategory,
}: SignalGenerationProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [assetIcon, setAssetIcon] = useState<string>("/placeholder.svg?height=24&width=24")

  // Buscar ícone do ativo
  useEffect(() => {
    if (selectedAsset && selectedCategory) {
      const formattedAsset = selectedAsset.replace("/", "")
      setAssetIcon(`/icons/${formattedAsset}.png`)
    }
  }, [selectedAsset, selectedCategory])

  // Passos do processo
  const steps = [
    "Analisando mercado...",
    "Processando indicadores...",
    "Aplicando algoritmos de IA...",
    "Validando resultados...",
    "Finalizando sinal...",
  ]

  // Reset e inicialização
  useEffect(() => {
    if (isGenerating) {
      setProgress(0)
      setCurrentStep(0)
    }
  }, [isGenerating])

  // Gerenciar progresso
  useEffect(() => {
    if (!isGenerating) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 0.9

        // Atualizar o passo atual baseado no progresso
        const newStep = Math.min(4, Math.floor((newProgress / 100) * steps.length))
        if (newStep !== currentStep) {
          setCurrentStep(newStep)
        }

        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            onComplete()
          }, 1500)
          return 100
        }
        return newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isGenerating, currentStep, steps.length, onComplete])

  if (!isGenerating) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <div className="w-full max-w-md p-6 mx-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Gerando Sinal</h2>
            <p className="text-sm text-slate-400">Processando dados de mercado</p>
          </div>

          {selectedAsset && (
            <div className="flex items-center gap-3 px-3 py-2 bg-slate-800 rounded-lg">
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src={assetIcon || "/placeholder.svg"}
                  alt={selectedAsset}
                  width={24}
                  height={24}
                  className="object-cover"
                  onError={() => setAssetIcon("/placeholder.svg?height=24&width=24")}
                />
              </div>
              <div>
                <div className="text-sm font-medium text-white">{selectedAsset}</div>
                <div className="text-xs text-slate-400">{selectedCategory}</div>
              </div>
            </div>
          )}
        </div>

        {/* Barra de progresso principal */}
        <div className="mb-8">
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeInOut" }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-slate-400">Progresso</span>
            <span className="text-xs font-medium text-emerald-400">{Math.floor(progress)}%</span>
          </div>
        </div>

        {/* Passos do processo */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  index < currentStep
                    ? "bg-emerald-500 text-white"
                    : index === currentStep
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800 text-slate-500"
                }`}
              >
                {index < currentStep ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>

              <div className="flex-1">
                <div
                  className={`text-sm ${
                    index < currentStep
                      ? "text-slate-300 line-through"
                      : index === currentStep
                        ? "text-white font-medium"
                        : "text-slate-500"
                  }`}
                >
                  {step}
                </div>

                {index === currentStep && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: 2,
                      ease: "easeInOut",
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="h-0.5 bg-gradient-to-r from-emerald-500 to-transparent mt-1 rounded-full"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mensagem de status */}
        <div className="mt-8 text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-slate-400"
            >
              {progress < 100 ? `${steps[currentStep]}` : "Sinal gerado com sucesso!"}
            </motion.p>
          </AnimatePresence>

          {progress >= 100 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="mt-4 inline-flex items-center justify-center w-10 h-10 bg-emerald-500 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
