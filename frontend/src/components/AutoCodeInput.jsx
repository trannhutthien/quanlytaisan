import { Input, Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'

/**
 * AutoCodeInput - Input component with auto-generated code and regenerate button
 * 
 * @param {string} prefix - Prefix for the code (e.g., 'DV', 'VT', 'TS')
 * @param {string} value - Current value
 * @param {function} onChange - Callback when value changes
 * @param {boolean} disabled - Whether the input is disabled (e.g., in edit mode)
 * @param {string} placeholder - Placeholder text
 * @param {function} onRegenerate - Optional custom regenerate function
 */
const AutoCodeInput = ({ 
  prefix = 'CODE',
  value,
  onChange,
  disabled = false,
  placeholder = 'Mã tự động',
  onRegenerate
}) => {
  
  // Default code generator
  const generateCode = () => {
    const timestamp = Date.now().toString().slice(-8)
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0')
    return `${prefix}${timestamp}${random}`
  }

  const handleRegenerate = (e) => {
    e.stopPropagation() // Prevent form events
    const newCode = onRegenerate ? onRegenerate() : generateCode()
    onChange?.(newCode)
  }

  return (
    <Input
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      readOnly={disabled}
      addonAfter={
        !disabled ? (
          <Button
            type="text"
            size="small"
            icon={<ReloadOutlined />}
            onClick={handleRegenerate}
            title="Tạo mã mới"
            style={{ border: 'none', padding: '0 8px' }}
          />
        ) : null
      }
    />
  )
}

export default AutoCodeInput
