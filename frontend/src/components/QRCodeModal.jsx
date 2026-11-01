import { Modal, Button, Space } from 'antd'
import { DownloadOutlined, PrinterOutlined } from '@ant-design/icons'

const QRCodeModal = ({ visible, onClose, qrCode, mataisan, tentaisan }) => {
  const handleDownload = () => {
    // Tạo link download
    const link = document.createElement('a')
    link.href = qrCode
    link.download = `QR_${mataisan}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrint = () => {
    // Tạo cửa sổ in với chỉ QR code
    const printWindow = window.open('', '', 'width=600,height=600')
    printWindow.document.write(`
      <html>
        <head>
          <title>In mã QR - ${mataisan}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
            }
            .qr-container {
              text-align: center;
              padding: 20px;
            }
            img {
              max-width: 300px;
              border: 2px solid #000;
              padding: 10px;
            }
            h2 {
              margin: 10px 0;
            }
            p {
              margin: 5px 0;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <img src="${qrCode}" alt="QR Code ${mataisan}" />
            <h2>${mataisan}</h2>
            <p>${tentaisan}</p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  return (
    <Modal
      title="Mã QR tài sản"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="download" icon={<DownloadOutlined />} onClick={handleDownload}>
          Tải xuống
        </Button>,
        <Button key="print" icon={<PrinterOutlined />} onClick={handlePrint}>
          In mã
        </Button>,
        <Button key="close" type="primary" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={450}
      centered
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        {qrCode && (
          <>
            <img 
              src={qrCode} 
              alt={`QR Code ${mataisan}`} 
              style={{ 
                maxWidth: '100%', 
                border: '2px solid #d9d9d9',
                borderRadius: '8px',
                padding: '10px',
              }} 
            />
            <div style={{ marginTop: '16px' }}>
              <strong style={{ fontSize: '16px' }}>{mataisan}</strong>
              <div style={{ color: '#8c8c8c', marginTop: '4px' }}>{tentaisan}</div>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}

export default QRCodeModal
