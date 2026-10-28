# Requirements Document

## Introduction

Hệ thống Quản Lý Tài Sản Bằng Mã QR đã hoàn thành việc xây dựng các entity classes. Tài liệu này mô tả các yêu cầu để kiểm tra cấu trúc entity hiện có và phát triển các tầng tiếp theo bao gồm: repositories, services, controllers, DTOs, exception handling, và tests. Mục tiêu là xây dựng một backend API hoàn chỉnh, tuân thủ các best practices của Spring Boot, có khả năng mở rộng và dễ bảo trì.

## Glossary

- **Entity_Layer**: Các JPA entity classes đại diện cho bảng cơ sở dữ liệu
- **Repository_Layer**: Các Spring Data JPA repository interfaces để truy cập dữ liệu
- **Service_Layer**: Các service classes chứa business logic
- **Controller_Layer**: Các REST API controllers xử lý HTTP requests
- **DTO_Layer**: Data Transfer Objects để trao đổi dữ liệu giữa client và server
- **Exception_Handler**: Các exception classes và global exception handler
- **Test_Suite**: Tập hợp unit tests và integration tests
- **API_Documentation**: Tài liệu API được tạo bởi Swagger/OpenAPI
- **Database**: MySQL database chứa dữ liệu tài sản
- **QR_Asset_Management_System**: Hệ thống quản lý tài sản bằng mã QR (toàn bộ backend)
- **JPA_Mapping**: Cấu hình ánh xạ giữa entity và database table
- **Validation**: Kiểm tra tính hợp lệ của dữ liệu đầu vào
- **JSON_Serialization**: Quá trình chuyển đổi object sang JSON format
- **Lazy_Loading**: Kỹ thuật tải dữ liệu liên quan khi cần thiết
- **Transaction_Management**: Quản lý giao dịch database
- **Custom_Query**: Các query method tùy chỉnh trong repository
- **Business_Logic**: Logic nghiệp vụ được implement trong service layer
- **HTTP_Response**: Phản hồi HTTP chuẩn hóa với status code và data
- **Error_Response**: Cấu trúc phản hồi lỗi thống nhất
- **Unit_Test**: Test kiểm tra từng đơn vị code độc lập
- **Integration_Test**: Test kiểm tra tích hợp giữa các components
- **Mock_Object**: Đối tượng giả lập để test
- **Test_Coverage**: Tỷ lệ phần trăm code được test bao phủ
- **Swagger_Annotation**: Các annotation để tạo API documentation
- **Request_DTO**: DTO cho dữ liệu gửi lên server
- **Response_DTO**: DTO cho dữ liệu trả về client
- **Mapper_Utility**: Tiện ích chuyển đổi giữa Entity và DTO
- **REST_API**: RESTful API endpoints
- **CRUD_Operations**: Create, Read, Update, Delete operations
- **Pagination**: Phân trang kết quả trả về
- **Sorting**: Sắp xếp kết quả theo tiêu chí
- **Filtering**: Lọc dữ liệu theo điều kiện
- **Authentication**: Xác thực người dùng
- **Authorization**: Phân quyền truy cập
- **JSON_Ignore**: Annotation để bỏ qua field khi serialize JSON
- **Bidirectional_Relationship**: Quan hệ hai chiều giữa các entity
- **Cascade_Operations**: Các thao tác tự động lan truyền qua quan hệ
- **Orphan_Removal**: Tự động xóa entity con khi mất liên kết với entity cha

## Requirements

### Requirement 1: Kiểm Tra và Xác Thực Entity Mapping

**User Story:** Là một developer, tôi muốn kiểm tra các entity mappings với database, để đảm bảo cấu trúc entity chính xác và không có vấn đề về mapping.

#### Acceptance Criteria

1. THE QR_Asset_Management_System SHALL validate all JPA_Mapping configurations between Entity_Layer and Database tables
2. WHEN the application starts, THE QR_Asset_Management_System SHALL create or update database schema based on Entity_Layer definitions
3. THE QR_Asset_Management_System SHALL verify all relationship mappings (OneToMany, ManyToOne, ManyToMany) are correctly configured
4. THE QR_Asset_Management_System SHALL ensure all foreign key constraints are properly defined in Entity_Layer
5. THE QR_Asset_Management_System SHALL confirm that Lazy_Loading and EAGER fetching strategies are appropriately set
6. THE QR_Asset_Management_System SHALL validate that all required fields have nullable constraints matching business rules
7. THE QR_Asset_Management_System SHALL verify unique constraints on appropriate fields (username, email, asset code)
8. WHEN JSON_Serialization occurs, THE QR_Asset_Management_System SHALL prevent circular reference errors in Bidirectional_Relationship

### Requirement 2: Tạo Repository Layer

**User Story:** Là một developer, tôi muốn tạo các repository interfaces, để có thể thực hiện các thao tác truy vấn database một cách dễ dàng và an toàn.

#### Acceptance Criteria

1. THE QR_Asset_Management_System SHALL create a repository interface for each entity in Entity_Layer extending JpaRepository
2. THE QR_Asset_Management_System SHALL implement Custom_Query methods for common business queries (find by status, find by department, find active users)
3. THE QR_Asset_Management_System SHALL support Pagination and Sorting in all list query methods
4. THE QR_Asset_Management_System SHALL implement Filtering capabilities using Specification pattern or Query by Example
5. WHERE complex queries are needed, THE QR_Asset_Management_System SHALL use @Query annotation with JPQL or native SQL
6. THE QR_Asset_Management_System SHALL ensure all Custom_Query methods follow consistent naming conventions (findBy, existsBy, countBy)
7. WHEN querying related entities, THE QR_Asset_Management_System SHALL use JOIN FETCH to avoid N+1 query problems
8. THE QR_Asset_Management_System SHALL implement soft delete queries that filter out records where daxoa = true

### Requirement 3: Xây Dựng Service Layer với Business Logic

**User Story:** Là một developer, tôi muốn tạo service layer chứa business logic, để tách biệt logic nghiệp vụ khỏi controller và dễ dàng test.

#### Acceptance Criteria

1. THE QR_Asset_Management_System SHALL create a service interface and implementation for each entity
2. THE QR_Asset_Management_System SHALL implement standard CRUD_Operations (create, read, update, delete) in Service_Layer
3. THE QR_Asset_Management_System SHALL implement soft delete for entities that have daxoa field
4. THE QR_Asset_Management_System SHALL apply @Transactional annotation to ensure Transaction_Management for write operations
5. THE QR_Asset_Management_System SHALL validate business rules before persisting data (asset must have valid status, user must belong to department)
6. WHEN creating or updating entities, THE QR_Asset_Management_System SHALL validate that referenced entities exist
7. THE QR_Asset_Management_System SHALL implement search and filter methods with multiple criteria
8. THE QR_Asset_Management_System SHALL handle cascading operations appropriately (updating asset status should create history record)
9. IF a Business_Logic validation fails, THEN THE QR_Asset_Management_System SHALL throw a custom business exception with meaningful message
10. THE QR_Asset_Management_System SHALL log important business operations (asset creation, transfer, status change)

### Requirement 4: Xây Dựng DTO Layer

**User Story:** Là một developer, tôi muốn tạo các DTO classes, để kiểm soát dữ liệu trao đổi với client và tách biệt entity khỏi API contract.

#### Acceptance Criteria

1. THE QR_Asset_Management_System SHALL create separate Request_DTO classes for create and update operations
2. THE QR_Asset_Management_System SHALL create Response_DTO classes for API responses
3. THE QR_Asset_Management_System SHALL apply Validation annotations on Request_DTO fields (@NotNull, @NotBlank, @Email, @Size, @Pattern)
4. THE QR_Asset_Management_System SHALL exclude sensitive fields (password) from Response_DTO
5. THE QR_Asset_Management_System SHALL use JSON_Ignore or @JsonIgnoreProperties to prevent exposing unnecessary relationships in Response_DTO
6. THE QR_Asset_Management_System SHALL create Mapper_Utility classes or use MapStruct to convert between Entity and DTO
7. THE QR_Asset_Management_System SHALL include only necessary related entity information in Response_DTO (ID and name, not full object)
8. THE QR_Asset_Management_System SHALL create paginated response DTOs that include content, page number, page size, total elements, and total pages
9. THE QR_Asset_Management_System SHALL use consistent naming convention for DTOs (EntityCreateRequest, EntityUpdateRequest, EntityResponse)

### Requirement 5: Xây Dựng REST API Controller Layer

**User Story:** Là một developer, tôi muốn tạo các REST API controllers, để client có thể tương tác với backend thông qua HTTP requests.

#### Acceptance Criteria

1. THE QR_Asset_Management_System SHALL create a controller class for each main entity with @RestController and @RequestMapping annotations
2. THE QR_Asset_Management_System SHALL implement standard REST_API endpoints for CRUD_Operations (POST, GET by ID, GET all, PUT, DELETE)
3. THE QR_Asset_Management_System SHALL use appropriate HTTP methods (POST for create, GET for read, PUT for update, DELETE for delete)
4. THE QR_Asset_Management_System SHALL return appropriate HTTP status codes (200 OK, 201 Created, 204 No Content, 400 Bad Request, 404 Not Found)
5. THE QR_Asset_Management_System SHALL implement Pagination and Sorting parameters for list endpoints (@RequestParam page, size, sort)
6. THE QR_Asset_Management_System SHALL implement Filtering parameters for search endpoints
7. THE QR_Asset_Management_System SHALL validate Request_DTO using @Valid annotation
8. WHEN Validation fails, THEN THE QR_Asset_Management_System SHALL return 400 Bad Request with detailed validation error messages
9. THE QR_Asset_Management_System SHALL return consistent HTTP_Response structure with data and message fields
10. THE QR_Asset_Management_System SHALL implement Authorization checks in controllers using @PreAuthorize annotations
11. THE QR_Asset_Management_System SHALL implement specific business endpoints (transfer asset, start inventory, scan QR code)
12. THE QR_Asset_Management_System SHALL use @PathVariable for resource identifiers and @RequestParam for query parameters

### Requirement 6: Implement Global Exception Handling

**User Story:** Là một developer, tôi muốn xử lý exceptions một cách tập trung, để API trả về error responses nhất quán và dễ xử lý cho client.

#### Acceptance Criteria

1. THE QR_Asset_Management_System SHALL create custom exception classes for common business errors (ResourceNotFoundException, DuplicateResourceException, InvalidOperationException)
2. THE QR_Asset_Management_System SHALL implement Exception_Handler using @ControllerAdvice annotation
3. WHEN ResourceNotFoundException occurs, THEN THE QR_Asset_Management_System SHALL return 404 Not Found with Error_Response
4. WHEN validation fails, THEN THE QR_Asset_Management_System SHALL return 400 Bad Request with field-level error details
5. WHEN DuplicateResourceException occurs, THEN THE QR_Asset_Management_System SHALL return 409 Conflict with Error_Response
6. WHEN unauthorized access occurs, THEN THE QR_Asset_Management_System SHALL return 403 Forbidden
7. WHEN authentication fails, THEN THE QR_Asset_Management_System SHALL return 401 Unauthorized
8. WHEN unexpected errors occur, THEN THE QR_Asset_Management_System SHALL return 500 Internal Server Error with generic message (not exposing internal details)
9. THE QR_Asset_Management_System SHALL include timestamp, status code, error message, and request path in Error_Response
10. THE QR_Asset_Management_System SHALL log all exceptions with appropriate log levels (WARN for client errors, ERROR for server errors)

### Requirement 7: Viết Unit Tests

**User Story:** Là một developer, tôi muốn viết unit tests cho service layer, để đảm bảo business logic hoạt động chính xác và phát hiện bugs sớm.

#### Acceptance Criteria

1. THE QR_Asset_Management_System SHALL create Unit_Test classes for each service implementation
2. THE QR_Asset_Management_System SHALL use Mock_Object to isolate service logic from repository dependencies
3. THE QR_Asset_Management_System SHALL test all CRUD_Operations in service layer
4. THE QR_Asset_Management_System SHALL test Business_Logic validation rules (valid data passes, invalid data throws exception)
5. THE QR_Asset_Management_System SHALL test exception scenarios (entity not found, duplicate resource, invalid state transitions)
6. THE QR_Asset_Management_System SHALL achieve minimum 80% Test_Coverage for service layer
7. THE QR_Asset_Management_System SHALL use @Mock and @InjectMocks annotations from Mockito framework
8. THE QR_Asset_Management_System SHALL verify that repository methods are called with correct parameters using Mockito.verify()
9. THE QR_Asset_Management_System SHALL test edge cases (null values, empty lists, boundary values)
10. THE QR_Asset_Management_System SHALL use descriptive test method names following pattern: methodName_scenario_expectedResult

### Requirement 8: Viết Integration Tests

**User Story:** Là một developer, tôi muốn viết integration tests, để kiểm tra tích hợp giữa các layers và đảm bảo hệ thống hoạt động end-to-end.

#### Acceptance Criteria

1. THE QR_Asset_Management_System SHALL create Integration_Test classes for REST_API endpoints
2. THE QR_Asset_Management_System SHALL use @SpringBootTest annotation to load full application context
3. THE QR_Asset_Management_System SHALL use TestRestTemplate or MockMvc to test Controller_Layer
4. THE QR_Asset_Management_System SHALL test complete request-response flows including Validation and Exception_Handler
5. THE QR_Asset_Management_System SHALL use test database (H2 or test MySQL) to avoid affecting production data
6. THE QR_Asset_Management_System SHALL test Authentication and Authorization flows
7. THE QR_Asset_Management_System SHALL test Pagination, Sorting, and Filtering functionality
8. THE QR_Asset_Management_System SHALL verify HTTP status codes and response body structure
9. THE QR_Asset_Management_System SHALL test business workflows (create asset, transfer asset, complete inventory)
10. THE QR_Asset_Management_System SHALL clean up test data after each test using @Transactional or @DirtiesContext
11. THE QR_Asset_Management_System SHALL test error scenarios (invalid input, unauthorized access, resource not found)

### Requirement 9: Tạo API Documentation với Swagger

**User Story:** Là một API consumer, tôi muốn xem tài liệu API đầy đủ và có thể test API trực tiếp, để hiểu cách sử dụng các endpoints và tích hợp dễ dàng.

#### Acceptance Criteria

1. THE QR_Asset_Management_System SHALL configure Swagger/OpenAPI 3.0 using springdoc-openapi
2. THE QR_Asset_Management_System SHALL add Swagger_Annotation (@Operation, @ApiResponse, @Parameter) to all controller methods
3. THE QR_Asset_Management_System SHALL document all Request_DTO and Response_DTO with @Schema annotations
4. THE QR_Asset_Management_System SHALL group API endpoints by entity/feature using @Tag annotation
5. THE QR_Asset_Management_System SHALL document request parameters, path variables, and request body with examples
6. THE QR_Asset_Management_System SHALL document all possible HTTP response codes for each endpoint
7. THE QR_Asset_Management_System SHALL configure JWT Authentication in Swagger UI for testing secured endpoints
8. THE QR_Asset_Management_System SHALL provide meaningful descriptions for all DTOs fields explaining their purpose
9. WHEN accessing /swagger-ui/index.html, THE QR_Asset_Management_System SHALL display API_Documentation with all endpoints
10. THE QR_Asset_Management_System SHALL allow users to execute API requests directly from Swagger UI

### Requirement 10: Cấu Hình JSON Serialization

**User Story:** Là một developer, tôi muốn cấu hình JSON serialization đúng cách, để tránh circular references và kiểm soát dữ liệu trả về client.

#### Acceptance Criteria

1. THE QR_Asset_Management_System SHALL configure Jackson to handle Bidirectional_Relationship without circular reference errors
2. THE QR_Asset_Management_System SHALL use @JsonManagedReference and @JsonBackReference for parent-child relationships
3. WHERE direct entity serialization is needed, THE QR_Asset_Management_System SHALL use @JsonIgnoreProperties to break circular references
4. THE QR_Asset_Management_System SHALL configure Jackson to ignore null values in Response_DTO using @JsonInclude(Include.NON_NULL)
5. THE QR_Asset_Management_System SHALL serialize LocalDateTime fields in ISO-8601 format
6. THE QR_Asset_Management_System SHALL serialize BigDecimal fields with consistent precision
7. THE QR_Asset_Management_System SHALL configure Jackson to handle Java 8 date/time types correctly
8. THE QR_Asset_Management_System SHALL prevent Lazy_Loading exceptions during JSON serialization by using DTOs or fetch joins
9. THE QR_Asset_Management_System SHALL use @JsonProperty to customize field names in JSON output if needed
10. THE QR_Asset_Management_System SHALL exclude password and sensitive fields from JSON serialization using @JsonIgnore

### Requirement 11: Implement Repository Custom Queries

**User Story:** Là một developer, tôi muốn tạo các custom query methods phức tạp, để hỗ trợ các tính năng tìm kiếm và báo cáo nghiệp vụ.

#### Acceptance Criteria

1. THE QR_Asset_Management_System SHALL implement query methods to find assets by multiple criteria (type, status, department, location, date range)
2. THE QR_Asset_Management_System SHALL implement query methods to find users by role and department
3. THE QR_Asset_Management_System SHALL implement query methods to find inventory differences (missing assets, unexpected assets)
4. THE QR_Asset_Management_System SHALL implement statistical queries (count assets by status, count by department, total value by type)
5. THE QR_Asset_Management_System SHALL implement history queries (asset transfer history, status change history, scan history)
6. THE QR_Asset_Management_System SHALL implement search functionality with partial matching for text fields
7. WHERE performance is critical, THE QR_Asset_Management_System SHALL use native SQL queries with proper indexing hints
8. THE QR_Asset_Management_System SHALL implement query methods for dashboard data (assets expiring maintenance, recent scans, pending transfers)
9. THE QR_Asset_Management_System SHALL use Specification pattern for dynamic query building when criteria are optional
10. THE QR_Asset_Management_System SHALL optimize queries to fetch only necessary columns using projections when returning large datasets

### Requirement 12: Implement Service Layer Business Workflows

**User Story:** Là một business user, tôi muốn hệ thống thực hiện các quy trình nghiệp vụ phức tạp, để quản lý tài sản theo đúng quy định.

#### Acceptance Criteria

1. WHEN creating a new asset, THE QR_Asset_Management_System SHALL generate unique asset code, create QR code data, and set initial status
2. WHEN transferring an asset, THE QR_Asset_Management_System SHALL validate current location, update asset location, create transfer record, and create status history
3. WHEN starting an inventory session, THE QR_Asset_Management_System SHALL create inventory period, generate checklist for all assets in scope, and set status to IN_PROGRESS
4. WHEN scanning an asset during inventory, THE QR_Asset_Management_System SHALL record scan time, verify expected location, update inventory detail, and mark as FOUND
5. WHEN completing inventory session, THE QR_Asset_Management_System SHALL identify missing assets, identify unexpected assets, generate report, and close inventory period
6. WHEN creating maintenance record, THE QR_Asset_Management_System SHALL validate asset exists, create maintenance record, optionally update asset status, and create status history
7. WHEN deactivating a user, THE QR_Asset_Management_System SHALL check for assigned assets, optionally transfer assets, and set user status to inactive
8. WHEN deleting an asset (soft delete), THE QR_Asset_Management_System SHALL validate asset can be deleted, set daxoa flag to true, and create history record
9. IF an asset is assigned to a user THEN THE QR_Asset_Management_System SHALL prevent deletion until asset is returned
10. WHEN changing asset status, THE QR_Asset_Management_System SHALL validate state transition is allowed and create status history record
