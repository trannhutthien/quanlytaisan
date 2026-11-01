import { useCallback } from 'react'

/**
 * Hook to generate automatic codes with prefix
 * 
 * @param {string} prefix - Prefix for the code (e.g., 'DV', 'VT', 'TS')
 * @returns {function} generateCode - Function to generate a new code
 * 
 * @example
 * const generateMaDonVi = useAutoCode('DV')
 * const code = generateMaDonVi() // Returns: DV1234567890
 */
const useAutoCode = (prefix = 'CODE') => {
  const generateCode = useCallback(() => {
    const timestamp = Date.now().toString().slice(-8)
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0')
    return `${prefix}${timestamp}${random}`
  }, [prefix])

  return generateCode
}

export default useAutoCode

/**
 * Utility function to generate code without hook
 * Useful for one-time generation
 * 
 * @param {string} prefix - Prefix for the code
 * @returns {string} Generated code
 * 
 * @example
 * import { generateAutoCode } from '../hooks/useAutoCode'
 * const code = generateAutoCode('DV') // Returns: DV1234567890
 */
export const generateAutoCode = (prefix = 'CODE') => {
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0')
  return `${prefix}${timestamp}${random}`
}
