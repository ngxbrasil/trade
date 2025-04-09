"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface SignalGenerationProps {
  isGenerating: boolean;
  onComplete: () => void;
  selectedAsset?: string;
  selectedCategory?: "CRYPTO" | "FOREX" | "";
}

export default function SignalGeneration({ 
  isGenerating, 
  onComplete, 
  selectedAsset,
  selectedCategory 
}: SignalGenerationProps) {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isProcessComplete, setIsProcessComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [assetIcon, setAssetIcon] = useState<string | null>(null);

  // Buscar ícone do ativo quando o componente é montado ou o ativo muda
  useEffect(() => {
    if (selectedAsset && selectedCategory) {
      // Transformar o formato "BTC/USD" para "BTCUSD" para o caminho do ícone
      const formattedAsset = selectedAsset.replace('/', '');
      setAssetIcon(`/icons/${formattedAsset}.png`);
    } else {
      setAssetIcon(null);
    }
  }, [selectedAsset, selectedCategory]);

  // Fases do processo de geração
  const phases = [
    {
      name: "Coleta de Dados",
      description: "Coletando dados históricos e de mercado em tempo real",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      )
    },
    {
      name: "Análise Técnica",
      description: "Aplicando indicadores técnicos e detectando padrões de mercado",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: "Processamento IA",
      description: "Executando algoritmo de machine learning com análise preditiva",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: "Validação",
      description: "Comprovando tendências e confirmando probabilidades de sucesso",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  // Frases para cada fase
  const phaseDetails = [
    [
      "Obtendo dados históricos...",
      "Analisando volume de trading...",
      "Coletando cotações em tempo real..."
    ],
    [
      "Calculando médias móveis...",
      "Analisando RSI e MACD...",
      "Detectando padrões de candlestick..."
    ],
    [
      "Executando modelo preditivo...",
      "Calculando probabilidades...",
      "Processando análise de sentimento..."
    ],
    [
      "Validando tendências principais...",
      "Confirmando pontos de entrada...",
      "Sincronizando resultado final..."
    ]
  ];

  // Reset do estado ao iniciar a geração
  useEffect(() => {
    if (isGenerating) {
      setProgress(0);
      setCurrentPhase(0);
      setIsProcessComplete(false);
      setShowConfetti(false);
    }
  }, [isGenerating]);

  // Gerenciar as fases do processo de geração
  useEffect(() => {
    if (!isGenerating) return;

    const phaseInterval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 0.4;
        
        // Determina em qual fase estamos com base no progresso
        const phase = Math.min(3, Math.floor(newProgress / 25));
        if (phase !== currentPhase) {
          setCurrentPhase(phase);
        }
        
        if (newProgress >= 100) {
          clearInterval(phaseInterval);
          setIsProcessComplete(true);
          setShowConfetti(true);
          
          // Aguarda um pouco antes de fechar a animação
          setTimeout(() => {
            onComplete();
          }, 1500);
          
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(phaseInterval);
  }, [isGenerating, currentPhase, onComplete]);

  // Gera confetes para celebrar a conclusão
  const renderConfetti = () => {
    return Array.from({ length: 100 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full"
        style={{
          background: [
            '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#9B72CF'
          ][Math.floor(Math.random() * 5)],
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        }}
        initial={{ 
          y: -10,
          opacity: 1,
          scale: 0
        }}
        animate={{ 
          y: 500,
          opacity: [1, 1, 0],
          scale: [0, 1, 0.5],
          rotate: Math.random() * 360
        }}
        transition={{
          duration: Math.random() * 2 + 1.5,
          ease: [0.23, 1, 0.32, 1]
        }}
      />
    ));
  };

  if (!isGenerating) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50 p-4 sm:p-0"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-full max-w-2xl p-4 sm:p-8 rounded-3xl relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950"
        >
          {/* Padrão de circuito de fundo */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i}
                className="absolute h-px bg-cyan-400"
                style={{
                  top: `${i * 5}%`,
                  left: 0,
                  right: 0,
                  height: '1px',
                  opacity: 0.3,
                  animation: `pulse ${(i % 3) + 2}s ease-in-out ${i * 0.1}s infinite alternate`
                }}
              />
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i + 20}
                className="absolute w-px bg-violet-400"
                style={{
                  left: `${i * 5}%`,
                  top: 0,
                  bottom: 0,
                  width: '1px',
                  opacity: 0.3,
                  animation: `pulse ${(i % 3) + 2}s ease-in-out ${i * 0.1}s infinite alternate`
                }}
              />
            ))}
          </div>

          {/* Efeitos luminosos */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl"></div>

          {/* Cabeçalho com detalhes do ativo */}
          <div className="relative mb-4 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
                Gerando Sinal Inteligente
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Processando dados e aplicando algoritmos avançados
              </p>
            </div>
            {selectedAsset && (
              <div className="flex items-center px-3 py-2 bg-slate-800/70 rounded-xl border border-slate-700/70 w-full sm:w-auto">
                <div className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded-full mr-3 overflow-hidden">
                    {assetIcon ? (
                      <Image
                        src={assetIcon}
                        alt={selectedAsset}
                        width={24}
                        height={24}
                        className="rounded-full object-contain"
                        onError={() => {
                          // Fallback para ícones genéricos se a imagem não carregar
                          setAssetIcon(null);
                        }}
                      />
                    ) : selectedCategory === "CRYPTO" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                      </svg>
                    ) : selectedCategory === "FOREX" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Ativo</div>
                    <div className="text-white font-medium">{selectedAsset}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fases do processo */}
          <div className="relative mb-6 sm:mb-8 overflow-x-auto pb-2">
            <div className="flex justify-between min-w-[500px] lg:min-w-0 mb-4">
              {phases.map((phase, idx) => (
                <div
                  key={idx}
                  className={`relative flex-1 ${
                    idx !== phases.length - 1 ? 'after:content-[""] after:h-[2px] after:bg-slate-700 after:absolute after:top-[15px] after:w-full after:right-0 after:translate-x-1/2' : ''
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div 
                      className={`relative z-10 w-8 h-8 rounded-full border-2 ${
                        currentPhase > idx 
                          ? 'bg-green-500 border-green-600 text-white' 
                          : currentPhase === idx 
                          ? 'bg-cyan-500 border-cyan-600 text-white' 
                          : 'bg-slate-800 border-slate-700 text-slate-500'
                      } flex items-center justify-center mb-2`}
                    >
                      {currentPhase > idx ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        phase.icon
                      )}
                      {currentPhase === idx && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-cyan-400"
                          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>
                    <div className={`text-xs font-medium text-center truncate w-full px-1 ${
                      currentPhase >= idx ? 'text-white' : 'text-slate-500'
                    }`}>
                      {phase.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Animação do processo atual */}
          <div className="mb-6 sm:mb-8 relative">
            <div className="bg-slate-800/70 rounded-xl border border-slate-700/70 p-3 sm:p-5 overflow-hidden">
              {/* Terminal simulado */}
              <div className="font-mono text-sm text-green-400 mb-4 bg-slate-900 p-2 sm:p-3 rounded-lg border border-slate-800 h-24 sm:h-32 overflow-hidden">
                <div className="flex mb-1 text-slate-400 items-center text-xs">
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></div>
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mr-1.5"></div>
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></div>
                  <span className="ml-2">IA Terminal</span>
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPhase}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="whitespace-pre"
                  >
                    <div className="text-slate-400">
                      {`> Iniciando ${phases[currentPhase].name.toLowerCase()}...`}
                    </div>
                    {phaseDetails[currentPhase].map((detail, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.5 + 0.3 }}
                      >
                        {`> ${detail}`}
                      </motion.div>
                    ))}
                    {isProcessComplete && currentPhase === 3 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-green-400 mt-2"
                      >
                        {`> Processo concluído com sucesso! Sinal pronto.`}
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Visualização da análise */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900 rounded-lg border border-slate-800 p-3 h-28 relative overflow-hidden">
                  <div className="text-xs text-slate-400 mb-2">Análise de tendência</div>
                  <div className="flex items-end justify-between h-16 gap-1">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const height = 30 + Math.sin(i * 0.8) * 15 + (Math.random() * 10);
                      // Altura que depende da fase atual para criar animação
                      const animatedHeight = Math.min(height, (progress / 100) * 100);
                      
                      return (
                        <motion.div
                          key={i}
                          className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400"
                          style={{ 
                            height: `${animatedHeight}%`,
                            opacity: 0.3 + (i / 12) * 0.7
                          }}
                          initial={{ height: 0 }}
                          animate={{ height: `${animatedHeight}%` }}
                          transition={{ duration: 0.5, delay: i * 0.08 }}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="bg-slate-900 rounded-lg border border-slate-800 p-3 h-28">
                  <div className="text-xs text-slate-400 mb-2">Probabilidade de sucesso</div>
                  <div className="flex items-center justify-center h-16">
                    <div className="relative h-16 w-16">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          className="text-slate-700"
                          strokeWidth="10"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <motion.circle
                          className="text-green-400"
                          strokeWidth="10"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                          initial={{ strokeDasharray: "0 251.2" }}
                          animate={{ 
                            strokeDasharray: `${progress * 2.512} 251.2` 
                          }}
                          transition={{ duration: 0.8 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-lg font-semibold text-white">{Math.round(progress)}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="mb-4">
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Indicador de fase atual */}
          <div className="flex justify-center">
            <motion.div 
              className="px-3 sm:px-4 py-1.5 bg-slate-800 rounded-full text-xs sm:text-sm text-slate-300 font-medium text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={currentPhase}
            >
              {isProcessComplete 
                ? "Sinal gerado com sucesso!" 
                : phases[currentPhase].description}
            </motion.div>
          </div>

          {/* Confetes ao completar */}
          {showConfetti && renderConfetti()}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 