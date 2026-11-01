import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
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
  BugOutlined,
  TagsOutlined,
  InboxOutlined,
  ApartmentOutlined,
} from '@ant-design/icons'
import { useAuth } from '../hooks/useAuth'

const { Header, Sider, Content } = Layout

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const isAdmin = user?.vaitro === 'ADMIN'

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/'),
    },
    {
      key: '/test',
      icon: <BugOutlined />,
      label: 'Test API',
      onClick: () => navigate('/test'),
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
    isAdmin && {
      key: '/admin/bao-tri',
      icon: <ToolOutlined />,
      label: 'Bảo trì',
      onClick: () => navigate('/admin/bao-tri'),
    },
    isAdmin && {
      key: '/kiemke',
      icon: <FileSearchOutlined />,
      label: 'Kiểm kê',
      onClick: () => navigate('/kiemke'),
    },
    isAdmin && {
      key: 'admin',
      icon: <DatabaseOutlined />,
      label: 'Quản lý',
      children: [
        {
          key: '/admin/loai-tai-san',
          icon: <TagsOutlined />,
          label: 'Loại tài sản',
          onClick: () => navigate('/admin/loai-tai-san'),
        },
        {
          key: '/admin/tai-san',
          icon: <InboxOutlined />,
          label: 'Tài sản',
          onClick: () => navigate('/admin/tai-san'),
        },
        {
          key: '/admin/don-vi-vi-tri',
          icon: <ApartmentOutlined />,
          label: 'Đơn vị & Vị trí',
          onClick: () => navigate('/admin/don-vi-vi-tri'),
        },
        {
          key: '/danhmuc',
          icon: <DatabaseOutlined />,
          label: 'Danh mục khác',
          onClick: () => navigate('/danhmuc'),
        },
      ],
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
        <div style={{ 
          height: 32, 
          margin: 16, 
          background: 'rgba(255, 255, 255, 0.2)', 
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
        }}>
          {!collapsed && 'QL Tài Sản QR'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['admin']}
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
              {user?.hoten || user?.tendangnhap}
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
