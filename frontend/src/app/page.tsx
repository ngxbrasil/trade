"use client"

import type React from "react"

import { useState, useEffect, useRef, type ReactNode, type CSSProperties } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import SignalGeneration from "./components/SignalGeneration"
import ClientOnly from "./components/ClientOnly"

// Tipos de ativos disponíveis
const ASSET_TYPES = {
  CRYPTO: [
    { label: "BTC/USD", value: "BTCUSD", icon: "/icons/BTCUSD.png" },
    { label: "ETH/USD", value: "ETHUSD", icon: "/icons/ETHUSD.png" },
  ],
  FOREX: [
    { label: "EUR/USD", value: "EURUSD", icon: "/icons/EURUSD.png" },
    { label: "GBP/USD", value: "GBPUSD", icon: "/icons/GBPUSD.png" },
    { label: "USD/JPY", value: "USDJPY", icon: "/icons/USDJPY.png" },
    { label: "AUD/USD", value: "AUDUSD", icon: "/icons/AUDUSD.png" },
    { label: "USD/CAD", value: "USDCAD", icon: "/icons/USDCAD.png" },
    { label: "NZD/USD", value: "NZDUSD", icon: "/icons/NZDUSD.png" },
    { label: "NZD/CHF", value: "NZDCHF", icon: "/icons/NZDCHF.png" },
    { label: "EUR/JPY", value: "EURJPY", icon: "/icons/EURJPY.png" },
    { label: "GBP/JPY", value: "GBPJPY", icon: "/icons/GBPJPY.png" },

  ],
}

interface UserData {
  id: string
  name: string
  email: string
  balance: {
    amount: number
    currency: string
  }
}

interface Signal {
  asset: string
  action: "COMPRAR" | "VENDER"
  timeframe: string
  validUntil: string
  confidence: number
  entryPoint: number
  stopLoss: number
  takeProfit: number
}

// Componente AssetCard
interface AssetCardProps {
  label: string
  value: string
  isSelected: boolean
  onClick: () => void
  type: "crypto" | "forex"
  icon?: string
}

function AssetCard({ label, value, isSelected, onClick, type, icon }: AssetCardProps) {
  const getTypeColor = () => {
    switch (type) {
      case "crypto":
        return {
          bg: isSelected ? "from-emerald-600/20 to-teal-600/20" : "",
          border: isSelected ? "border-emerald-500" : "border-slate-700 group-hover:border-slate-600",
          text: isSelected ? "text-emerald-400" : "text-slate-500",
          glow: "bg-emerald-500/20",
        }
      case "forex":
        return {
          bg: isSelected ? "from-violet-600/20 to-purple-600/20" : "",
          border: isSelected ? "border-violet-500" : "border-slate-700 group-hover:border-slate-600",
          text: isSelected ? "text-violet-400" : "text-slate-500",
          glow: "bg-violet-500/20",
        }
      default:
        return {
          bg: isSelected ? "from-emerald-600/20 to-teal-600/20" : "",
          border: isSelected ? "border-emerald-500" : "border-slate-700 group-hover:border-slate-600",
          text: isSelected ? "text-emerald-400" : "text-slate-500",
          glow: "bg-emerald-500/20",
        }
    }
  }

  const colors = getTypeColor()

  return (
    <motion.button
      onClick={onClick}
      className={`group relative overflow-hidden py-4 px-3 rounded-xl transition-all duration-300 ${
        isSelected ? `bg-gradient-to-br ${colors.bg}` : "bg-slate-800/50 hover:bg-slate-800/80"
      }`}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      aria-pressed={isSelected}
    >
      {/* Borda */}
      <span
        className={`absolute inset-0 rounded-xl ${
          isSelected
            ? `border-2 ${colors.border} shadow-md shadow-${type === "crypto" ? "emerald" : "violet"}-500/30`
            : "border border-slate-700 group-hover:border-slate-600"
        }`}
      ></span>

      {/* Indicador de seleção */}
      {isSelected && (
        <motion.span
          className={`absolute top-2 right-2 h-2 w-2 rounded-full ${
            type === "crypto" ? "bg-emerald-500" : "bg-violet-500"
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        />
      )}

      {/* Ícone do tipo de ativo */}
      <div className={`mb-2 text-xs font-medium uppercase tracking-wider ${colors.text}`}>
        {type === "crypto" ? "Crypto" : "Forex"}
      </div>

      {/* Conteúdo */}
      <div className="relative flex items-center justify-center flex-col">
        {icon && (
          <div className="mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center">
        <Image
                src={icon || "/placeholder.svg?height=24&width=24"}
                alt={label}
                width={24}
                height={24}
                className="rounded-full"
              />
            </div>
          </div>
        )}
        <p className={`text-sm font-semibold ${isSelected ? "text-white" : "text-slate-300 group-hover:text-white"}`}>
          {label}
        </p>
      </div>

      {/* Efeito de destaque quando selecionado */}
      {isSelected && (
        <motion.div
          className={`absolute -inset-1 blur-md ${colors.glow} z-0`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  )
}

// Componente GlowButton
interface GlowButtonProps {
  onClick: () => void
  disabled?: boolean
  children: ReactNode
  className?: string
  type?: "button" | "submit" | "reset"
  variant?: "primary" | "secondary" | "danger" | "success"
  size?: "sm" | "md" | "lg"
  icon?: ReactNode
}

function GlowButton({
  onClick,
  disabled = false,
  children,
  className = "",
  type = "button",
  variant = "primary",
  size = "md",
  icon,
}: GlowButtonProps) {
  const getGradient = () => {
    switch (variant) {
      case "primary":
        return "from-emerald-600 to-teal-600"
      case "secondary":
        return "from-slate-600 to-slate-700"
      case "danger":
        return "from-red-600 to-rose-600"
      case "success":
        return "from-emerald-600 to-teal-600"
      default:
        return "from-emerald-600 to-teal-600"
    }
  }

  const getSize = () => {
    switch (size) {
      case "sm":
        return "h-9 px-4 text-sm"
      case "md":
        return "h-12 px-6"
      case "lg":
        return "h-14 px-8 text-lg"
      default:
        return "h-12 px-6"
    }
  }

  return (
    <div className="relative group">
      {/* Camada de brilho/glow */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r ${getGradient()} rounded-lg blur-lg transition-all duration-300 group-hover:opacity-100 group-hover:-inset-1.5 group-hover:blur-xl ${
          disabled ? "opacity-30" : "opacity-70"
        }`}
      ></div>

      {/* Botão principal */}
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={onClick}
        disabled={disabled}
        type={type}
        className={`relative ${getSize()} py-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg text-white font-semibold transition-all shadow-md flex items-center justify-center gap-2 ${
          disabled ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg"
        } ${className}`}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </motion.button>
    </div>
  )
}

// Componente CircuitPattern
interface CircuitPatternProps {
  color?: "blue" | "green" | "purple" | "cyan" | "emerald" | "violet"
  density?: number
  className?: string
}

function CircuitPattern({ color = "emerald", density = 20, className = "" }: CircuitPatternProps) {
  const [lines, setLines] = useState<
    Array<{
      id: number
      position: string
      style: CSSProperties
    }>
  >([])

  useEffect(() => {
    // Gerar as linhas horizontais
    const horizontalLines = Array.from({ length: density }).map((_, i) => ({
      id: i,
      position: "horizontal",
      style: {
        top: `${i * (100 / density)}%`,
        left: 0,
        right: 0,
        height: "1px",
        opacity: Math.random() * 0.2 + 0.1,
        animation: `pulse ${(i % 3) + 2}s ease-in-out ${i * 0.1}s infinite alternate`,
      },
    }))

    // Gerar as linhas verticais
    const verticalLines = Array.from({ length: density }).map((_, i) => ({
      id: i + density,
      position: "vertical",
      style: {
        top: 0,
        bottom: 0,
        left: `${i * (100 / density)}%`,
        width: "1px",
        opacity: Math.random() * 0.2 + 0.1,
        animation: `pulse ${(i % 3) + 2}s ease-in-out ${i * 0.1}s infinite alternate`,
      },
    }))

    setLines([...horizontalLines, ...verticalLines])
  }, [density])

  // Mapear cor com base na propriedade
  const colorClass =
    color === "blue"
      ? "bg-blue-400"
      : color === "green"
        ? "bg-green-400"
        : color === "cyan"
          ? "bg-cyan-400"
          : color === "emerald"
            ? "bg-emerald-400"
            : color === "violet"
              ? "bg-violet-400"
              : "bg-purple-400"

  return (
    <div className={`absolute inset-0 overflow-hidden opacity-20 ${className}`}>
      {lines.map((line) => (
        <div key={line.id} className={`absolute ${colorClass}`} style={line.style} />
      ))}
    </div>
  )
}

// Componente BackgroundParticles
function BackgroundParticles() {
  const [particles, setParticles] = useState<
    Array<{
      id: number
      width: number
      height: number
      x: string
      y: string
      animY: string[]
      duration: number
      color: string
    }>
  >([])

  useEffect(() => {
    // Gerar partículas apenas no lado do cliente
    const colors = ["bg-emerald-500/10", "bg-teal-500/10", "bg-violet-500/10", "bg-blue-500/10"]
    const generatedParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      width: Math.random() * 6 + 2,
      height: Math.random() * 6 + 2,
      x: `${Math.random() * 100}vw`,
      y: `${Math.random() * 100}vh`,
      animY: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
      duration: Math.random() * 20 + 10,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))

    setParticles(generatedParticles)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${particle.color}`}
          style={{
            width: particle.width,
            height: particle.height,
            x: particle.x,
            y: particle.y,
          }}
          animate={{
            y: particle.animY,
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

// Componente Input
interface InputProps {
  id: string
  type: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  className?: string
  icon?: ReactNode
  label?: string
}

function Input({ id, type, value, onChange, placeholder, required = false, className = "", icon, label }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">{icon}</span>}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full bg-slate-900/70 border border-slate-700 rounded-lg ${
            icon ? "pl-10" : "pl-4"
          } pr-4 py-2.5 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${className}`}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

// Componente ModernDropdown
interface DropdownOption {
  label: string
  value: string
  icon?: string
  category: "CRYPTO" | "FOREX"
}

interface ModernDropdownProps {
  options: DropdownOption[]
  value: string
  onChange: (option: DropdownOption) => void
  placeholder?: string
  className?: string
}

function ModernDropdown({
  options,
  value,
  onChange,
  placeholder = "Selecione uma opção",
  className = "",
}: ModernDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState<"CRYPTO" | "FOREX" | "ALL">("ALL")
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Encontrar a opção selecionada
  const selectedOption = options.find((option) => option.value === value)

  // Filtrar opções com base na pesquisa e categoria
  const filteredOptions = options.filter((option) => {
    const matchesSearch = option.label.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "ALL" || option.category === activeCategory
    return matchesSearch && matchesCategory
  })

  // Agrupar opções por categoria
  const groupedOptions: Record<string, DropdownOption[]> = {}
  filteredOptions.forEach((option) => {
    if (!groupedOptions[option.category]) {
      groupedOptions[option.category] = []
    }
    groupedOptions[option.category].push(option)
  })

  // Obter cor com base na categoria
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "CRYPTO":
        return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
      case "FOREX":
        return "text-violet-400 border-violet-500/30 bg-violet-500/10"
      default:
        return "text-slate-400 border-slate-500/30 bg-slate-500/10"
    }
  }

  // Obter ícone com base na categoria
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "CRYPTO":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-emerald-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path
              fillRule="evenodd"
              d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
              clipRule="evenodd"
            />
          </svg>
        )
      case "FOREX":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-violet-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 2a8 8 0 100 16 8 8 0 000-16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
              clipRule="evenodd"
            />
          </svg>
        )
      default:
        return null
    }
  }

  // Adicionar este useEffect para controlar a rolagem
  useEffect(() => {
    if (isOpen) {
      // Adicionar um pequeno atraso para garantir que o dropdown seja renderizado primeiro
      setTimeout(() => {
        // Rolar para garantir que o dropdown seja visível
        if (dropdownRef.current) {
          const dropdownRect = dropdownRef.current.getBoundingClientRect()
          const dropdownBottom = dropdownRect.bottom + 300 // Adicionar margem extra
          const windowHeight = window.innerHeight

          if (dropdownBottom > windowHeight) {
            window.scrollBy({
              top: dropdownBottom - windowHeight,
              behavior: "smooth",
            })
          }
        }
      }, 100)
    }
  }, [isOpen])

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 bg-slate-800/80 border ${
          selectedOption ? "border-slate-600 hover:border-slate-500" : "border-slate-700 hover:border-slate-600"
        } rounded-lg text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          {selectedOption ? (
            <>
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center mr-3">
                <Image
                  src={selectedOption.icon || "/placeholder.svg?height=24&width=24"}
                  alt={selectedOption.label}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              </div>
              <div>
                <div className="text-xs text-slate-400 -mb-0.5">
                  {selectedOption.category === "CRYPTO"
                    ? "Criptomoeda"
                    : "Forex"}
                </div>
                <div className="font-medium">{selectedOption.label}</div>
              </div>
            </>
          ) : (
            <span className="text-slate-400">{placeholder}</span>
          )}
        </div>
        <div
          className={`w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-slate-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-700/80 overflow-hidden z-[9999]"
          style={{ width: "100%" }}
          role="listbox"
        >
          <div className="p-3">
            {/* Barra de pesquisa */}
            <div className="relative mb-3">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-slate-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Buscar ativo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtro de categorias */}
            <div className="flex space-x-2 mb-3 overflow-x-auto pb-2">
              <button
                type="button"
                onClick={() => setActiveCategory("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  activeCategory === "ALL"
                    ? "bg-slate-700 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700/70"
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("CRYPTO")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 whitespace-nowrap ${
                  activeCategory === "CRYPTO"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700/70"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path
                    fillRule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Crypto</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("FOREX")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 whitespace-nowrap ${
                  activeCategory === "FOREX"
                    ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700/70"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 2a8 8 0 100 16 8 8 0 000-16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Forex</span>
              </button>
            </div>

            {/* Lista de opções */}
            <div className="max-h-60 overflow-y-auto">
              {Object.keys(groupedOptions).length === 0 ? (
                <div className="py-4 px-3 text-center text-slate-400 text-sm">Nenhum resultado encontrado</div>
              ) : (
                Object.entries(groupedOptions).map(([category, options]) => (
                  <div key={category} className="mb-3">
                    <div
                      className={`text-xs font-medium px-2 py-1.5 mb-1.5 flex items-center space-x-1.5 border rounded-lg ${getCategoryColor(
                        category,
                      )}`}
                    >
                      {getCategoryIcon(category)}
                      <span>{category === "CRYPTO" ? "Criptomoedas" : "Forex"}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {options.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            onChange(option)
                            setIsOpen(false)
                            setSearchTerm("")
                          }}
                          className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg text-left ${
                            option.value === value
                              ? `bg-${
                                  option.category === "CRYPTO"
                                    ? "emerald"
                                    : "violet"
                                }-500/20 border border-${
                                  option.category === "CRYPTO"
                                    ? "emerald"
                                    : "violet"
                                }-500/30`
                              : "hover:bg-slate-700/50"
                          }`}
                          role="option"
                          aria-selected={option.value === value}
                        >
                          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
          <Image
                              src={option.icon || "/placeholder.svg?height=20&width=20"}
                              alt={option.label}
                              width={20}
                              height={20}
                              className="rounded-full"
                            />
                          </div>
                          <span
                            className={`text-sm truncate ${
                              option.value === value ? "font-medium text-white" : "text-slate-300"
                            }`}
                          >
                            {option.label}
                          </span>
                          {option.value === value && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-4 w-4 ml-auto text-${
                                option.category === "CRYPTO"
                                  ? "emerald"
                                  : "violet"
                              }-400 flex-shrink-0`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Adicionar uma div vazia para criar espaço extra para rolagem */}
          <div className="h-20"></div>
        </div>
      )}
    </div>
  )
}

// Componente para exibir o saldo do usuário
interface UserBalanceProps {
  userData: UserData
  onLogout: () => void
}

function UserBalance({ userData, onLogout }: UserBalanceProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="hidden sm:flex items-center space-x-3 px-4 py-2 bg-slate-800/80 rounded-lg border border-slate-700/80 shadow-inner">
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/30">
            <span className="font-semibold text-white">{userData.name.charAt(0)}</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-800 animate-pulse"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">{userData.name}</span>
          <span className="text-xs text-slate-400">
            {userData.balance.amount.toFixed(2)} {userData.balance.currency}
          </span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onLogout}
        className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all hover:shadow-xl hover:from-red-600 hover:to-red-800"
      >
        Sair
      </motion.button>
    </div>
  )
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Referência à Polarium Broker
  const polariumLoginUrl = "https://trade.polariumbroker.com/pt/login"
  const polariumRegisterUrl = "https://trade.polariumbroker.com/pt/register"

  // Estados para geração de sinais
  const [selectedAsset, setSelectedAsset] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<"CRYPTO" | "FOREX" | "">("")
  const [activeCategory, setActiveCategory] = useState<"CRYPTO" | "FOREX">("FOREX")
  const [isGeneratingSignal, setIsGeneratingSignal] = useState(false)
  const [generatedSignal, setGeneratedSignal] = useState<Signal | null>(null)

  // Verificar se o usuário já está autenticado no carregamento
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData")
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData)
        setUserData(parsedUserData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Erro ao analisar dados do usuário:", error)
        localStorage.removeItem("userData")
      }
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Demo: simulação de login
    try {
      // Validar formato do email
      if (!email.includes("@") || !email.includes(".")) {
        throw new Error("Email inválido. Por favor, insira um email válido.")
      }

      // Validar comprimento da senha
      if (password.length < 6) {
        throw new Error("Senha deve conter pelo menos 6 caracteres.")
      }

      // Simular chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simular sucesso
      setIsAuthenticated(true)
      setUserData({
        id: "usr_" + Math.random().toString(36).substring(2, 9),
        name: email.split("@")[0],
        email,
        balance: {
          amount: parseFloat((Math.random() * 5000 + 1000).toFixed(2)),
          currency: "USD",
        },
      })
      setShowLoginModal(false)
    } catch (err: any) {
      setError(err.message || "Falha ao fazer login. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("userData")
    setUserData(null)
    setIsAuthenticated(false)
    setGeneratedSignal(null)
  }

  const handleGenerateSignal = () => {
    if (!selectedAsset || selectedAsset.trim() === "") {
      return
    }

    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    setIsGeneratingSignal(true)
  }

  const handleSignalGenerationComplete = () => {
    // Usar um seed estável para gerar o valor
    const now = new Date()
    const seed = now.getHours() * 60 + now.getMinutes()
    const action = seed % 2 === 0 ? "COMPRAR" : ("VENDER" as "COMPRAR" | "VENDER")

    // Valores fictícios para demonstração
    const basePrice = 100 + Math.random() * 900
    const entryPoint = Number.parseFloat(basePrice.toFixed(2))
    const stopLoss =
      action === "COMPRAR"
        ? Number.parseFloat((entryPoint * 0.98).toFixed(2))
        : Number.parseFloat((entryPoint * 1.02).toFixed(2))
    const takeProfit =
      action === "COMPRAR"
        ? Number.parseFloat((entryPoint * 1.05).toFixed(2))
        : Number.parseFloat((entryPoint * 0.95).toFixed(2))

    // Calcular a validade (5 minutos no futuro)
    const validUntil = new Date(now.getTime() + 300000)

    setGeneratedSignal({
      asset: selectedAsset,
      action,
      timeframe: "M5",
      validUntil: validUntil.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      confidence: Math.floor(70 + Math.random() * 25),
      entryPoint,
      stopLoss,
      takeProfit,
    })

    setIsGeneratingSignal(false)
  }

  // Preparar opções para o dropdown
  const dropdownOptions: DropdownOption[] = [
    ...ASSET_TYPES.CRYPTO.map((asset) => ({
      label: asset.label,
      value: asset.value,
      icon: asset.icon,
      category: "CRYPTO" as const,
    })),
    ...ASSET_TYPES.FOREX.map((asset) => ({
      label: asset.label,
      value: asset.value,
      icon: asset.icon,
      category: "FOREX" as const,
    })),
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800/70 to-black overflow-hidden">
      <ClientOnly>
        <BackgroundParticles />
      </ClientOnly>

      {/* Animated gradient orbs in background */}
      <ClientOnly>
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
        </div>
      </ClientOnly>

      {/* Header com autenticação */}
      <header className="pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg p-1.5 shadow-lg shadow-emerald-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">Bot Broker</h1>
              <p className="text-xs text-slate-400">Exclusivo para Polarium Broker</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center">
            <div className="flex h-8 items-center rounded-md bg-slate-800 border border-slate-700 px-3 mr-4">
              <span className="text-xs font-medium text-slate-400 mr-2">Integrado com:</span>
              <a 
                href={polariumLoginUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">
                  Polarium
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </a>
            </div>
          </div>

          {isAuthenticated && userData ? (
            <UserBalance userData={userData} onLogout={handleLogout} />
          ) : (
            <GlowButton
              onClick={() => setShowLoginModal(true)}
              size="sm"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            >
              Entrar
            </GlowButton>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        {/* Interface de Geração de Sinais - Enhanced UI */}
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-visible bg-slate-800/30 rounded-2xl p-6 md:p-10 shadow-2xl backdrop-blur-md border border-slate-700/60"
          >
            {/* Enhanced lighting effects */}
            <div className="absolute -inset-[150px] bg-emerald-500/5 blur-3xl rounded-full -z-10"></div>
            <div className="absolute -bottom-[100px] -right-[100px] bg-violet-500/10 blur-3xl rounded-full -z-10 w-[300px] h-[300px]"></div>
            <div className="absolute top-1/3 left-0 w-full h-32 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 rotate-12 blur-3xl -z-10"></div>

            {/* Animated tech pattern in background */}
            <ClientOnly>
              <CircuitPattern color="emerald" density={20} />
            </ClientOnly>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-center mb-10 md:mb-14"
              >
                <div className="inline-block py-1 px-3 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-medium tracking-wide mb-4 border border-emerald-500/20">
                  TECNOLOGIA AVANÇADA DE IA
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-violet-500">
                    Gerador de Sinais Inteligente
                  </span>
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
                  Selecione um ativo financeiro e nosso sistema de IA avançada irá gerar sinais de trading precisos com
                  alta probabilidade de sucesso
                </p>
              </motion.div>

              {/* Seleção de ativos com dropdown - enhanced */}
              <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-700/60 shadow-xl backdrop-blur-sm max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold mb-6 text-white flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-600/20 mr-3 border border-emerald-500/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-emerald-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a8 8 0 100 16 8 8 0 000-16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  Selecione o Ativo
                </h3>

                {/* Componente de dropdown melhorado */}
                <div className="mb-10">
                  <ModernDropdown
                    options={dropdownOptions}
                    value={selectedAsset}
                    onChange={(option) => {
                      setSelectedAsset(option.label)
                      setSelectedCategory(option.category)
                    }}
                    placeholder="Escolha um ativo financeiro"
                    className="mb-6"
                  />
                  <p className="text-center text-slate-400 text-sm mt-4">
                    Selecione um ativo financeiro no menu acima para gerar um sinal de trading
                  </p>
                </div>

                {/* Botão de geração de sinal */}
                <div className="flex justify-center">
                  <GlowButton
                    onClick={handleGenerateSignal}
                    disabled={!selectedAsset || !isAuthenticated}
                    className="mt-8"
                    size="lg"
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                          clipRule="evenodd"
                        />
                      </svg>
                    }
                  >
                    Gerar Sinal Inteligente
                  </GlowButton>
                </div>

                {!isAuthenticated && (
                  <div className="mt-4 text-amber-400 text-sm flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Faça login para gerar sinais para Polarium Broker</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Componente de animação de geração do sinal */}
        <ClientOnly>
          <SignalGeneration
            isGenerating={isGeneratingSignal}
            onComplete={handleSignalGenerationComplete}
            selectedAsset={selectedAsset}
            selectedCategory={selectedCategory}
          />
        </ClientOnly>

        {/* Resultado do sinal gerado - enhanced */}
        <ClientOnly>
          <AnimatePresence>
            {generatedSignal && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="mt-12 max-w-5xl mx-auto"
              >
                <div className="bg-slate-800/30 rounded-2xl p-8 shadow-xl backdrop-blur-md border border-slate-700/60 relative overflow-hidden">
                  {/* Background effects */}
                  <div className="absolute -inset-[150px] bg-emerald-500/5 blur-3xl rounded-full -z-10"></div>
                  <div className="absolute -bottom-[100px] -right-[100px] bg-violet-500/10 blur-3xl rounded-full -z-10 w-[300px] h-[300px]"></div>

                  <div className="flex items-center justify-center gap-3 mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                      className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-emerald-400"
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
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400"
                    >
                      Oportunidade Identificada!
                    </motion.h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mb-8 max-w-2xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 rounded-xl p-6 border border-slate-700/50"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-2xl font-bold text-white">Sinal de Alta Precisão</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full ${
                                generatedSignal.confidence > 85
                                  ? "bg-emerald-500"
                                  : generatedSignal.confidence > 70
                                    ? "bg-emerald-400"
                                    : "bg-amber-400"
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${generatedSignal.confidence}%` }}
                              transition={{ delay: 0.6, duration: 0.8 }}
                            />
                          </div>
                          <span className="text-sm font-medium text-white">{generatedSignal.confidence}%</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                          <div className="text-sm text-slate-400 mb-1">Ativo</div>
                          <div className="text-xl font-semibold text-white">{generatedSignal.asset}</div>
                        </div>
                        
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                          <div className="text-sm text-slate-400 mb-1">Direção</div>
                          <div className={`text-xl font-semibold ${
                            generatedSignal.action === "COMPRAR" ? "text-emerald-400" : "text-rose-400"
                          }`}>
                            {generatedSignal.action}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                          <div className="text-sm text-slate-400 mb-1">Entrada</div>
                          <div className="text-xl font-semibold text-white">
                            {generatedSignal.entryPoint.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </div>
                        </div>

                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                          <div className="text-sm text-slate-400 mb-1">Validade</div>
                          <div className="text-xl font-semibold text-white flex items-center gap-2">
                            {generatedSignal.validUntil}
                            <span className="text-xs font-normal px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
                              Agir Agora!
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex justify-center"
                  >
                    <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-xl text-base text-white border border-emerald-500/20 max-w-2xl text-center shadow-lg">
                      <p className="mb-3 font-semibold text-lg text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                        Nossa IA detectou um ponto de entrada ideal!
                      </p>
                      <p className="mb-2">
                        Este sinal tem <span className="font-bold">{generatedSignal.confidence}% de confiança</span> com base em padrões de alta
                        probabilidade identificados pelo nosso algoritmo avançado.
                      </p>
                      <p className="text-emerald-300 font-medium mt-3">
                        Não perca esta oportunidade! Acesse já sua conta na Polarium Broker para executar esta operação.
                      </p>
                      
                      <div className="mt-4 flex justify-center gap-3">
                        <a 
                          href={polariumLoginUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg shadow-emerald-500/20 text-white"
                        >
                          Acessar Polarium Agora
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </ClientOnly>

        {/* Vídeo tutorial e informações da Polarium */}
        {generatedSignal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-12 max-w-5xl mx-auto"
          >
            <div className="border border-slate-700/50 rounded-xl p-6 bg-slate-800/30 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                <h3 className="text-xl font-semibold text-white">Como usar este sinal na Polarium Broker</h3>
              </div>
              
              <div className="aspect-video mb-4 bg-slate-900/80 rounded-lg border border-slate-700/50 flex items-center justify-center">
                <div className="text-center p-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-600 mb-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <p className="text-slate-400 mb-3">Vídeo tutorial de como aplicar sinais na Polarium Broker</p>
                  <button 
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-sm font-medium transition-colors"
                  >
                    Assistir Tutorial
                  </button>
                </div>
              </div>
              
              <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/20">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm text-slate-300">Este sinal foi gerado para uso exclusivo na plataforma <strong>Polarium Broker</strong>. Para utilizar este sinal, acesse sua conta e utilize os valores de entrada, stop loss e take profit nas configurações da sua ordem.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a 
                        href={polariumLoginUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-md text-xs font-medium border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors"
                      >
                        Acessar Plataforma Polarium
                      </a>
                      <a 
                        href={polariumRegisterUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-md text-xs font-medium border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                      >
                        Criar Conta Polarium
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 mt-10">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Bot Broker | Plataforma avançada de sinais de trading com IA</p>
        </div>
      </footer>

      {/* Animação de Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-md rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/50 shadow-xl"
            >
              {/* Cabeçalho do login */}
              <div className="p-6 pb-0">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-white">Entre para continuar</h3>
                  <button
                    onClick={() => setShowLoginModal(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-slate-400 text-sm mb-6">
                  Acesse para gerar sinais inteligentes exclusivos para Polarium Broker
                </p>
              </div>

              {/* Informações da Polarium */}
              <div className="px-6">
                <div className="p-4 rounded-lg bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 mb-5">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Polarium Broker</h4>
                      <p className="text-xs text-slate-400">Plataforma integrada para sinais</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <a 
                      href={polariumRegisterUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 bg-gradient-to-br from-cyan-500 to-emerald-500 text-center rounded-md text-white text-sm font-medium"
                    >
                      Criar Conta
                    </a>
                    <a 
                      href={polariumLoginUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 bg-slate-700 text-center rounded-md text-white text-sm font-medium"
                    >
                      Acessar Plataforma
                    </a>
                  </div>
                </div>
              </div>

              {/* Mensagem de erro */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-6 mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                >
                  <div className="flex items-center text-red-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleLogin} className="p-6 pt-0 space-y-5">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  label="Email"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  }
                />

                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  label="Senha"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />

                <div className="flex justify-end pt-2">
                  <GlowButton onClick={() => {}} disabled={loading} type="submit">
                    {loading ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Entrando...
                      </div>
                    ) : (
                      "Entrar"
                    )}
                  </GlowButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
