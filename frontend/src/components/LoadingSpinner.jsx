import { Spin } from 'antd'

/**
 * Component hiển thị loading spinner
 */
const LoadingSpinner = ({ size = 'default', tip = 'Đang tải...' }) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '200px' 
    }}>
      <Spin size={size} tip={tip} />
    </div>
  )
}

export default LoadingSpinner
