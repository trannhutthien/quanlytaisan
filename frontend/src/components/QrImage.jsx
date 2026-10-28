import { useState, useEffect } from 'react'
import { Button, Spin, message } from 'antd'
import { PrinterOutlined } from '@ant-design/icons'
import taisanApi from '../api/taisanApi'

const QrImage = ({ taisanId }) => {
  const [imageUrl, setImageUrl] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        setLoading(true)
        const blob = await taisanApi.getQrCode(taisanId)
        const url = URL.createObjectURL(blob)
        setImageUrl(url)
      } catch (error) {
        message.error('Không thể tải mã QR')
      } finally {
        setLoading(false)
      }
    }

    if (taisanId) {
      fetchQrCode()
    }

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [taisanId])

  const handlePrint = () => {
    if (imageUrl) {
      const printWindow = window.open('', '_blank')
      printWindow.document.write(`
        <html>
          <head><title>In mã QR</title></head>
          <body style="text-align: center; padding: 20px;">
            <img src="${imageUrl}" style="max-width: 100%;" />
            <script>
              window.onload = () => {
                window.print();
                window.onafterprint = () => window.close();
              }
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  if (loading) {
    return <Spin />
  }

  if (!imageUrl) {
    return <div>Không có mã QR</div>
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <img src={imageUrl} alt="QR Code" style={{ maxWidth: '100%', marginBottom: 16 }} />
      <br />
      <Button icon={<PrinterOutlined />} onClick={handlePrint}>
        In mã QR
      </Button>
    </div>
  )
}

export default QrImage
