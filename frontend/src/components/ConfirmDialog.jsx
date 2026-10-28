import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal

const ConfirmDialog = {
  show: ({ title, content, onOk, onCancel }) => {
    confirm({
      title: title || 'Xác nhận',
      icon: <ExclamationCircleOutlined />,
      content: content || 'Bạn có chắc chắn muốn thực hiện thao tác này?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk,
      onCancel,
    })
  },
  
  delete: ({ title, content, onOk }) => {
    confirm({
      title: title || 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: content || 'Bạn có chắc chắn muốn xóa? Thao tác này không thể hoàn tác.',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk,
    })
  },
}

export default ConfirmDialog
