'use client';

import { useEffect, useState, ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
}

export default function ClientOnly({ children }: ClientOnlyProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return null;
  }
  
  return <>{children}</>;
} 