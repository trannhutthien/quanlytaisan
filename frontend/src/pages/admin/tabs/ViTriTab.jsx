import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm, Select } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import viTriApi from '../../../api/vitriApi'
import donviApi from '../../../api/donviApi'
import ModalTitleWithCode from '../../../components/ModalTitleWithCode'
import { generateAutoCode } from '../../../hooks/useAutoCode'
import dayjs from 'dayjs'

const ViTriTab = () => {
  const [data, setData] = useState([])
  const [donViList, setDonViList] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchData()
    fetchDonVi()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await viTriApi.getAll()
      setData(response.data)
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const fetchDonVi = async () => {
    try {
      const response = await donviApi.getAll()
      setDonViList(response.data)
    } catch (error) {
      message.error('Không thể tải danh sách đơn vị')
    }
  }

  const handleAdd = () => {
    setEditingId(null)
    form.resetFields()
    // Generate auto code when adding
    const newCode = generateAutoCode('VT')
    form.setFieldsValue({ mavitri: newCode })
    setIsModalOpen(true)
  }

  const handleEdit = (record) => {
    setEditingId(record.vitriId)
    form.setFieldsValue({
      mavitri: record.mavitri,
      tenvitri: record.tenvitri,
      donviId: record.donvi?.donviId,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    try {
      await viTriApi.delete(id)
      message.success('Xóa vị trí thành công')
      fetchData()
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể xóa vị trí')
    }
  }

  const handleSubmit = async (values) => {
    try {
      const payload = {
        mavitri: values.mavitri,
        tenvitri: values.tenvitri,
        donviId: values.donviId,
      }

      if (editingId) {
        await viTriApi.update(editingId, payload)
        message.success('Cập nhật vị trí thành công')
      } else {
        await viTriApi.create(payload)
        message.success('Thêm vị trí thành công')
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
      dataIndex: 'vitriId',
      key: 'vitriId',
      width: 60,
    },
    {
      title: 'Mã vị trí',
      dataIndex: 'mavitri',
      key: 'mavitri',
      width: 120,
    },
    {
      title: 'Tên vị trí',
      dataIndex: 'tenvitri',
      key: 'tenvitri',
      ellipsis: true,
    },
    {
      title: 'Đơn vị',
      dataIndex: ['donvi', 'tendonvi'],
      key: 'donvi',
      width: 150,
      ellipsis: true,
      render: (text, record) => record.donvi?.tendonvi || '-',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 140,
      render: (_, record) => (
        <Space>
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
            description="Bạn có chắc chắn muốn xóa vị trí này?"
            onConfirm={() => handleDelete(record.vitriId)}
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
    <>
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm vị trí
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="vitriId"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} vị trí`,
        }}
      />

      <Modal
        title={
          <ModalTitleWithCode
            title={editingId ? 'Cập nhật vị trí' : 'Thêm vị trí'}
            code={form.getFieldValue('mavitri')}
            codeLabel="Mã VT"
            isEditMode={!!editingId}
          />
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item name="mavitri" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="tenvitri"
            label="Tên vị trí"
            rules={[
              { required: true, message: 'Vui lòng nhập tên vị trí' },
              { max: 150, message: 'Tên vị trí không được quá 150 ký tự' },
            ]}
          >
            <Input placeholder="Nhập tên vị trí" />
          </Form.Item>

          <Form.Item
            name="donviId"
            label="Đơn vị"
            rules={[
              { required: true, message: 'Vui lòng chọn đơn vị' },
            ]}
          >
            <Select
              placeholder="Chọn đơn vị"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={donViList.map(item => ({
                value: item.donviId,
                label: `${item.madonvi} - ${item.tendonvi}`,
              }))}
            />
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
    </>
  )
}

export default ViTriTab
