import { useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { message } from 'antd'

const QrScanner = ({ onScanSuccess, onScanError }) => {
  const scannerRef = useRef(null)
  const html5QrcodeRef = useRef(null)

  useEffect(() => {
    const startScanner = async () => {
      try {
        html5QrcodeRef.current = new Html5Qrcode('qr-reader')
        
        await html5QrcodeRef.current.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            // Lấy taisan_id từ URL: https://domain.com/assets/{taisan_id}
            const match = decodedText.match(/\/assets\/(\d+)/)
            if (match && match[1]) {
              onScanSuccess(match[1])
            } else {
              message.warning('Mã QR không hợp lệ')
              if (onScanError) onScanError('Invalid QR format')
            }
          },
          (errorMessage) => {
            // Không xử lý lỗi liên tục khi quét
          }
        )
      } catch (error) {
        message.error('Không thể mở camera. Vui lòng kiểm tra quyền truy cập.')
        if (onScanError) onScanError(error)
      }
    }

    startScanner()

    return () => {
      if (html5QrcodeRef.current) {
        html5QrcodeRef.current.stop().catch((err) => console.error('Error stopping scanner:', err))
      }
    }
  }, [onScanSuccess, onScanError])

  return (
    <div>
      <div id="qr-reader" ref={scannerRef} style={{ width: '100%' }} />
    </div>
  )
}

export default QrScanner
