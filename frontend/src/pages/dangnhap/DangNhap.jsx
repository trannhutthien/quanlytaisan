import { useState } from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const DangNhap = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values) => {
    setLoading(true)
    try {
      await login({
        tendangnhap: values.tenDangNhap,
        matkhau: values.matKhau
      })
      message.success('Đăng nhập thành công')
      navigate('/')
    } catch (error) {
      message.error(error.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card 
      title="Đăng nhập" 
      style={{ 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        maxWidth: 400,
        margin: '0 auto'
      }}
    >
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          name="tenDangNhap"
          rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="Tên đăng nhập" 
            size="large" 
            autoComplete="username"
          />
        </Form.Item>
        <Form.Item
          name="matKhau"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Mật khẩu" 
            size="large"
            autoComplete="current-password"
          />
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            size="large"
            loading={loading}
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
      <div style={{ marginTop: 16, textAlign: 'center', color: '#999', fontSize: 12 }}>
        <p>Tài khoản mặc định:</p>
        <p>Admin: <code>admin / admin123</code></p>
        <p>User: <code>user / user123</code></p>
      </div>
    </Card>
  )
}

export default DangNhap
