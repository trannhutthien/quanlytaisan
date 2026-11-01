import { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Popconfirm,
  Card,
  Select,
  DatePicker,
  InputNumber,
  Tag,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, QrcodeOutlined, DownloadOutlined } from '@ant-design/icons'
import taiSanApi from '../../api/taiSanApi'
import loaiTaiSanApi from '../../api/loaiTaiSanApi'
import donViApi from '../../api/donviApi'
import viTriApi from '../../api/vitriApi'
import trangThaiApi from '../../api/trangthaiApi'
import QRCodeModal from '../../components/QRCodeModal'
import dayjs from 'dayjs'

const { TextArea } = Input

const TaiSan = () => {
  const [data, setData] = useState([])
  const [loaiTaiSanList, setLoaiTaiSanList] = useState([])
  const [donViList, setDonViList] = useState([])
  const [viTriList, setViTriList] = useState([])
  const [allViTriList, setAllViTriList] = useState([])
  const [trangThaiList, setTrangThaiList] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [selectedTaiSan, setSelectedTaiSan] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchData()
    fetchLoaiTaiSan()
    fetchDonVi()
    fetchViTri()
    fetchTrangThai()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await taiSanApi.getAll()
      setData(response.data)
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const fetchLoaiTaiSan = async () => {
    try {
      const response = await loaiTaiSanApi.getAll()
      setLoaiTaiSanList(response.data)
    } catch (error) {
      console.error('Không thể tải danh sách loại tài sản:', error)
    }
  }

  const fetchDonVi = async () => {
    try {
      const response = await donViApi.getAll()
      setDonViList(response.data)
    } catch (error) {
      console.error('Không thể tải danh sách đơn vị:', error)
    }
  }

  const fetchViTri = async () => {
    try {
      const response = await viTriApi.getAll()
      setAllViTriList(response.data)
      setViTriList(response.data)
    } catch (error) {
      console.error('Không thể tải danh sách vị trí:', error)
    }
  }

  const fetchTrangThai = async () => {
    try {
      const response = await trangThaiApi.getAll()
      setTrangThaiList(response.data)
    } catch (error) {
      console.error('Không thể tải danh sách trạng thái:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      fetchData()
      return
    }

    try {
      setLoading(true)
      const response = await taiSanApi.search(searchKeyword)
      setData(response.data)
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể tìm kiếm')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingId(null)
    form.resetFields()
    
    // Generate auto asset code
    const nextCode = generateAssetCode()
    
    // Set default values
    form.setFieldsValue({
      mataisan: nextCode,
      ngaynhap: dayjs(),
      giatri: 0,
      trangthaitaisanId: 1, // Default: Available
    })
    setIsModalOpen(true)
  }

  const generateAssetCode = () => {
    if (data.length === 0) {
      return 'TS-0001'
    }
    
    // Find the highest number from existing asset codes
    const numbers = data
      .map(item => {
        const match = item.mataisan.match(/TS-(\d+)/)
        return match ? parseInt(match[1]) : 0
      })
      .filter(num => num > 0)
    
    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0
    const nextNumber = maxNumber + 1
    
    return `TS-${String(nextNumber).padStart(4, '0')}`
  }

  const handleEdit = async (record) => {
    setEditingId(record.taisanId)
    form.setFieldsValue({
      mataisan: record.mataisan,
      tentaisan: record.tentaisan,
      loaitaisanId: record.loaitaisanId,
      thongsokythuat: record.thongsokythuat,
      ngaynhap: record.ngaynhap ? dayjs(record.ngaynhap) : null,
      giatri: record.giatri,
      donviId: record.donviId,
      vitriId: record.vitriId,
      trangthaitaisanId: record.trangthaitaisanId,
      nguoisudungId: record.nguoisudungId,
    })
    
    // Filter vi tri by don vi
    if (record.donviId) {
      const filtered = allViTriList.filter(vt => vt.donvi?.donviId === record.donviId)
      setViTriList(filtered)
    }
    
    setIsModalOpen(true)
  }

  const handleDonViChange = (donviId) => {
    form.setFieldValue('vitriId', null)
    if (donviId) {
      const filtered = allViTriList.filter(vt => vt.donvi?.donviId === donviId)
      setViTriList(filtered)
    } else {
      setViTriList(allViTriList)
    }
  }

  const handleDelete = async (id) => {
    try {
      await taiSanApi.delete(id)
      message.success('Xóa tài sản thành công')
      fetchData()
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể xóa tài sản')
    }
  }

  const handleViewQR = (record) => {
    if (!record.qrCode) {
      message.warning('Mã QR chưa được tạo cho tài sản này')
      console.log('Record data:', record)
      return
    }
    setSelectedTaiSan(record)
    setIsQRModalOpen(true)
  }

  const handleDownloadQR = (record) => {
    if (!record.qrCode) {
      message.warning('Mã QR chưa được tạo cho tài sản này')
      console.log('Record data:', record)
      return
    }
    
    const link = document.createElement('a')
    link.href = record.qrCode
    link.download = `QR_${record.mataisan}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    message.success('Đã tải xuống mã QR')
  }

  const handleSubmit = async (values) => {
    try {
      const submitData = {
        ...values,
        ngaynhap: values.ngaynhap.format('YYYY-MM-DD'),
      }
      
      // Remove donviId before sending to backend
      delete submitData.donviId

      if (editingId) {
        await taiSanApi.update(editingId, submitData)
        message.success('Cập nhật tài sản thành công')
      } else {
        await taiSanApi.create(submitData)
        message.success('Thêm tài sản thành công')
      }
      setIsModalOpen(false)
      form.resetFields()
      fetchData()
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  const columns = [
    {
      title: 'Mã tài sản',
      dataIndex: 'mataisan',
      key: 'mataisan',
      width: 120,
      fixed: 'left',
    },
    {
      title: 'Tên tài sản',
      dataIndex: 'tentaisan',
      key: 'tentaisan',
      width: 200,
    },
    {
      title: 'Loại tài sản',
      dataIndex: 'tenloai',
      key: 'tenloai',
      width: 150,
    },
    {
      title: 'Giá trị',
      dataIndex: 'giatri',
      key: 'giatri',
      width: 150,
      render: (value) =>
        new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(value),
    },
    {
      title: 'Ngày nhập',
      dataIndex: 'ngaynhap',
      key: 'ngaynhap',
      width: 120,
      render: (date) => (date ? dayjs(date).format('DD/MM/YYYY') : '-'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'tentrangthai',
      key: 'tentrangthai',
      width: 130,
      render: (text) => {
        let color = 'default'
        if (text === 'Đang sử dụng') color = 'green'
        else if (text === 'Sẵn sàng') color = 'blue'
        else if (text === 'Bảo trì') color = 'orange'
        else if (text === 'Hỏng') color = 'red'
        return <Tag color={color}>{text}</Tag>
      },
    },
    {
      title: 'Vị trí',
      dataIndex: 'tenvitri',
      key: 'tenvitri',
      width: 150,
      render: (text) => text || '-',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 220,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small"
            icon={<QrcodeOutlined />} 
            onClick={() => handleViewQR(record)}
            title="Xem mã QR"
          >
            QR
          </Button>
          <Button 
            type="link" 
            size="small"
            icon={<DownloadOutlined />} 
            onClick={() => handleDownloadQR(record)}
            title="Tải mã QR"
          />
          <Button 
            type="link" 
            size="small"
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa tài sản này?"
            onConfirm={() => handleDelete(record.taisanId)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button 
              type="link" 
              size="small"
              danger 
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Card
      title="Quản lý Tài Sản"
      extra={
        <Space>
          <Input.Search
            placeholder="Tìm theo mã hoặc tên"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onSearch={handleSearch}
            style={{ width: 250 }}
            allowClear
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm tài sản
          </Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey="taisanId"
        loading={loading}
        scroll={{ x: 1300 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} tài sản`,
        }}
      />

      <Modal
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 24 }}>
            <span>{editingId ? 'Cập nhật tài sản' : 'Thêm tài sản'}</span>
            {!editingId && (
              <span style={{ fontSize: 14, fontWeight: 'normal', color: '#1890ff' }}>
                Mã TS: {form.getFieldValue('mataisan')}
              </span>
            )}
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
        }}
        width={800}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* Hidden field for mataisan */}
          <Form.Item name="mataisan" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="tentaisan"
            label="Tên tài sản"
            rules={[
              { required: true, message: 'Vui lòng nhập tên tài sản' },
              { max: 200, message: 'Tên tài sản không được quá 200 ký tự' },
            ]}
          >
            <Input placeholder="Nhập tên tài sản" />
          </Form.Item>

          <Form.Item
            name="loaitaisanId"
            label="Loại tài sản"
            rules={[{ required: true, message: 'Vui lòng chọn loại tài sản' }]}
          >
            <Select placeholder="Chọn loại tài sản">
              {loaiTaiSanList.map((item) => (
                <Select.Option key={item.loaitaisanId} value={item.loaitaisanId}>
                  {item.tenloai}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="donviId" label="Đơn vị">
            <Select placeholder="Chọn đơn vị" allowClear onChange={handleDonViChange}>
              {donViList.map((item) => (
                <Select.Option key={item.donviId} value={item.donviId}>
                  {item.tendonvi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="vitriId" label="Vị trí">
            <Select placeholder="Chọn vị trí" allowClear>
              {viTriList.map((item) => (
                <Select.Option key={item.vitriId} value={item.vitriId}>
                  {item.tenvitri}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="thongsokythuat" label="Thông số kỹ thuật">
            <TextArea rows={3} placeholder="Nhập thông số kỹ thuật" />
          </Form.Item>

          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              name="ngaynhap"
              label="Ngày nhập"
              rules={[{ required: true, message: 'Vui lòng chọn ngày nhập' }]}
              style={{ width: 200 }}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="giatri"
              label="Giá trị (VNĐ)"
              rules={[
                { required: true, message: 'Vui lòng nhập giá trị' },
                { type: 'number', min: 0, message: 'Giá trị phải lớn hơn hoặc bằng 0' },
              ]}
              style={{ flex: 1 }}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                placeholder="Nhập giá trị"
              />
            </Form.Item>
          </Space>

          <Form.Item
            name="trangthaitaisanId"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái">
              {trangThaiList.map((item) => (
                <Select.Option key={item.trangthaitaisanId} value={item.trangthaitaisanId}>
                  {item.tentrangthai}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  setIsModalOpen(false)
                  form.resetFields()
                }}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingId ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {selectedTaiSan && (
        <QRCodeModal
          visible={isQRModalOpen}
          onClose={() => {
            setIsQRModalOpen(false)
            setSelectedTaiSan(null)
          }}
          qrCode={selectedTaiSan.qrCode}
          mataisan={selectedTaiSan.mataisan}
          tentaisan={selectedTaiSan.tentaisan}
        />
      )}
    </Card>
  )
}

export default TaiSan
