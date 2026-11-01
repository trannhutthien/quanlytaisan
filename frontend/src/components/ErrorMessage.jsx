import { Alert } from 'antd'

/**
 * Component hiển thị error message
 */
const ErrorMessage = ({ 
  message, 
  type = 'error', 
  showIcon = true,
  closable = false,
  onClose 
}) => {
  if (!message) return null
  
  return (
    <Alert
      message={message}
      type={type}
      showIcon={showIcon}
      closable={closable}
      onClose={onClose}
      style={{ marginBottom: 16 }}
    />
  )
}

export default ErrorMessage
