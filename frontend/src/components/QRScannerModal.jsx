import { Modal, Input, Button, Space, message } from 'antd'
import { QrcodeOutlined, CloseOutlined } from '@ant-design/icons'
import { useState } from 'react'

const QRScannerModal = ({ visible, onClose, onScan }) => {
  const [manualCode, setManualCode] = useState('')

  const handleManualSubmit = () => {
    if (!manualCode.trim()) {
      message.warning('Vui lòng nhập mã tài sản')
      return
    }
    onScan(manualCode.trim())
    setManualCode('')
  }

  return (
    <Modal
      title={
        <Space>
          <QrcodeOutlined />
          <span>Quét mã QR hoặc nhập mã thủ công</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
    >
      <div style={{ padding: '20px 0' }}>
        {/* Huong dan */}
        <div
          style={{
            background: '#f0f2f5',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >
          <p style={{ margin: 0, fontWeight: 500, marginBottom: 8 }}>
            📱 Hướng dẫn:
          </p>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>Sử dụng ứng dụng quét QR trên điện thoại</li>
            <li>Quét mã QR trên tem tài sản</li>
            <li>Hoặc nhập mã tài sản thủ công bên dưới</li>
          </ul>
        </div>

        {/* Nhap thu cong */}
        <div>
          <p style={{ fontWeight: 500, marginBottom: 8 }}>
            Nhập mã tài sản thủ công:
          </p>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder="Ví dụ: TS-0001"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              onPressEnter={handleManualSubmit}
              size="large"
            />
            <Button type="primary" size="large" onClick={handleManualSubmit}>
              Xác nhận
            </Button>
          </Space.Compact>
        </div>

        {/* Nut dong */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Button icon={<CloseOutlined />} onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default QRScannerModal
