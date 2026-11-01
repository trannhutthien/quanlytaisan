import axiosClient from './axiosClient'

/**
 * API test để verify backend connection
 */
const testApi = {
  // Test hello endpoint
  hello: () => axiosClient.get('/test/hello'),
  
  // Test enums
  getEnums: () => axiosClient.get('/test/enums'),
  
  // Test BaseEntity - Create
  createTestEntity: (data) => axiosClient.post('/test/base-entity', data),
  
  // Test BaseEntity - Get by ID
  getTestEntity: (id) => axiosClient.get(`/test/base-entity/${id}`),
  
  // Test BaseEntity - Update
  updateTestEntity: (id, data) => axiosClient.put(`/test/base-entity/${id}`, data),
  
  // Test Exception Handler
  testNotFound: () => axiosClient.get('/test/error/not-found'),
  testBadRequest: () => axiosClient.get('/test/error/bad-request'),
  testServerError: () => axiosClient.get('/test/error/server'),
}

export default testApi
