import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface DropdownOption {
  value: string;
  label: string;
  category?: string;
  icon?: string;
  [key: string]: string | boolean | number | undefined | null | Record<string, unknown>;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (option: DropdownOption) => void;
  placeholder?: string;
  className?: string;
  isCategoryGrouped?: boolean;
  showCategoryIcons?: boolean;
  iconMap?: Record<string, React.ReactNode>;
  disabled?: boolean;
}

export default function ModernDropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  isCategoryGrouped = false,
  showCategoryIcons = false,
  iconMap,
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchEnabled = options.length > 10;
  
  // Encontrar a opção selecionada com base no valor
  const selectedOption = options.find((option: DropdownOption) => option.value === value || option.label === value);
  
  // Filtrar opções baseado no termo de busca
  const filteredOptions = options.filter((option: DropdownOption) => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Agrupar opções por categoria se necessário
  const groupedOptions = filteredOptions.reduce((acc: Record<string, DropdownOption[]>, option: DropdownOption) => {
    const category = option.category || 'Outros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(option);
    return acc;
  }, {});

  // Alternar o dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // Lidar com a seleção de uma opção
  const handleOptionClick = (option: DropdownOption) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Determine the color for the category
  const getCategoryColor = (category: string) => {
    const categoryColors: { [key: string]: string } = {
      DIGITAL_OTC: "from-cyan-500 to-violet-500",
      DIGITAL: "from-blue-500 to-violet-600",
      default: "from-cyan-500 to-violet-500",
    };
    return categoryColors[category] || categoryColors.default;
  };

  // Função para determinar a cor de destaque baseada na categoria
  const getHighlightColor = (category?: string) => {
    if (!category) return "border-blue-500 shadow-blue-500/20";
    
    switch (category) {
      case "DIGITAL_OTC":
        return "border-cyan-500 shadow-cyan-500/20";
      case "DIGITAL":
        return "border-violet-500 shadow-violet-500/20";
      default:
        return "border-blue-500 shadow-blue-500/20";
    }
  };

  return (
    <div className={`relative inline-block w-full ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={toggleDropdown}
        className={`w-full px-4 py-3 text-left rounded-lg shadow-sm focus:outline-none transition-all ${
          selectedOption 
            ? `bg-slate-900/90 border-2 ${getHighlightColor(selectedOption.category)} shadow-lg` 
            : "bg-slate-900/70 border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-blue-500"
        } ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {selectedOption ? (
          <div className="flex items-center">
            {/* Renderizar ícone do ativo, se disponível */}
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
            {/* Ou mostrar ícone de categoria se especificado */}
            {!selectedOption.icon && showCategoryIcons && selectedOption.category && iconMap && (
              <div className={`flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-gradient-to-r ${getCategoryColor(selectedOption.category)} border-2 border-slate-700 shadow-md`}>
                {iconMap[selectedOption.category]}
              </div>
            )}
            <div>
              <div className="font-medium text-white">{selectedOption.label}</div>
              {selectedOption.category && (
                <div className="text-xs text-slate-400">{selectedOption.category}</div>
              )}
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
          className="absolute z-50 mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {searchEnabled && (
            <div className="sticky top-0 p-2 bg-slate-900 border-b border-slate-700">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search options..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-blue-500"
              />
            </div>
          )}

          {filteredOptions.length > 0 ? (
            <div>
              {isCategoryGrouped ? (
                Object.entries(groupedOptions).map(([category, options]) => (
                  <div key={category}>
                    <div className="sticky top-0 px-3 py-2 bg-slate-800 text-xs font-semibold text-slate-400 uppercase">
                      {category}
                    </div>
                    {options.map((option: DropdownOption) => {
                      const isSelected = option.value === value || option.label === value;
                      return (
                        <div
                          key={option.value}
                          className={`px-4 py-2 cursor-pointer flex items-center relative ${
                            isSelected 
                              ? `bg-slate-800 border-l-2 ${getHighlightColor(option.category)}`
                              : "hover:bg-slate-800/60"
                          }`}
                          onClick={() => handleOptionClick(option)}
                        >
                          {/* Renderizar ícone do ativo, se disponível */}
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
                          {/* Ou mostrar ícone de categoria se especificado */}
                          {!option.icon && showCategoryIcons && option.category && iconMap && (
                            <div className={`flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-gradient-to-r ${getCategoryColor(option.category)} ${
                              isSelected ? 'border border-slate-600' : ''
                            }`}>
                              {iconMap[option.category]}
                            </div>
                          )}
                          <div className={isSelected ? 'font-medium text-white' : 'text-slate-300'}>
                            {option.label}
                          </div>
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
                ))
              ) : (
                filteredOptions.map((option: DropdownOption) => {
                  const isSelected = option.value === value || option.label === value;
                  return (
                    <div
                      key={option.value}
                      className={`px-4 py-2 cursor-pointer flex items-center relative ${
                        isSelected 
                          ? `bg-slate-800 border-l-2 ${getHighlightColor(option.category)}`
                          : "hover:bg-slate-800/60"
                      }`}
                      onClick={() => handleOptionClick(option)}
                    >
                      {/* Renderizar ícone do ativo, se disponível */}
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
                      {/* Ou mostrar ícone de categoria se especificado */}
                      {!option.icon && showCategoryIcons && option.category && iconMap && (
                        <div className={`flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-gradient-to-r ${getCategoryColor(option.category)} ${
                          isSelected ? 'border border-slate-600' : ''
                        }`}>
                          {iconMap[option.category]}
                        </div>
                      )}
                      <div className={isSelected ? 'font-medium text-white' : 'text-slate-300'}>
                        {option.label}
                      </div>
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
                })
              )}
            </div>
          ) : (
            <div className="px-4 py-2 text-slate-400">No options found</div>
          )}
        </div>
      )}
    </div>
  );
} 