import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Layout, Menu, Button, Dropdown } from 'antd'
import {
  DashboardOutlined,
  AppstoreOutlined,
  QrcodeOutlined,
  SwapOutlined,
  ToolOutlined,
  FileSearchOutlined,
  DatabaseOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { useAuth } from '../hooks/useAuth'

const { Header, Sider, Content } = Layout

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const isAdmin = user?.vaiTro === 'ADMIN'

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/'),
    },
    {
      key: '/taisan',
      icon: <AppstoreOutlined />,
      label: 'Tài sản',
      onClick: () => navigate('/taisan'),
    },
    {
      key: '/quetqr',
      icon: <QrcodeOutlined />,
      label: 'Quét QR',
      onClick: () => navigate('/quetqr'),
    },
    isAdmin && {
      key: '/luanchuyen',
      icon: <SwapOutlined />,
      label: 'Luân chuyển',
      onClick: () => navigate('/luanchuyen'),
    },
    {
      key: '/baotri',
      icon: <ToolOutlined />,
      label: 'Bảo trì',
      onClick: () => navigate('/baotri'),
    },
    isAdmin && {
      key: '/kiemke',
      icon: <FileSearchOutlined />,
      label: 'Kiểm kê',
      onClick: () => navigate('/kiemke'),
    },
    isAdmin && {
      key: '/danhmuc',
      icon: <DatabaseOutlined />,
      label: 'Danh mục',
      onClick: () => navigate('/danhmuc'),
    },
    isAdmin && {
      key: '/nguoidung',
      icon: <UserOutlined />,
      label: 'Người dùng',
      onClick: () => navigate('/nguoidung'),
    },
  ].filter(Boolean)

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: logout,
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6 }} />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/']}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 16px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button type="text" icon={<UserOutlined />}>
              {user?.hoTen}
            </Button>
          </Dropdown>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
