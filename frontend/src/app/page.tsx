"use client"

import type React from "react"

import { useState, useEffect, useRef, type ReactNode, type CSSProperties } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import SignalGeneration from "./components/SignalGeneration"
import ClientOnly from "./components/ClientOnly"

// Tipos de ativos disponíveis
const ASSET_TYPES = {
  OTC: [
    { label: "EUR/USD", value: "EURUSD", icon: "/icons/EURUSD.png" },
    { label: "GBP/USD", value: "GBPUSD", icon: "/icons/GBPUSD.png" },
    { label: "USD/JPY", value: "USDJPY", icon: "/icons/USDJPY.png" },
    { label: "AUD/USD", value: "AUDUSD", icon: "/icons/AUDUSD.png" },
    { label: "USD/CAD", value: "USDCAD", icon: "/icons/USDCAD.png" },
    { label: "NZD/USD", value: "NZDUSD", icon: "/icons/NZDUSD.png" },
    { label: "EUR/JPY", value: "EURJPY", icon: "/icons/EURJPY.png" },
    { label: "GBP/JPY", value: "GBPJPY", icon: "/icons/GBPJPY.png" },
  ],
  DIGITAL: [
    { label: "EUR/USD", value: "EURUSD", icon: "/icons/EURUSD.png" },
    { label: "GBP/USD", value: "GBPUSD", icon: "/icons/GBPUSD.png" },
    { label: "USD/JPY", value: "USDJPY", icon: "/icons/USDJPY.png" },
    { label: "AUD/USD", value: "AUDUSD", icon: "/icons/AUDUSD.png" },
    { label: "USD/CAD", value: "USDCAD", icon: "/icons/USDCAD.png" },
    { label: "NZD/USD", value: "NZDUSD", icon: "/icons/NZDUSD.png" },
    { label: "EUR/JPY", value: "EURJPY", icon: "/icons/EURJPY.png" },
    { label: "GBP/JPY", value: "GBPJPY", icon: "/icons/GBPJPY.png" },
  ],
} as const

interface UserData {
  id: string
  name: string
  lastName?: string
  email: string
  balance: {
    amount: number
    currency: string
  }
  platformId?: string
  apiUrl?: string
  websocketApiEndpoint?: string
  canGenerateSignals?: boolean
}

interface Signal {
  asset: string;
  pair: string;
  direction: "CALL" | "PUT";
  date?: string;
  expiry?: string;
  generatedCategory: "OTC" | "DIGITAL";
  confidenceIndex?: number; // Add confidenceIndex to the Signal interface
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
  const getShadowColor = () => {
    switch (variant) {
      case "primary":
        return "shadow-blue-500/20"
      case "secondary":
        return "shadow-slate-500/20"
      case "danger":
        return "shadow-red-500/20"
      case "success":
        return "shadow-blue-500/20"
      default:
        return "shadow-blue-500/20"
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
    <div className="relative">
      {/* Botão principal com sombra azul */}
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={onClick}
        disabled={disabled}
        type={type}
        className={`${getSize()} py-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg text-white font-semibold transition-all border border-slate-700 shadow-md ${getShadowColor()} flex items-center justify-center gap-2 ${
          disabled ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg hover:shadow-blue-500/30"
        } ${className} touch-manipulation`}
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
            ? "bg-blue-400"
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
    const colors = ["bg-blue-500/10", "bg-blue-500/10", "bg-violet-500/10", "bg-blue-500/10"]
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
        <label htmlFor={id} className="block text-sm font-medium text-cyan-300 mb-1.5">
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
          } pr-4 py-2.5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-blue-500 transition-colors ${className}`}
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

// Componente de dropdown personalizado para substituir o ModernDropdown
interface AssetOption {
  label: string;
  value: string;
  icon?: string;
  category: "OTC" | "DIGITAL";
}

interface AssetDropdownProps {
  options: AssetOption[];
  value: string;
  onChange: (option: AssetOption) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  selectedCategory?: string; // Adicionar o selectedCategory como parâmetro
}

function AssetDropdown({
  options,
  value,
  onChange,
  placeholder = "Selecione um ativo financeiro",
  className = "",
  disabled = false,
  selectedCategory = "", // Adicionar o selectedCategory com valor padrão
}: AssetDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Encontrar a opção selecionada com base no valor e categoria
  const selectedOption = options.find((option) => {
    // Verificar se o valor/label e a categoria correspondem
    if (value === option.value || value === option.label) {
      // Se o dropdown já foi selecionado antes, usar a categoria correta do dropdown
      if (typeof selectedCategory === 'string' && selectedCategory.length > 0) {
        return option.category === selectedCategory;
      }
      // Caso contrário, apenas corresponder por valor
      return true;
    }
    return false;
  });
  
  // Filtrar opções baseado no termo de busca
  const filteredOptions = options.filter((option) => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agrupar opções por categoria
  const groupedOptions = filteredOptions.reduce((acc: Record<string, AssetOption[]>, option) => {
    const category = option.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(option);
    return acc;
  }, {});

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Garantir que a categoria seja preservada corretamente ao selecionar um item
  const handleOptionClick = (option: AssetOption) => {
    // Registrar a seleção para debug
    console.log("Opção selecionada:", option);
    console.log("Categoria da opção:", option.category);
    
    // Chamar o onChange com a opção completa
    onChange(option);
    
    // Fechar o dropdown e limpar a busca
    setIsOpen(false);
    setSearchTerm("");
  };

  // Obter cores baseadas na categoria
  const getCategoryHighlight = (category?: string) => {
    if (!category) return "border-blue-500 shadow-blue-500/30";
    
    switch (category) {
      case "OTC":
        return "border-cyan-500 shadow-cyan-500/30";
      case "DIGITAL":
        return "border-violet-500 shadow-violet-500/30";
      default:
        return "border-blue-500 shadow-blue-500/30";
    }
  };

  return (
    <div className={`relative inline-block w-full ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 text-left rounded-lg shadow-sm focus:outline-none transition-all ${
          selectedOption 
            ? `bg-slate-900/90 border-2 ${getCategoryHighlight(selectedOption.category)} shadow-lg` 
            : "bg-slate-900/70 border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-blue-500"
        } ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {selectedOption ? (
          <div className="flex items-center">
            {selectedOption.icon && (
              <div className="w-8 h-8 mr-3 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-700 shadow-md">
                <Image
                  src={selectedOption.icon}
                  alt={selectedOption.label}
                  width={24}
                  height={24}
                  className="rounded-full object-cover"
                />
              </div>
            )}
            <div>
              <div className="font-medium text-white flex items-center">
                {selectedOption.label}
                {/* Mostrar badge de acordo com a categoria armazenada no estado, não na opção selecionada */}
                {selectedCategory === "OTC" && (
                  <span className="ml-2 px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] rounded-full border border-amber-500/30">OTC</span>
                )}
              </div>
            </div>
            <div className="ml-auto">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-slate-400" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-slate-400">{placeholder}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-slate-400" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </button>
      
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-[100] mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg shadow-lg overflow-hidden"
        >
          {options.length > 10 && (
            <div className="sticky top-0 p-2 bg-slate-900 border-b border-slate-700 z-10">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar ativos..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-blue-500"
              />
            </div>
          )}

          {Object.entries(groupedOptions).length > 0 ? (
            <div className="max-h-60 overflow-y-auto">
              {Object.entries(groupedOptions).map(([category, categoryOptions]) => (
                <div key={category}>
                  <div className="sticky top-0 px-3 py-2 bg-slate-800/90 backdrop-blur-sm text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700 z-[5]">
                    {category}
                  </div>
                  {categoryOptions.map((option) => {
                    const isSelected = option.value === value || option.label === value;
                    return (
                      <div
                        key={`${option.value}-${option.category}`}
                        className={`px-4 py-2 cursor-pointer flex items-center relative ${
                          isSelected 
                            ? `bg-slate-800 border-l-2 ${getCategoryHighlight(option.category)}`
                            : "hover:bg-slate-800/60"
                        }`}
                        onClick={() => handleOptionClick(option)}
                      >
                        {/* Ícone do ativo */}
                        {option.icon && (
                          <div className={`w-6 h-6 mr-2 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden ${
                            isSelected ? 'border border-slate-600' : ''
                          }`}>
                            <Image
                              src={option.icon}
                              alt={option.label}
                              width={20}
                              height={20}
                              className="rounded-full object-cover"
                            />
                          </div>
                        )}
                        <div className={isSelected ? 'font-medium text-white' : 'text-slate-300'}>
                          {option.label}
                        </div>
                        {option.category === "OTC" && (
                          <span className="ml-2 px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] rounded-full border border-amber-500/30">OTC</span>
                        )}
                        {isSelected && (
                          <div className="ml-auto">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-5 w-5 text-green-400" 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-2 text-slate-400">Nenhum ativo encontrado</div>
          )}
        </div>
      )}
    </div>
  );
}

// Componente para exibir o saldo do usuário
interface UserBalanceProps {
  userData: UserData
  onLogout: () => void
}

function UserBalance({ userData, onLogout }: UserBalanceProps) {
  // Construir o nome completo se lastName estiver disponível
  const fullName = userData.lastName 
    ? `${userData.name} ${userData.lastName}` 
    : userData.name;
    
  // Formatar o valor de saldo de forma mais amigável
  const formattedBalance = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: userData.balance.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(userData.balance.amount);

  return (
    <div className="flex items-center space-x-2 sm:space-x-4">
      <div className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-4 py-1.5 sm:py-2 bg-slate-800/80 rounded-lg border border-slate-700/80 shadow-inner">
        <div className="relative">
          <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <span className="text-xs sm:font-semibold text-white">{userData.name.charAt(0)}</span>
          </div>
          <div className={`absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 border-slate-800 animate-pulse ${
            userData.canGenerateSignals ? 'bg-green-500' : 'bg-amber-500'
          }`}></div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-medium text-white max-w-[80px] sm:max-w-none truncate">{fullName}</span>
          <div className="flex items-center">
            <span className="text-xs text-slate-400">{formattedBalance}</span>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onLogout}
        className="z-10 bg-gradient-to-r from-red-600 to-red-700 px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium shadow-md transition-all hover:shadow-xl hover:from-red-600 hover:to-red-800 min-w-[40px] touch-manipulation"
      >
        <span className="hidden sm:inline">Sair</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:hidden" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v7h-1V3H4v18h12v-7h1v7a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm15.707 8.707l-3 3a1 1 0 01-1.414-1.414L16.586 11H9a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 011.414-1.414l3 3a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
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
  const polariumLoginUrl = "https://trade.polariumbroker.com/register?aff=753247&aff_model=revenue&afftrack="

  // Estados para geração de sinais
  const [selectedAsset, setSelectedAsset] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<"OTC" | "DIGITAL" | "">("")
  const [isGeneratingSignal, setIsGeneratingSignal] = useState(false)
  const [generatedSignal, setGeneratedSignal] = useState<Signal | null>(null)
  // Adicionar estado para controlar se o sinal foi confirmado
  const [signalConfirmed, setSignalConfirmed] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSignalModalOpen, setIsSignalModalOpen] = useState(false)

  const handleConfirmSignal = () => {
    setSignalConfirmed(true)
  }

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

    try {
      // Validar formato do email
      if (!email.includes("@") || !email.includes(".")) {
        throw new Error("Email inválido. Por favor, insira um email válido.")
      }

      // Validar comprimento da senha
      if (password.length < 6) {
        throw new Error("Senha deve conter pelo menos 6 caracteres.")
      }

      // Fazer requisição real para o backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL não configurada. Verifique as variáveis de ambiente.");
      }
      
      console.log("Attempting to connect to API URL:", apiUrl);
      
      // Usar o mesmo endpoint tanto em produção quanto em desenvolvimento
      const loginUrl = `${apiUrl}/user`;
        
      console.log("Login request will be sent to:", loginUrl);
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Check content type to avoid JSON parse errors
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Servidor retornou um formato inválido. Verifique se o servidor está rodando corretamente.");
      }
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Falha ao fazer login");
      }

      const userData = result.data;
      
      // Salvar dados do usuário no localStorage
      localStorage.setItem("userData", JSON.stringify(userData));
      
      // Atualizar o estado
      setIsAuthenticated(true);
      setUserData(userData);
      setShowLoginModal(false);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Falha ao fazer login. Tente novamente.")
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

    // Verificar se o usuário pode gerar sinais com base no saldo
    if (userData && !userData.canGenerateSignals) {
      setError(`Saldo insuficiente. É necessário ter pelo menos 60 ${userData.balance.currency} para gerar sinais.`)
      setShowLoginModal(true)
      return
    }

    setIsGeneratingSignal(true)
  }

  // Função para formatar a data
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Função para gerar tempo de expiração aleatório
  const getRandomExpiry = (): string => {
    const expiries = ["1 min", "5 min", "15 min", "30 min"];
    return expiries[Math.floor(Math.random() * expiries.length)];
  };

  const handleSignalGenerationComplete = () => {
    // Gera o sinal com todos os dados necessários
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    
    // Generate a fixed confidence index between 89-99%
    const confidenceIndex = 89 + Math.round(Math.random() * 10);
    
    // Garantir que a categoria seja preservada no momento da geração
    setGeneratedSignal({
      asset: selectedAsset,
      pair: selectedAsset,
      direction: Math.random() > 0.5 ? "CALL" : "PUT",
      date: formattedDate,
      expiry: getRandomExpiry(),
      generatedCategory: selectedCategory as "OTC" | "DIGITAL",
      confidenceIndex: confidenceIndex // Save the confidence index in the signal
    });
    
    console.log("Sinal gerado com categoria:", selectedCategory);
    
    // Abre o modal do sinal
    setIsSignalModalOpen(true);
    setIsGeneratingSignal(false);
  };

  // Preparar opções para o dropdown
  const dropdownOptions: AssetOption[] = [
    ...ASSET_TYPES.OTC.map((asset) => ({
      label: asset.label,
      value: asset.value,
      icon: asset.icon,
      category: "OTC" as const,
    })),
    ...ASSET_TYPES.DIGITAL.map((asset) => ({
      label: asset.label,
      value: asset.value,
      icon: asset.icon,
      category: "DIGITAL" as const,
    })),
  ]

  // Função para encontrar a opção correta com base no valor e categoria
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const findOption = (value: string, category?: "OTC" | "DIGITAL") => {
    if (category) {
      // Buscar especificamente pela combinação valor + categoria
      const option = dropdownOptions.find(
        (option) => 
          (option.value === value || option.label === value) && 
          option.category === category
      );
      return option;
    }
    
    // Se não foi especificada uma categoria, buscar apenas por valor
    const option = dropdownOptions.find(
      (option) => option.value === value || option.label === value
    );
    console.log("Buscando opção apenas por valor:", { value, found: option });
    return option;
  };

  // Atualizar o estado quando um ativo é selecionado
  const handleAssetChange = (option: AssetOption) => {
    console.log("Asset selecionado:", option);
    console.log("Categoria do asset:", option.category);
    
    // Garantir que estado e categoria sejam atualizados corretamente
    setSelectedAsset(option.label);
    setSelectedCategory(option.category);
    
    // Debug: verificar estado após atualização
    setTimeout(() => {
      console.log("Estado atual:", { 
        selectedAsset, 
        selectedCategory,
        opção: option 
      });
    }, 0);
  };

  // Vamos criar uma função auxiliar para verificar a categoria
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isDigitalOTC = (category: string | undefined): boolean => 
    category === "OTC";

  // Adicionar função auxiliar para determinar se a operação é CALL ou PUT
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getOperationType = (signal: Signal) => {
    return signal.direction === "CALL" ? "CALL" : "PUT";
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <ClientOnly>
        <BackgroundParticles />
      </ClientOnly>

      {/* Animated gradient orbs in background */}
      <ClientOnly>
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-800/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-800/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
        </div>
      </ClientOnly>

      {/* Header com autenticação */}
      <header className="pt-4 sm:pt-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div>
              <Image 
                src="/logo.png"
                alt="Trader Signals Logo"
                width={140}
                height={35}
                className="h-20 sm:h-24 w-auto"
              />
              <p className="text-xs text-slate-400 mt-1 hidden sm:block">Plataforma avançada de trading</p>
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
                <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-400">
                  Polarium Broker
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="flex items-center min-w-[80px]">
            {isAuthenticated && userData ? (
              <UserBalance userData={userData} onLogout={handleLogout} />
            ) : (
              <GlowButton
                onClick={() => setShowLoginModal(true)}
                size="sm"
                className="z-50 py-2 px-4 shadow-lg shadow-blue-500/20 h-10"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1.5"
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
                <span className="text-sm font-medium">Entrar</span>
              </GlowButton>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
        {/* Interface de Geração de Sinais - Enhanced UI */}
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-visible bg-slate-900/80 rounded-2xl p-4 sm:p-6 md:p-10 shadow-2xl backdrop-blur-md border border-slate-700/60"
          >
            {/* Enhanced lighting effects */}
            <div className="absolute -inset-[150px] bg-blue-800/5 blur-3xl rounded-full -z-10"></div>
            <div className="absolute -bottom-[100px] -right-[100px] bg-blue-600/10 blur-3xl rounded-full -z-10 w-[300px] h-[300px]"></div>
            <div className="absolute top-1/3 left-0 w-full h-32 bg-gradient-to-r from-blue-800/0 via-blue-800/5 to-blue-800/0 rotate-12 blur-3xl -z-10"></div>

            {/* Animated tech pattern in background */}
            <ClientOnly>
              <CircuitPattern color="blue" density={20} />
            </ClientOnly>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-center mb-6 sm:mb-10 md:mb-14"
              >
                <div className="inline-block py-1 px-3 rounded-full bg-blue-800/20 text-blue-300 text-xs font-medium tracking-wide mb-3 sm:mb-4 border border-blue-800/20">
                  ALGORITMO DE PRECISÃO AVANÇADA
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500">
                    Análise de Mercado Inteligente
                  </span>
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
                  Selecione um ativo financeiro e nosso algoritmo de análise avançada identificará oportunidades de mercado com alta precisão e confiabilidade
                </p>
              </motion.div>

              {/* Seleção de ativos com dropdown - enhanced */}
              <div className="bg-slate-900/80 p-4 sm:p-6 rounded-xl border border-slate-700/80 shadow-xl backdrop-blur-sm max-w-2xl mx-auto">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-white flex items-center">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center rounded-full bg-blue-800/20 mr-2 sm:mr-3 border border-blue-700/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400"
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
                  Selecionar Ativo
                </h3>

                {/* Componente de dropdown melhorado */}
                <div className="mb-6 sm:mb-10">
                  <AssetDropdown
                    options={dropdownOptions}
                    value={selectedAsset}
                    onChange={handleAssetChange}
                    placeholder="Selecione um Ativo financeiro"
                    className="mb-4 sm:mb-6"
                    disabled={!isAuthenticated}
                    selectedCategory={selectedCategory}
                  />
                  <p className="text-center text-slate-400 text-xs sm:text-sm mt-3 sm:mt-4">
                    {isAuthenticated 
                      ? "Selecione um ativo financeiro no menu acima para obter análise de mercado"
                      : "Faça login para selecionar ativos e receber análises de mercado"
                    }
                  </p>
                </div>

                {/* Botão de geração de sinal - mais responsivo */}
                <div className="flex justify-center">
                  <GlowButton
                    onClick={!isAuthenticated ? () => setShowLoginModal(true) : handleGenerateSignal}
                    disabled={isAuthenticated && (!selectedAsset || userData?.canGenerateSignals === false)}
                    className="mt-4 sm:mt-8 w-full sm:w-auto"
                    size="lg"
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 flex-shrink-0"
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
                    <span className="whitespace-nowrap text-sm sm:text-base">
                      {!isAuthenticated 
                        ? "Entrar para Analisar" 
                        : userData?.canGenerateSignals === false
                          ? "Saldo mínimo necessário" 
                          : "Gerar Análise de Mercado"
                      }
                    </span>
                  </GlowButton>
                </div>

                {!isAuthenticated && (
                  <div className="mt-4 text-amber-400 text-xs sm:text-sm flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Faça login para acessar análises para Polarium Broker</span>
                  </div>
                )}

                {isAuthenticated && userData && userData.canGenerateSignals === false && (
                  <div className="mt-4 flex flex-col items-center justify-center">
                    <div className="text-amber-400 text-xs sm:text-sm flex items-center justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>É necessário ter saldo mínimo de 60 {userData.balance?.currency} para gerar análises</span>
                    </div>
                    <a 
                      href="https://trade.polariumbroker.com/pt/deposit" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-xs sm:text-sm text-white font-medium transition-colors mt-1"
                    >
                      Fazer Depósito na Polarium
                    </a>
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

        {/* Resultado do sinal gerado - como popup/modal */}
        <ClientOnly>
          <AnimatePresence>
            {generatedSignal && !signalConfirmed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="w-full max-w-lg"
                >
                  <div className="bg-slate-900/90 rounded-2xl p-5 sm:p-8 shadow-xl backdrop-blur-md border border-slate-700/60 relative overflow-hidden">
                    {/* Background effects */}
                    <div className="absolute -inset-[150px] bg-blue-800/5 blur-3xl rounded-full -z-10"></div>
                    <div className="absolute -bottom-[100px] -right-[100px] bg-blue-700/10 blur-3xl rounded-full -z-10 w-[300px] h-[300px]"></div>
                    
                    {/* Close button */}
                    <button 
                      onClick={() => setSignalConfirmed(true)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-800/20 rounded-full flex items-center justify-center border border-blue-700/30"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400"
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
                        className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500"
                      >
                        Oportunidade de Mercado
                      </motion.h3>
                    </div>

                    {/* Cards do sinal gerado - estilo mais financeiro */}
                    <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-6 sm:mb-8 max-w-md mx-auto">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-slate-900/70 to-slate-900/70 rounded-xl p-4 sm:p-6 border border-slate-700/50"
                      >
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-700/40">
                          <div className="flex items-center">
                            <div className="w-7 h-7 rounded-md flex items-center justify-center bg-slate-800 border border-slate-700 mr-2">
                              <Image 
                                src={
                                  ASSET_TYPES.OTC.find(asset => asset.value === generatedSignal.asset || asset.label === generatedSignal.asset)?.icon ||
                                  ASSET_TYPES.DIGITAL.find(asset => asset.value === generatedSignal.asset || asset.label === generatedSignal.asset)?.icon ||
                                  "/placeholder.svg?height=20&width=20"
                                }
                                alt={generatedSignal.asset}
                                width={20}
                                height={20}
                                className="rounded-sm"
                              />
                            </div>
                            <div className="flex items-center">
                              <span className="font-bold text-lg text-white">{generatedSignal.pair || generatedSignal.asset}</span>
                              {generatedSignal.generatedCategory === "OTC" && (
                                <span className="ml-2 px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] rounded-full border border-amber-500/30">OTC</span>
                              )}
                              {generatedSignal.generatedCategory === "DIGITAL" && (
                                <span className="ml-2 px-1.5 py-0.5 bg-violet-500/20 text-violet-400 text-[10px] rounded-full border border-violet-500/30">DIGITAL</span>
                              )}
                            </div>
                          </div>
                          <div className="px-2 py-1 rounded bg-slate-800 text-xs">
                            {new Date().toLocaleDateString('pt-BR', {
                              weekday: 'short',
                              day: '2-digit',
                              month: '2-digit',
                              year: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className={`px-3 py-2 rounded-lg border border-slate-700/50 bg-slate-800/50 ${
                            generatedSignal.direction === "CALL" 
                              ? "border-green-700/30" 
                              : "border-red-700/30"
                          }`}>
                            <div className="text-xs text-slate-400 mb-1">Operação</div>
                            <div className={`text-base font-semibold ${
                              generatedSignal.direction === "CALL" 
                                ? "text-green-400" 
                                : "text-red-400"
                            }`}>
                              {generatedSignal.direction === "CALL" ? "M1/CALL" : "M1/PUT"}
                            </div>
                          </div>
                          
                          <div className="px-3 py-2 rounded-lg border border-slate-700/50 bg-slate-800/50">
                            <div className="text-xs text-slate-400 mb-1">Válido até</div>
                            <div className="text-base font-mono font-semibold text-white">{new Date(Date.now() + 60000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                        </div>

                        <div className="mt-4 px-3 py-2 rounded-lg border border-slate-700/50 bg-slate-800/50">
                          <div className="text-xs text-slate-400 mb-1">Análise de Confiança</div>
                          <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" 
                              style={{ width: `${generatedSignal.confidenceIndex}%` }}
                            ></div>
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
                      <div className="p-4 sm:p-5 bg-gradient-to-br from-blue-900/10 to-blue-900/10 rounded-xl text-sm sm:text-base text-white border border-blue-800/20 max-w-md text-center shadow-lg">
                        <p className="mb-2 sm:mb-3 font-semibold text-base sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500">
                          Análise baseada em dados de mercado
                        </p>
                        <p className="mb-4 sm:mb-6">
                          Esta operação foi identificada pelo nosso algoritmo de análise avançada através de indicadores técnicos e padrões de preço.
                        </p>
                        
                        <div className="mt-3 sm:mt-4">
                          <GlowButton
                            onClick={() => handleConfirmSignal()}
                            className="w-full bg-opacity-90"
                            size="md"
                            variant="success"
                            icon={
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            }
                          >
                            Confirmar Operação
                          </GlowButton>
                        </div>
                        
                        <div className="mt-3 flex justify-center">
                          <a 
                            href={polariumLoginUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                            </svg>
                            Acessar Plataforma Polarium
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </ClientOnly>

        {/* Resultado do sinal gerado (versão fixa na página - mostra apenas após a confirmação) */}
        <ClientOnly>
          <AnimatePresence>
            {generatedSignal && signalConfirmed && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="mt-12 max-w-5xl mx-auto"
              >
                <div className="bg-slate-900/80 rounded-2xl p-5 sm:p-8 shadow-xl backdrop-blur-md border border-slate-700/60 relative overflow-hidden">
                  {/* Background effects */}
                  <div className="absolute -inset-[150px] bg-blue-800/5 blur-3xl rounded-full -z-10"></div>
                  <div className="absolute -bottom-[100px] -right-[100px] bg-blue-700/10 blur-3xl rounded-full -z-10 w-[300px] h-[300px]"></div>

                  <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-800/20 rounded-full flex items-center justify-center border border-blue-700/30"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400"
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
                      className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500"
                    >
                      Análise de Mercado
                    </motion.h3>
                  </div>

                  {/* Card do sinal no estilo mais financeiro */}
                  <div className="max-w-2xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-br from-slate-900/70 to-slate-900/70 rounded-xl p-4 sm:p-6 border border-slate-700/50"
                    >
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/40">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-md flex items-center justify-center bg-slate-800 border border-slate-700 mr-3">
                            <Image 
                              src={
                                ASSET_TYPES.OTC.find(asset => asset.value === generatedSignal.asset || asset.label === generatedSignal.asset)?.icon ||
                                ASSET_TYPES.DIGITAL.find(asset => asset.value === generatedSignal.asset || asset.label === generatedSignal.asset)?.icon ||
                                "/placeholder.svg?height=24&width=24"
                              }
                              alt={generatedSignal.asset}
                              width={24}
                              height={24}
                              className="rounded-sm"
                            />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <span className="font-bold text-lg text-white">{generatedSignal.pair || generatedSignal.asset}</span>
                              {generatedSignal.generatedCategory === "OTC" && (
                                <span className="ml-2 px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] rounded-full border border-amber-500/30">OTC</span>
                              )}
                              {generatedSignal.generatedCategory === "DIGITAL" && (
                                <span className="ml-2 px-1.5 py-0.5 bg-violet-500/20 text-violet-400 text-[10px] rounded-full border border-violet-500/30">DIGITAL</span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400">
                              {new Date().toLocaleDateString('pt-BR', {
                                weekday: 'short',
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className={`px-3 py-2.5 rounded-lg border bg-slate-800/50 ${
                          generatedSignal.direction === "CALL" 
                            ? "border-green-700/30" 
                            : "border-red-700/30"
                        }`}>
                          <div className="text-xs text-slate-400 mb-1">Operação</div>
                          <div className={`text-lg font-mono font-semibold ${
                            generatedSignal.direction === "CALL" 
                              ? "text-green-400" 
                              : "text-red-400"
                          }`}>
                            {generatedSignal.direction === "CALL" ? "M1/CALL" : "M1/PUT"}
                          </div>
                        </div>
                        
                        <div className="px-3 py-2.5 rounded-lg border border-slate-700/50 bg-slate-800/50">
                          <div className="text-xs text-slate-400 mb-1">Válido até</div>
                          <div className="text-lg font-mono font-semibold text-white">{new Date(Date.now() + 60000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      </div>

                      <div className="px-3 py-3 rounded-lg border border-slate-700/50 bg-slate-800/50 mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-xs text-slate-400">Índice de Confiança</div>
                          <div className="text-xs font-semibold text-blue-400">{generatedSignal.confidenceIndex}%</div>
                        </div>
                        <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" 
                            style={{ width: `${generatedSignal.confidenceIndex}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Recomendação */}
                      <div className="px-4 py-3 rounded-lg border border-blue-800/30 bg-blue-900/10">
                        <div className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-sm text-slate-300">Esta análise foi gerada utilizando indicadores técnicos e padrões de preço identificados pelo nosso algoritmo avançado.</p>
                            <a 
                              href={polariumLoginUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center text-xs text-blue-400 hover:text-blue-300"
                            >
                              Abrir operação na Polarium
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
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
            <div className="border border-zinc-700/50 rounded-xl p-6 bg-zinc-800/30 backdrop-blur-sm">
              
              {/* Remove the video placeholder and keep only the Polarium notice */}
              <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/20">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm text-zinc-300">Este sinal foi gerado para uso exclusivo na plataforma <strong>Polarium Broker</strong>. Para utilizar este sinal, acesse sua conta e utilize os valores gerados.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-6 mt-10">
        <div className="container mx-auto px-4 text-center text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} Trader Signal X | Plataforma avançada de sinais de trading com IA</p>
        </div>
      </footer>

      {/* Animação de Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50 p-3 sm:p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-sm sm:max-w-md rounded-xl overflow-hidden my-4"
            >
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/50 shadow-xl">
                {/* Banner superior com logo */}
                <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 border-b border-slate-700/50 p-3 sm:p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <Image 
                      src="/logo.png"
                      alt="Polarium Broker"
                      width={100}
                      height={25}
                      className="h-6 w-auto"
                    />
                    <div className="h-5 w-px bg-slate-700/50 mx-2"></div>
                    <span className="text-xs font-medium text-slate-300">Acesso</span>
                  </div>
                  <button
                    onClick={() => setShowLoginModal(false)}
                    className="text-slate-400 hover:text-white transition-colors rounded-full p-1 hover:bg-slate-800/50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                <div className="p-4 sm:p-5">
                  {/* Título e subtítulo */}
                  <div className="mb-4 text-center">
                    <h3 className="text-lg font-bold text-white mb-1">Acesse sua conta</h3>
                    <div className="text-slate-400 text-xs">
                      <p>Use suas credenciais da Polarium Broker</p>
                    </div>
                  </div>

                  {/* Indicador de segurança */}
                  <div className="mb-4 px-3 py-2 bg-blue-900/10 border border-blue-800/20 rounded-lg flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <div className="text-xs text-slate-300">
                      <p className="font-medium text-blue-400 mb-1">Conexão segura</p>
                      <p>Seus dados estão protegidos. Não armazenamos credenciais.</p>
                    </div>
                  </div>

                  {/* Mensagem de erro */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-2 bg-red-500/10 border border-red-500/30 rounded-lg"
                    >
                      <div className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <p className="text-xs text-red-300">{error}</p>
                      </div>
                    </motion.div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-3">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="seu@email.com"
                        label="Email"
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
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
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        }
                      />
                    </div>

                    {userData && userData.canGenerateSignals === false && (
                      <div className="px-3 py-2 bg-amber-900/10 border border-amber-800/20 rounded-lg">
                        <p className="text-xs text-amber-400">
                          <span className="font-medium">Saldo insuficiente:</span> É necessário ter pelo menos 60 {userData.balance.currency} para gerar sinais.
                        </p>
                      </div>
                    )}

                    <div className="pt-1">
                      <GlowButton 
                        onClick={() => {}} 
                        disabled={loading} 
                        type="submit"
                        className="w-full"
                        size="sm"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <svg
                              className="animate-spin mr-2 h-3 w-3 text-white"
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
                            <span className="text-sm">Autenticando...</span>
                          </div>
                        ) : (
                          <span className="flex items-center justify-center text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1-.257-.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                            </svg>
                            Entrar
                          </span>
                        )}
                      </GlowButton>
                    </div>
                  </form>

                  {/* Separador */}
                  <div className="flex items-center mt-6 mb-4">
                    <div className="flex-grow h-px bg-slate-800"></div>
                    <span className="px-2 text-xs text-slate-500">Ou</span>
                    <div className="flex-grow h-px bg-slate-800"></div>
                  </div>

                  {/* Criar conta */}
                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-2">
                      Ainda não tem uma conta?
                    </p>
                    <a 
                      href="https://trade.polariumbroker.com/register?aff=753247&aff_model=revenue&afftrack=" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-3 py-1.5 border border-blue-800/50 bg-blue-900/20 rounded-lg text-xs text-blue-400 hover:bg-blue-900/30 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                      </svg>
                      Criar conta Polarium
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
