import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm, Select, Segmented } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, AppstoreOutlined, BankOutlined, ApartmentOutlined, HomeOutlined } from '@ant-design/icons'
import donviApi from '../../../api/donviApi'
import ModalTitleWithCode from '../../../components/ModalTitleWithCode'
import { generateAutoCode } from '../../../hooks/useAutoCode'
import dayjs from 'dayjs'

const DonViTab = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [capDonVi, setCapDonVi] = useState('ALL')
  const [form] = Form.useForm()

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterDataByCapDonVi()
  }, [capDonVi, data])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await donviApi.getAll()
      setData(response.data)
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const filterDataByCapDonVi = () => {
    let filtered = []
    
    // Helper function để xác định cấp độ của đơn vị
    const getCapDonVi = (donvi) => {
      if (!donvi.donviCha) {
        return 0 // Cấp trường
      }
      
      // Tìm đơn vị cha trong data để kiểm tra ông nội
      const cha = data.find(dv => dv.donviId === donvi.donviCha.donviId)
      if (!cha) {
        return 1 // Không tìm thấy cha, giả định là cấp khoa
      }
      
      if (!cha.donviCha) {
        return 1 // Cha không có cha => đây là cấp khoa
      }
      
      return 2 // Cha có cha => đây là cấp phòng ban
    }
    
    switch (capDonVi) {
      case 'ALL':
        filtered = data
        break
      case 'TRUONG':
        filtered = data.filter(dv => getCapDonVi(dv) === 0)
        break
      case 'KHOA':
        filtered = data.filter(dv => getCapDonVi(dv) === 1)
        break
      case 'PHONGBAN':
        filtered = data.filter(dv => getCapDonVi(dv) === 2)
        break
      default:
        filtered = data
    }
    
    setFilteredData(filtered)
  }

  const handleAdd = () => {
    setEditingId(null)
    form.resetFields()
    // Generate auto code when adding
    const newCode = generateAutoCode('DV')
    form.setFieldsValue({ madonvi: newCode })
    setIsModalOpen(true)
  }

  const handleEdit = (record) => {
    setEditingId(record.donviId)
    form.setFieldsValue({
      madonvi: record.madonvi,
      tendonvi: record.tendonvi,
      donvichaId: record.donviCha?.donviId,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    try {
      await donviApi.delete(id)
      message.success('Xóa đơn vị thành công')
      fetchData()
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể xóa đơn vị')
    }
  }

  const handleSubmit = async (values) => {
    try {
      const payload = {
        madonvi: values.madonvi,
        tendonvi: values.tendonvi,
        donvichaId: values.donvichaId || null,
      }

      if (editingId) {
        await donviApi.update(editingId, payload)
        message.success('Cập nhật đơn vị thành công')
      } else {
        await donviApi.create(payload)
        message.success('Thêm đơn vị thành công')
      }
      setIsModalOpen(false)
      form.resetFields()
      fetchData()
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  // Filter out current editing item from parent selection
  const getParentOptions = () => {
    return data.filter(item => item.donviId !== editingId)
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'donviId',
      key: 'donviId',
      width: 60,
    },
    {
      title: 'Mã đơn vị',
      dataIndex: 'madonvi',
      key: 'madonvi',
      width: 120,
    },
    {
      title: 'Tên đơn vị',
      dataIndex: 'tendonvi',
      key: 'tendonvi',
      ellipsis: true,
    },
    {
      title: 'Đơn vị cha',
      dataIndex: ['donviCha', 'tendonvi'],
      key: 'donviCha',
      width: 150,
      ellipsis: true,
      render: (text) => text || '-',
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
            description="Bạn có chắc chắn muốn xóa đơn vị này?"
            onConfirm={() => handleDelete(record.donviId)}
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
      <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }} size="middle">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Segmented
            value={capDonVi}
            onChange={setCapDonVi}
            options={[
              {
                label: (
                  <div style={{ padding: '4px 8px' }}>
                    <AppstoreOutlined style={{ marginRight: 6 }} />
                    Tất cả
                  </div>
                ),
                value: 'ALL',
              },
              {
                label: (
                  <div style={{ padding: '4px 8px' }}>
                    <BankOutlined style={{ marginRight: 6 }} />
                    Cấp Trường
                  </div>
                ),
                value: 'TRUONG',
              },
              {
                label: (
                  <div style={{ padding: '4px 8px' }}>
                    <ApartmentOutlined style={{ marginRight: 6 }} />
                    Cấp Khoa
                  </div>
                ),
                value: 'KHOA',
              },
              {
                label: (
                  <div style={{ padding: '4px 8px' }}>
                    <HomeOutlined style={{ marginRight: 6 }} />
                    Cấp Phòng ban
                  </div>
                ),
                value: 'PHONGBAN',
              },
            ]}
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm đơn vị
          </Button>
        </div>

        <div style={{ fontSize: 14, color: '#8c8c8c' }}>
          Hiển thị: <strong>{filteredData.length}</strong> / {data.length} đơn vị
        </div>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="donviId"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} đơn vị`,
        }}
      />

      <Modal
        title={
          <ModalTitleWithCode
            title={editingId ? 'Cập nhật đơn vị' : 'Thêm đơn vị'}
            code={form.getFieldValue('madonvi')}
            codeLabel="Mã ĐV"
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
          <Form.Item name="madonvi" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="tendonvi"
            label="Tên đơn vị"
            rules={[
              { required: true, message: 'Vui lòng nhập tên đơn vị' },
              { max: 150, message: 'Tên đơn vị không được quá 150 ký tự' },
            ]}
          >
            <Input placeholder="Nhập tên đơn vị" />
          </Form.Item>

          <Form.Item
            name="donvichaId"
            label="Đơn vị cha"
          >
            <Select
              placeholder="Chọn đơn vị cha (không bắt buộc)"
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={getParentOptions().map(item => ({
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

export default DonViTab
