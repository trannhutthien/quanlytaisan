import { useState, useEffect } from 'react'
import { Card, Select, Button, Result, Space, Tag, message, Radio } from 'antd'
import { QrcodeOutlined, CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons'
import kiemkeApi from '../../../api/kiemkeApi'
import viTriApi from '../../../api/vitriApi'
import taisanApi from '../../../api/taisanApi'
import QrScanner from '../../../components/QrScanner'
import { KET_QUA_KIEM_KE, KET_QUA_KIEM_KE_LABEL, TRANG_THAI_DOT_KIEM_KE } from '../../../utils/constants'

const QuetKiemKe = () => {
  const [dotKiemKeList, setDotKiemKeList] = useState([])
  const [selectedDot, setSelectedDot] = useState(null)
  const [viTriList, setViTriList] = useState([])
  const [scannedTaiSan, setScannedTaiSan] = useState(null)
  const [ketqua, setKetqua] = useState(null)
  const [vitrithucteId, setVitrithucteId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isScanning, setIsScanning] = useState(false)

  useEffect(() => {
    fetchDotKiemKe()
    fetchViTri()
  }, [])

  const fetchDotKiemKe = async () => {
    try {
      const response = await kiemkeApi.getAllDotKiemKe(TRANG_THAI_DOT_KIEM_KE.DANGMO)
      setDotKiemKeList(response.data)
    } catch (error) {
      message.error('Không thể tải danh sách đợt kiểm kê')
    }
  }

  const fetchViTri = async () => {
    try {
      const response = await viTriApi.getAll()
      setViTriList(response.data)
    } catch (error) {
      message.error('Không thể tải danh sách vị trí')
    }
  }

  const handleScan = async (mataisan) => {
    if (!selectedDot) {
      message.warning('Vui lòng chọn đợt kiểm kê trước')
      return
    }

    try {
      setLoading(true)
      setIsScanning(false)
      
      // Tìm tài sản theo mã
      const response = await taisanApi.getByMa(mataisan)
      setScannedTaiSan(response)
      setKetqua(null)
      setVitrithucteId(null)
    } catch (error) {
      message.error('Không tìm thấy tài sản với mã: ' + mataisan)
      setScannedTaiSan(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitKiemTra = async () => {
    if (!ketqua) {
      message.warning('Vui lòng chọn kết quả kiểm tra')
      return
    }

    if (ketqua === KET_QUA_KIEM_KE.LECHVITRI && !vitrithucteId) {
      message.warning('Vui lòng chọn vị trí thực tế')
      return
    }

    try {
      setLoading(true)
      const payload = {
        dotkiemkeId: selectedDot.dotkiemkeId,
        taisanId: scannedTaiSan.taisanId,
        ketqua: ketqua,
        vitrithucteId: ketqua === KET_QUA_KIEM_KE.LECHVITRI ? vitrithucteId : null,
      }

      await kiemkeApi.kiemTraTaiSan(payload)
      message.success('Lưu kết quả kiểm tra thành công')
      
      // Reset
      setScannedTaiSan(null)
      setKetqua(null)
      setVitrithucteId(null)
      setIsScanning(true)
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setScannedTaiSan(null)
    setKetqua(null)
    setVitrithucteId(null)
    setIsScanning(true)
  }

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <label style={{ marginBottom: 8, display: 'block', fontWeight: 500 }}>
              Chọn đợt kiểm kê:
            </label>
            <Select
              style={{ width: '100%' }}
              placeholder="Chọn đợt kiểm kê đang mở"
              value={selectedDot?.dotkiemkeId}
              onChange={(value) => {
                const dot = dotKiemKeList.find(d => d.dotkiemkeId === value)
                setSelectedDot(dot)
                setScannedTaiSan(null)
                setKetqua(null)
              }}
            >
              {dotKiemKeList.map(dot => (
                <Select.Option key={dot.dotkiemkeId} value={dot.dotkiemkeId}>
                  {dot.tendot} - {dot.tendonvi} ({dot.daKiem}/{dot.tongTaiSan})
                </Select.Option>
              ))}
            </Select>
          </div>

          {selectedDot && (
            <Card type="inner" size="small">
              <Space direction="vertical" size="small">
                <div><strong>Đợt:</strong> {selectedDot.tendot}</div>
                <div><strong>Đơn vị:</strong> {selectedDot.tendonvi}</div>
                <div><strong>Tiến độ:</strong> {selectedDot.daKiem}/{selectedDot.tongTaiSan} tài sản</div>
              </Space>
            </Card>
          )}
        </Space>
      </Card>

      {selectedDot && !scannedTaiSan && (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            {!isScanning ? (
              <>
                <QrcodeOutlined style={{ fontSize: 64, color: '#1890ff', marginBottom: 16 }} />
                <h3>Sẵn sàng quét mã QR</h3>
                <p>Nhấn nút bên dưới để bắt đầu quét</p>
                <Button 
                  type="primary" 
                  size="large"
                  icon={<QrcodeOutlined />}
                  onClick={() => setIsScanning(true)}
                >
                  Bắt đầu quét
                </Button>
              </>
            ) : (
              <div>
                <QrScanner
                  onScan={handleScan}
                  onError={(error) => message.error('Lỗi camera: ' + error)}
                />
                <Button 
                  style={{ marginTop: 16 }}
                  onClick={() => setIsScanning(false)}
                >
                  Dừng quét
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {scannedTaiSan && (
        <Card title="Thông tin tài sản">
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card type="inner">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div><strong>Mã tài sản:</strong> {scannedTaiSan.mataisan}</div>
                <div><strong>Tên tài sản:</strong> {scannedTaiSan.tentaisan}</div>
                <div><strong>Loại:</strong> {scannedTaiSan.tenloai}</div>
                <div><strong>Vị trí đăng ký:</strong> {scannedTaiSan.tenvitri || 'Chưa có'}</div>
                <div><strong>Đơn vị:</strong> {scannedTaiSan.tendonvi || 'Chưa có'}</div>
              </Space>
            </Card>

            <div>
              <label style={{ marginBottom: 8, display: 'block', fontWeight: 500 }}>
                Kết quả kiểm tra: <span style={{ color: 'red' }}>*</span>
              </label>
              <Radio.Group 
                value={ketqua} 
                onChange={(e) => setKetqua(e.target.value)}
                style={{ width: '100%' }}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Radio value={KET_QUA_KIEM_KE.CO}>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} /> {KET_QUA_KIEM_KE_LABEL.CO}
                  </Radio>
                  <Radio value={KET_QUA_KIEM_KE.LECHVITRI}>
                    <WarningOutlined style={{ color: '#faad14' }} /> {KET_QUA_KIEM_KE_LABEL.LECHVITRI}
                  </Radio>
                  <Radio value={KET_QUA_KIEM_KE.THIEU}>
                    <CloseCircleOutlined style={{ color: '#ff4d4f' }} /> {KET_QUA_KIEM_KE_LABEL.THIEU}
                  </Radio>
                </Space>
              </Radio.Group>
            </div>

            {ketqua === KET_QUA_KIEM_KE.LECHVITRI && (
              <div>
                <label style={{ marginBottom: 8, display: 'block', fontWeight: 500 }}>
                  Vị trí thực tế: <span style={{ color: 'red' }}>*</span>
                </label>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Chọn vị trí thực tế tìm thấy"
                  value={vitrithucteId}
                  onChange={setVitrithucteId}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {viTriList.map(vt => (
                    <Select.Option 
                      key={vt.vitriId} 
                      value={vt.vitriId}
                      label={`${vt.tenvitri} - ${vt.donvi?.tendonvi || ''}`}
                    >
                      {vt.tenvitri} - {vt.donvi?.tendonvi || ''}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            )}

            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleReset}>
                Quét lại
              </Button>
              <Button 
                type="primary" 
                loading={loading}
                onClick={handleSubmitKiemTra}
              >
                Lưu kết quả
              </Button>
            </Space>
          </Space>
        </Card>
      )}
    </div>
  )
}

export default QuetKiemKe
