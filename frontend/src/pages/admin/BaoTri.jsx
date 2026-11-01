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
  Row,
  Col,
  Statistic,
  Tabs,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  QrcodeOutlined,
  BarChartOutlined,
  ToolOutlined,
} from '@ant-design/icons'
import baoTriApi from '../../api/baoTriApi'
import taiSanApi from '../../api/taiSanApi'
import dayjs from 'dayjs'
import QRScannerModal from '../../components/QRScannerModal'

const { TextArea } = Input
const { TabPane } = Tabs

const BaoTri = () => {
  const [data, setData] = useState([])
  const [taiSanList, setTaiSanList] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [filterTrangThai, setFilterTrangThai] = useState(null)
  const [thongKe, setThongKe] = useState(null)
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false)
  const [form] = Form.useForm()
  const [updateForm] = Form.useForm()

  useEffect(() => {
    fetchData()
    fetchTaiSan()
    fetchThongKe()
  }, [filterTrangThai])

  const fetchData = async () => {
    try {
      setLoading(true)
      let response
      if (filterTrangThai) {
        response = await baoTriApi.getByTrangThai(filterTrangThai)
      } else {
        response = await baoTriApi.getAll()
      }
      setData(response.data)
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const fetchTaiSan = async () => {
    try {
      const response = await taiSanApi.getAll()
      setTaiSanList(response.data)
    } catch (error) {
      console.error('Không thể tải danh sách tài sản:', error)
    }
  }

  const fetchThongKe = async () => {
    try {
      const response = await baoTriApi.getThongKe()
      setThongKe(response.data)
    } catch (error) {
      console.error('Không thể tải thống kê:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      fetchData()
      return
    }

    try {
      setLoading(true)
      const response = await baoTriApi.search(searchKeyword)
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
    form.setFieldsValue({
      ngaybao: dayjs(),
      loaibaotri: 'SUACHUA',
    })
    setIsModalOpen(true)
  }

  const handleQRScan = () => {
    setIsQRScannerOpen(true)
  }

  const handleQRScanned = async (mataisan) => {
    try {
      // Tim tai san theo ma
      const response = await taiSanApi.getByMa(mataisan)
      const taiSan = response.data
      
      // Mo form tao phieu bao tri voi tai san da chon
      form.resetFields()
      form.setFieldsValue({
        taisanId: taiSan.taisanId,
        ngaybao: dayjs(),
        loaibaotri: 'SUACHUA',
      })
      setIsModalOpen(true)
      setIsQRScannerOpen(false)
      message.success(`Đã quét tài sản: ${taiSan.mataisan}`)
    } catch (error) {
      message.error('Không tìm thấy tài sản với mã QR này')
    }
  }

  const handleUpdate = (record) => {
    setEditingId(record.baotriId)
    updateForm.setFieldsValue({
      trangthaixuly: record.trangthaixuly,
      chiphi: record.chiphi,
      ketqua: record.ketqua,
      ngayhoanthanh: record.ngayhoanthanh ? dayjs(record.ngayhoanthanh) : null,
      ngaybaotritieptheo: record.ngaybaotritieptheo ? dayjs(record.ngaybaotritieptheo) : null,
    })
    setIsUpdateModalOpen(true)
  }

  const handleDelete = async (id) => {
    try {
      await baoTriApi.delete(id)
      message.success('Xóa phiếu bảo trì thành công')
      fetchData()
      fetchThongKe()
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể xóa phiếu bảo trì')
    }
  }

  const handleSubmit = async (values) => {
    try {
      const submitData = {
        ...values,
        ngaybao: values.ngaybao.format('YYYY-MM-DD'),
      }

      await baoTriApi.create(submitData)
      message.success('Thêm phiếu bảo trì thành công')
      setIsModalOpen(false)
      form.resetFields()
      fetchData()
      fetchThongKe()
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  const handleUpdateSubmit = async (values) => {
    try {
      const submitData = {
        ...values,
        ngayhoanthanh: values.ngayhoanthanh ? values.ngayhoanthanh.format('YYYY-MM-DD') : null,
        ngaybaotritieptheo: values.ngaybaotritieptheo ? values.ngaybaotritieptheo.format('YYYY-MM-DD') : null,
      }

      await baoTriApi.update(editingId, submitData)
      message.success('Cập nhật phiếu bảo trì thành công')
      setIsUpdateModalOpen(false)
      updateForm.resetFields()
      fetchData()
      fetchThongKe()
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  const getTrangThaiColor = (trangthai) => {
    const colors = {
      CHOXULY: 'orange',
      DANGXULY: 'blue',
      HOANTHANH: 'green',
      DAHUY: 'red',
    }
    return colors[trangthai] || 'default'
  }

  const getTrangThaiText = (trangthai) => {
    const texts = {
      CHOXULY: 'Chờ xử lý',
      DANGXULY: 'Đang xử lý',
      HOANTHANH: 'Hoàn thành',
      DAHUY: 'Đã hủy',
    }
    return texts[trangthai] || trangthai
  }

  const getLoaiBaoTriText = (loai) => {
    return loai === 'SUACHUA' ? 'Sửa chữa' : 'Định kỳ'
  }

  const columns = [
    {
      title: 'Mã phiếu',
      dataIndex: 'baotriId',
      key: 'baotriId',
      width: 100,
      render: (id) => `BT-${String(id).padStart(4, '0')}`,
    },
    {
      title: 'Mã tài sản',
      dataIndex: 'mataisan',
      key: 'mataisan',
      width: 120,
    },
    {
      title: 'Tên tài sản',
      dataIndex: 'tentaisan',
      key: 'tentaisan',
      width: 200,
    },
    {
      title: 'Loại',
      dataIndex: 'loaibaotri',
      key: 'loaibaotri',
      width: 100,
      render: (loai) => (
        <Tag color={loai === 'DINHKY' ? 'blue' : 'orange'}>
          {getLoaiBaoTriText(loai)}
        </Tag>
      ),
    },
    {
      title: 'Ngày báo',
      dataIndex: 'ngaybao',
      key: 'ngaybao',
      width: 120,
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangthaixuly',
      key: 'trangthaixuly',
      width: 130,
      render: (trangthai) => (
        <Tag color={getTrangThaiColor(trangthai)}>
          {getTrangThaiText(trangthai)}
        </Tag>
      ),
    },
    {
      title: 'Chi phí',
      dataIndex: 'chiphi',
      key: 'chiphi',
      width: 130,
      render: (value) =>
        new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(value),
    },
    {
      title: 'Người báo',
      dataIndex: 'hotennguoibao',
      key: 'hotennguoibao',
      width: 150,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleUpdate(record)}
          >
            Cập nhật
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa phiếu bảo trì này?"
            onConfirm={() => handleDelete(record.baotriId)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Card title="Quản lý Bảo Trì">
      {/* Thong ke */}
      {thongKe && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng số phiếu"
                value={thongKe.tongSoPhieu}
                prefix={<ToolOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Chờ xử lý"
                value={thongKe.soPhieuChoXuLy}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Đang xử lý"
                value={thongKe.soPhieuDangXuLy}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Hoàn thành"
                value={thongKe.soPhieuHoanThanh}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {thongKe && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Tổng chi phí"
                value={thongKe.tongChiPhi}
                precision={0}
                suffix="đ"
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Chi phí tháng này"
                value={thongKe.chiPhiThang}
                precision={0}
                suffix="đ"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Chi phí năm nay"
                value={thongKe.chiPhiNam}
                precision={0}
                suffix="đ"
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Controls */}
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Space>
          <Select
            placeholder="Lọc theo trạng thái"
            style={{ width: 200 }}
            allowClear
            value={filterTrangThai}
            onChange={setFilterTrangThai}
          >
            <Select.Option value="CHOXULY">Chờ xử lý</Select.Option>
            <Select.Option value="DANGXULY">Đang xử lý</Select.Option>
            <Select.Option value="HOANTHANH">Hoàn thành</Select.Option>
            <Select.Option value="DAHUY">Đã hủy</Select.Option>
          </Select>
          <Input.Search
            placeholder="Tìm theo mã tài sản"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onSearch={handleSearch}
            style={{ width: 250 }}
            allowClear
          />
        </Space>
        <Space>
          <Button icon={<QrcodeOutlined />} onClick={handleQRScan}>
            Quét QR
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Tạo phiếu bảo trì
          </Button>
        </Space>
      </Space>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={data}
        rowKey="baotriId"
        loading={loading}
        scroll={{ x: 1200 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} phiếu`,
        }}
      />

      {/* Modal tao phieu bao tri */}
      <Modal
        title="Tạo phiếu bảo trì"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
        }}
        width={700}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="taisanId"
            label="Tài sản"
            rules={[{ required: true, message: 'Vui lòng chọn tài sản' }]}
          >
            <Select
              placeholder="Chọn tài sản"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={taiSanList.map((ts) => ({
                value: ts.taisanId,
                label: `${ts.mataisan} - ${ts.tentaisan}`,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="loaibaotri"
            label="Loại bảo trì"
            rules={[{ required: true, message: 'Vui lòng chọn loại bảo trì' }]}
          >
            <Select placeholder="Chọn loại bảo trì">
              <Select.Option value="SUACHUA">Sửa chữa</Select.Option>
              <Select.Option value="DINHKY">Định kỳ</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="ngaybao"
            label="Ngày báo"
            rules={[{ required: true, message: 'Vui lòng chọn ngày báo' }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="motahuhong" label="Mô tả vấn đề">
            <TextArea rows={4} placeholder="Nhập mô tả vấn đề cần bảo trì" />
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
                Tạo phiếu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal cap nhat tien do */}
      <Modal
        title="Cập nhật tiến độ bảo trì"
        open={isUpdateModalOpen}
        onCancel={() => {
          setIsUpdateModalOpen(false)
          updateForm.resetFields()
        }}
        width={700}
        footer={null}
      >
        <Form form={updateForm} layout="vertical" onFinish={handleUpdateSubmit}>
          <Form.Item
            name="trangthaixuly"
            label="Trạng thái xử lý"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="CHOXULY">Chờ xử lý</Select.Option>
              <Select.Option value="DANGXULY">Đang xử lý</Select.Option>
              <Select.Option value="HOANTHANH">Hoàn thành</Select.Option>
              <Select.Option value="DAHUY">Đã hủy</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="chiphi" label="Chi phí (VNĐ)">
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Nhập chi phí"
              min={0}
            />
          </Form.Item>

          <Form.Item name="ketqua" label="Kết quả xử lý">
            <TextArea rows={4} placeholder="Nhập kết quả xử lý" />
          </Form.Item>

          <Form.Item name="ngayhoanthanh" label="Ngày hoàn thành">
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="ngaybaotritieptheo" label="Ngày bảo trì tiếp theo">
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  setIsUpdateModalOpen(false)
                  updateForm.resetFields()
                }}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* QR Scanner Modal */}
      {isQRScannerOpen && (
        <QRScannerModal
          visible={isQRScannerOpen}
          onClose={() => setIsQRScannerOpen(false)}
          onScan={handleQRScanned}
        />
      )}
    </Card>
  )
}

export default BaoTri
