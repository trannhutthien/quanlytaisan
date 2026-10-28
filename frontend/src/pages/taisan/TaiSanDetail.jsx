import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Descriptions, Spin, message, Tabs } from 'antd'
import taisanApi from '../../api/taisanApi'
import StatusTag from '../../components/StatusTag'
import QrImage from '../../components/QrImage'
import { formatCurrency, formatDate } from '../../utils/format'

const TaiSanDetail = () => {
  const { id } = useParams()
  const [taisan, setTaisan] = useState(null)
  const [lichsu, setLichsu] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [taisanData, lichsuData] = await Promise.all([
          taisanApi.getById(id),
          taisanApi.getLichSu(id),
        ])
        setTaisan(taisanData)
        setLichsu(lichsuData)
      } catch (error) {
        message.error('Không thể tải thông tin tài sản')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return <Spin size="large" />
  }

  if (!taisan) {
    return <div>Không tìm thấy tài sản</div>
  }

  const items = [
    {
      key: 'thongtin',
      label: 'Thông tin',
      children: (
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Mã tài sản">{taisan.maTaiSan}</Descriptions.Item>
          <Descriptions.Item label="Tên tài sản">{taisan.tenTaiSan}</Descriptions.Item>
          <Descriptions.Item label="Loại">{taisan.loaiTaiSan?.tenLoai}</Descriptions.Item>
          <Descriptions.Item label="Đơn vị">{taisan.donVi?.tenDonVi}</Descriptions.Item>
          <Descriptions.Item label="Vị trí">{taisan.viTri?.tenViTri}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <StatusTag status={taisan.trangThai} />
          </Descriptions.Item>
          <Descriptions.Item label="Giá trị ban đầu">
            {formatCurrency(taisan.giaTriBanDau)}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày mua">
            {formatDate(taisan.ngayMua)}
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả" span={2}>
            {taisan.moTa || 'Không có'}
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: 'qrcode',
      label: 'Mã QR',
      children: <QrImage taisanId={id} />,
    },
    {
      key: 'lichsu',
      label: 'Lịch sử',
      children: (
        <div>
          {lichsu.length > 0 ? (
            lichsu.map((item, index) => (
              <Card key={index} style={{ marginBottom: 8 }}>
                <p><strong>{formatDate(item.ngayThucHien)}:</strong> {item.moTa}</p>
              </Card>
            ))
          ) : (
            <p>Chưa có lịch sử</p>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <h2>Chi tiết Tài sản</h2>
      <Tabs items={items} />
    </div>
  )
}

export default TaiSanDetail
