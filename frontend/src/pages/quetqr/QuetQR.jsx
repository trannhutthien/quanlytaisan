import { Card } from 'antd'
import { useNavigate } from 'react-router-dom'
import QrScanner from '../../components/QrScanner'

const QuetQR = () => {
  const navigate = useNavigate()

  const handleScanSuccess = (taisanId) => {
    navigate(`/assets/${taisanId}`)
  }

  return (
    <div>
      <h2>Quét mã QR</h2>
      <Card>
        <p style={{ marginBottom: 16 }}>
          Hướng camera vào mã QR trên tài sản để xem thông tin chi tiết
        </p>
        <QrScanner onScanSuccess={handleScanSuccess} />
      </Card>
    </div>
  )
}

export default QuetQR
