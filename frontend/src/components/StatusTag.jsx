import { Tag } from 'antd'

const statusConfig = {
  IN_USE: { label: 'Đang sử dụng', color: 'green' },
  AVAILABLE: { label: 'Còn trống', color: 'blue' },
  MAINTENANCE: { label: 'Bảo trì', color: 'orange' },
  BROKEN: { label: 'Hư hỏng', color: 'red' },
}

const StatusTag = ({ status }) => {
  const config = statusConfig[status]
  if (!config) return <Tag>{status}</Tag>
  
  return <Tag color={config.color}>{config.label}</Tag>
}

export default StatusTag
