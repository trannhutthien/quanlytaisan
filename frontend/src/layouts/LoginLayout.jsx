import { Layout } from 'antd'

const { Content } = Layout

const LoginLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
      <Content style={{ maxWidth: 400, width: '100%' }}>
        {children}
      </Content>
    </Layout>
  )
}

export default LoginLayout
