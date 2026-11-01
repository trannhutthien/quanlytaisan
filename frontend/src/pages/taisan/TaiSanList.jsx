import { useState, useEffect } from 'react'
import { Table, Button, Input, Space, message } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import taisanApi from '../../api/taisanApi'
import StatusTag from '../../components/StatusTag'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useAuth } from '../../hooks/useAuth'
import { formatCurrency } from '../../utils/format'

const TaiSanList = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()

  const isAdmin = user?.vaitro === 'ADMIN'

  const fetchData = async () => {
    try {
      setLoading(true)
      const result = await taisanApi.getAll({ search: searchText })
      setData(result)
    } catch (error) {
      message.error('Không thể tải danh sách tài sản')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [searchText])

  const handleDelete = async (id) => {
    ConfirmDialog.delete({
      content: 'Bạn có chắc chắn muốn xóa tài sản này?',
      onOk: async () => {
        try {
          await taisanApi.delete(id)
          message.success('Xóa thành công')
          fetchData()
        } catch (error) {
          message.error('Xóa thất bại')
        }
      },
    })
  }

  const columns = [
    {
      title: 'Mã tài sản',
      dataIndex: 'maTaiSan',
      key: 'maTaiSan',
    },
    {
      title: 'Tên tài sản',
      dataIndex: 'tenTaiSan',
      key: 'tenTaiSan',
    },
    {
      title: 'Loại',
      dataIndex: 'tenloai',
      key: 'loai',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'tendonvi',
      key: 'donvi',
    },
    {
      title: 'Vị trí',
      dataIndex: 'tenvitri',
      key: 'vitri',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'tentrangthai',
      key: 'trangThai',
      render: (status) => <StatusTag status={status} />,
    },
    {
      title: 'Giá trị',
      dataIndex: 'giatri',
      key: 'giatri',
      render: (value) => formatCurrency(value),
    },
    isAdmin && {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/taisan/${record.taisanId}/sua`)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.taisanId)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ].filter(Boolean)

  return (
    <div>
      <h2>Danh sách Tài sản</h2>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm tài sản..."
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        {isAdmin && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/taisan/them')}>
            Thêm tài sản
          </Button>
        )}
      </Space>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="taisanId"
        loading={loading}
      />
    </div>
  )
}

export default TaiSanList
