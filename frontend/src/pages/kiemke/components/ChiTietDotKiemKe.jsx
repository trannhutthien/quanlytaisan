import { useState, useEffect } from 'react'
import { Modal, Table, Tag, Space, Spin, message } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import kiemkeApi from '../../../api/kiemkeApi'
import { KET_QUA_KIEM_KE, KET_QUA_KIEM_KE_LABEL, KET_QUA_KIEM_KE_COLOR } from '../../../utils/constants'
import dayjs from 'dayjs'

const ChiTietDotKiemKe = ({ visible, dotKiemKe, onClose }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (visible && dotKiemKe) {
      fetchChiTiet()
    }
  }, [visible, dotKiemKe])

  const fetchChiTiet = async () => {
    try {
      setLoading(true)
      const response = await kiemkeApi.getChiTietKiemKe(dotKiemKe.dotkiemkeId)
      setData(response.data)
    } catch (error) {
      message.error('Không thể tải chi tiết kiểm kê')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Mã tài sản',
      dataIndex: 'mataisan',
      key: 'mataisan',
      width: 130,
    },
    {
      title: 'Tên tài sản',
      dataIndex: 'tentaisan',
      key: 'tentaisan',
      width: 200,
    },
    {
      title: 'Loại',
      dataIndex: 'tenloai',
      key: 'tenloai',
      width: 120,
    },
    {
      title: 'Vị trí đăng ký',
      key: 'vitridangky',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{record.tenvitri || '-'}</div>
          <div style={{ fontSize: 12, color: '#888' }}>{record.tendonvi || '-'}</div>
        </div>
      ),
    },
    {
      title: 'Kết quả',
      dataIndex: 'ketqua',
      key: 'ketqua',
      width: 140,
      render: (ketqua) => {
        if (!ketqua) {
          return (
            <Tag icon={<QuestionCircleOutlined />} color="default">
              Chưa kiểm
            </Tag>
          )
        }
        
        const icon = {
          [KET_QUA_KIEM_KE.CO]: <CheckCircleOutlined />,
          [KET_QUA_KIEM_KE.LECHVITRI]: <WarningOutlined />,
          [KET_QUA_KIEM_KE.THIEU]: <CloseCircleOutlined />,
        }[ketqua]
        
        return (
          <Tag icon={icon} color={KET_QUA_KIEM_KE_COLOR[ketqua]}>
            {KET_QUA_KIEM_KE_LABEL[ketqua]}
          </Tag>
        )
      },
      filters: [
        { text: 'Chưa kiểm', value: null },
        { text: KET_QUA_KIEM_KE_LABEL.CO, value: KET_QUA_KIEM_KE.CO },
        { text: KET_QUA_KIEM_KE_LABEL.LECHVITRI, value: KET_QUA_KIEM_KE.LECHVITRI },
        { text: KET_QUA_KIEM_KE_LABEL.THIEU, value: KET_QUA_KIEM_KE.THIEU },
      ],
      onFilter: (value, record) => {
        if (value === null) return !record.ketqua
        return record.ketqua === value
      },
    },
    {
      title: 'Vị trí thực tế',
      key: 'vitrithucte',
      width: 150,
      render: (_, record) => {
        if (record.ketqua !== KET_QUA_KIEM_KE.LECHVITRI) return '-'
        return (
          <div>
            <div>{record.tenvitrithucte || '-'}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{record.tendonvithucte || '-'}</div>
          </div>
        )
      },
    },
    {
      title: 'Người kiểm',
      dataIndex: 'hotennguoikiem',
      key: 'hotennguoikiem',
      width: 130,
      render: (text) => text || '-',
    },
    {
      title: 'Thời gian kiểm',
      dataIndex: 'thoigiankiem',
      key: 'thoigiankiem',
      width: 140,
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-',
    },
  ]

  return (
    <Modal
      title={`Chi tiết: ${dotKiemKe?.tendot}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1200}
      style={{ top: 20 }}
    >
      <Spin spinning={loading}>
        <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
          <div><strong>Đơn vị:</strong> {dotKiemKe?.tendonvi}</div>
          <div>
            <strong>Tiến độ:</strong> {dotKiemKe?.daKiem}/{dotKiemKe?.tongTaiSan} tài sản 
            ({dotKiemKe?.tongTaiSan > 0 ? Math.round((dotKiemKe?.daKiem / dotKiemKe?.tongTaiSan) * 100) : 0}%)
          </div>
          <div>
            <strong>Kết quả:</strong>{' '}
            <Tag color="success">Có: {dotKiemKe?.coMatDungViTri}</Tag>
            <Tag color="warning">Lệch vị trí: {dotKiemKe?.coMatLechViTri}</Tag>
            <Tag color="error">Thiếu: {dotKiemKe?.thieu}</Tag>
          </div>
        </Space>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="chitietkiemkeId"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} tài sản`,
          }}
          scroll={{ x: 1100 }}
        />
      </Spin>
    </Modal>
  )
}

export default ChiTietDotKiemKe
