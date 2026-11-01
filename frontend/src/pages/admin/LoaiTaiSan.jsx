import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm, Card } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import loaiTaiSanApi from '../../api/loaiTaiSanApi'
import dayjs from 'dayjs'

const LoaiTaiSan = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await loaiTaiSanApi.getAll()
      setData(response.data)
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingId(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (record) => {
    setEditingId(record.loaitaisanId)
    form.setFieldsValue({
      tenloai: record.tenloai
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    try {
      await loaiTaiSanApi.delete(id)
      message.success('Xóa loại tài sản thành công')
      fetchData()
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể xóa loại tài sản')
    }
  }

  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        await loaiTaiSanApi.update(editingId, values)
        message.success('Cập nhật loại tài sản thành công')
      } else {
        await loaiTaiSanApi.create(values)
        message.success('Thêm loại tài sản thành công')
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
      title: 'ID',
      dataIndex: 'loaitaisanId',
      key: 'loaitaisanId',
      width: 80,
    },
    {
      title: 'Tên loại tài sản',
      dataIndex: 'tenloai',
      key: 'tenloai',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-',
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa loại tài sản này?"
            onConfirm={() => handleDelete(record.loaitaisanId)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="link"
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
      title="Quản lý Loại Tài Sản"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm loại tài sản
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey="loaitaisanId"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} loại tài sản`,
        }}
      />

      <Modal
        title={editingId ? 'Cập nhật loại tài sản' : 'Thêm loại tài sản'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="tenloai"
            label="Tên loại tài sản"
            rules={[
              { required: true, message: 'Vui lòng nhập tên loại tài sản' },
              { max: 100, message: 'Tên loại tài sản không được quá 100 ký tự' },
            ]}
          >
            <Input placeholder="Nhập tên loại tài sản" />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setIsModalOpen(false)
                form.resetFields()
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingId ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default LoaiTaiSan
