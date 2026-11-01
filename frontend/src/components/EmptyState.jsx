import { Empty, Button } from 'antd'

/**
 * Component hiển thị khi không có dữ liệu
 */
const EmptyState = ({ 
  message = 'Không có dữ liệu',
  description,
  icon,
  action,
  actionText = 'Thêm mới',
  onAction
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '300px',
      flexDirection: 'column'
    }}>
      <Empty 
        image={icon || Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div>
            <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>
              {message}
            </div>
            {description && (
              <div style={{ color: '#999' }}>{description}</div>
            )}
          </div>
        }
      >
        {action && onAction && (
          <Button type="primary" onClick={onAction}>
            {actionText}
          </Button>
        )}
      </Empty>
    </div>
  )
}

export default EmptyState
