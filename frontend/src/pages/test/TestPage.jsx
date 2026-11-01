import { useState } from 'react'
import { Card, Button, Space, message, Divider, Row, Col, Input } from 'antd'
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ThunderboltOutlined,
  DatabaseOutlined,
  BugOutlined
} from '@ant-design/icons'
import testApi from '../../api/testApi'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import EmptyState from '../../components/EmptyState'

const TestPage = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [entityId, setEntityId] = useState('')

  const handleTest = async (testFn, testName) => {
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      const response = await testFn()
      setResult({
        name: testName,
        success: true,
        data: response
      })
      message.success(`${testName} thành công!`)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
      setResult({
        name: testName,
        success: false,
        error: err.response?.data || err.message
      })
      message.error(`${testName} thất bại!`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>🧪 Test Backend Integration</h2>
      <p>Trang test kết nối giữa Frontend và Backend</p>

      <Row gutter={[16, 16]}>
        {/* Test Basic Connection */}
        <Col span={12}>
          <Card 
            title={<><CheckCircleOutlined /> Test Kết nối</>}
            extra={
              <Button 
                type="primary" 
                onClick={() => handleTest(testApi.hello, 'Test Hello')}
                loading={loading}
              >
                Test
              </Button>
            }
          >
            <p>Test kết nối cơ bản với backend</p>
            <code>GET /api/test/hello</code>
          </Card>
        </Col>

        {/* Test Enums */}
        <Col span={12}>
          <Card 
            title={<><ThunderboltOutlined /> Test Enums</>}
            extra={
              <Button 
                onClick={() => handleTest(testApi.getEnums, 'Test Enums')}
                loading={loading}
              >
                Test
              </Button>
            }
          >
            <p>Test các enum (TrangThaiTaiSan, VaiTro)</p>
            <code>GET /api/test/enums</code>
          </Card>
        </Col>

        {/* Test BaseEntity - Create */}
        <Col span={12}>
          <Card 
            title={<><DatabaseOutlined /> Test BaseEntity - Create</>}
            extra={
              <Button 
                onClick={() => handleTest(
                  () => testApi.createTestEntity({
                    name: 'Test Item ' + Date.now(),
                    description: 'Testing BaseEntity'
                  }),
                  'Create Entity'
                )}
                loading={loading}
              >
                Create
              </Button>
            }
          >
            <p>Test tạo entity mới (createdAt tự động)</p>
            <code>POST /api/test/base-entity</code>
          </Card>
        </Col>

        {/* Test BaseEntity - Get */}
        <Col span={12}>
          <Card 
            title={<><DatabaseOutlined /> Test BaseEntity - Get</>}
            extra={
              <Space>
                <Input 
                  placeholder="Entity ID" 
                  value={entityId}
                  onChange={e => setEntityId(e.target.value)}
                  style={{ width: 100 }}
                />
                <Button 
                  onClick={() => {
                    if (!entityId) {
                      message.warning('Nhập ID entity')
                      return
                    }
                    handleTest(
                      () => testApi.getTestEntity(entityId),
                      'Get Entity'
                    )
                  }}
                  loading={loading}
                >
                  Get
                </Button>
              </Space>
            }
          >
            <p>Test lấy entity theo ID</p>
            <code>GET /api/test/base-entity/:id</code>
          </Card>
        </Col>

        {/* Test Exception - 404 */}
        <Col span={8}>
          <Card 
            title={<><BugOutlined /> Test 404</>}
            extra={
              <Button 
                danger
                onClick={() => handleTest(testApi.testNotFound, 'Test 404')}
                loading={loading}
              >
                Test
              </Button>
            }
          >
            <p>Test ResourceNotFoundException</p>
            <code>GET /api/test/error/not-found</code>
          </Card>
        </Col>

        {/* Test Exception - 400 */}
        <Col span={8}>
          <Card 
            title={<><BugOutlined /> Test 400</>}
            extra={
              <Button 
                danger
                onClick={() => handleTest(testApi.testBadRequest, 'Test 400')}
                loading={loading}
              >
                Test
              </Button>
            }
          >
            <p>Test BadRequestException</p>
            <code>GET /api/test/error/bad-request</code>
          </Card>
        </Col>

        {/* Test Exception - 500 */}
        <Col span={8}>
          <Card 
            title={<><BugOutlined /> Test 500</>}
            extra={
              <Button 
                danger
                onClick={() => handleTest(testApi.testServerError, 'Test 500')}
                loading={loading}
              >
                Test
              </Button>
            }
          >
            <p>Test Server Error</p>
            <code>GET /api/test/error/server</code>
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Test Shared Components */}
      <Card title="🎨 Test Shared Components">
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <h4>LoadingSpinner:</h4>
            <LoadingSpinner size="large" tip="Loading..." />
          </div>

          <Divider />

          <div>
            <h4>ErrorMessage:</h4>
            <ErrorMessage message="Đây là error message test" type="error" />
            <ErrorMessage message="Đây là warning message test" type="warning" />
            <ErrorMessage message="Đây là info message test" type="info" />
          </div>

          <Divider />

          <div>
            <h4>EmptyState:</h4>
            <EmptyState 
              message="Không có dữ liệu"
              description="Thử thêm mới để xem dữ liệu"
              action
              actionText="Thêm mới"
              onAction={() => message.info('Clicked add button!')}
            />
          </div>
        </Space>
      </Card>

      <Divider />

      {/* Result Display */}
      {loading && (
        <Card title="⏳ Đang thực hiện...">
          <LoadingSpinner />
        </Card>
      )}

      {error && !loading && (
        <Card title={<><CloseCircleOutlined style={{ color: 'red' }} /> Lỗi</>}>
          <ErrorMessage message={error} />
        </Card>
      )}

      {result && !loading && (
        <Card 
          title={
            result.success ? 
              <><CheckCircleOutlined style={{ color: 'green' }} /> Kết quả: {result.name}</> :
              <><CloseCircleOutlined style={{ color: 'red' }} /> Lỗi: {result.name}</>
          }
        >
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '16px', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {JSON.stringify(result.success ? result.data : result.error, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  )
}

export default TestPage
