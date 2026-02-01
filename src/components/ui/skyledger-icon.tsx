import Image from 'next/image'
import { useState } from 'react'

interface SkyLedgerIconProps {
  size?: 24 | 32
  alt?: string
  className?: string
  priority?: boolean
  decorative?: boolean
}

export function SkyLedgerIcon({ 
  size = 24, 
  alt = 'SkyLedger',
  className = '',
  priority = false,
  decorative = false
}: SkyLedgerIconProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }}>
      {isLoading && !hasError && (
        <div 
          className="animate-pulse bg-gray-200 rounded"
          style={{ width: size, height: size }}
          aria-hidden="true"
        />
      )}
      {hasError ? (
        <div 
          className="flex items-center justify-center bg-gray-100 rounded text-gray-400 text-xs"
          style={{ width: size, height: size }}
          aria-hidden="true"
        >
          !
        </div>
      ) : (
        <Image
          src="/assets/icons/skyledger-icon.png"
          alt={decorative ? '' : alt}
          aria-hidden={decorative}
          width={size}
          height={size}
          className={isLoading ? 'opacity-0' : 'opacity-100'}
          priority={priority}
          sizes="(max-width: 768px) 24px, 32px"
          onLoad={() => setIsLoading(false)}
          onError={(e) => {
            console.error('Failed to load SkyLedger icon:', e)
            setHasError(true)
            setIsLoading(false)
          }}
        />
      )}
    </div>
  )
}
