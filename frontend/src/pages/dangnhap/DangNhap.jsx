import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const DangNhap = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form] = Form.useForm()

  const onFinish = async (values) => {
    try {
      await login(values)
      message.success('Đăng nhập thành công')
      navigate('/')
    } catch (error) {
      message.error('Tên đăng nhập hoặc mật khẩu không đúng')
    }
  }

  return (
    <Card title="Đăng nhập" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="tenDangNhap"
          rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" size="large" />
        </Form.Item>
        <Form.Item
          name="matKhau"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large">
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default DangNhap
