import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MaintenanceModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verificar se estamos em modo de demonstração
    const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
    
    if (demoMode) {
      setIsOpen(true);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-8 text-blue-600 dark:text-blue-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Sistema em Manutenção
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Estamos aprimorando nossa inteligência artificial para oferecer uma experiência ainda melhor.
                As funcionalidades podem estar limitadas durante este período.
              </p>
              
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                Entendi
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 