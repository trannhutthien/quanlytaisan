# ModalTitleWithCode Component

Component hiển thị title Modal với mã tự động ở góc phải (kế icon X đóng form).

## Tính năng

- ✅ Hiển thị title và mã trong cùng một dòng
- ✅ Mã tự động xuất hiện ở góc phải
- ✅ Màu xanh dương (#1890ff) khi thêm mới
- ✅ Màu xanh lá (#52c41a) khi chỉnh sửa
- ✅ Responsive và đẹp mắt

## Cách sử dụng

### 1. Import component và utility

```jsx
import ModalTitleWithCode from '../../../components/ModalTitleWithCode'
import { generateAutoCode } from '../../../hooks/useAutoCode'
```

### 2. Tạo mã tự động khi mở form thêm mới

```jsx
const handleAdd = () => {
  setEditingId(null)
  form.resetFields()
  // Generate auto code
  const newCode = generateAutoCode('DV') // DV, VT, TS, etc.
  form.setFieldsValue({ madonvi: newCode })
  setIsModalOpen(true)
}
```

### 3. Sử dụng trong Modal

```jsx
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
>
  <Form form={form} onFinish={handleSubmit}>
    {/* Hidden field chứa mã */}
    <Form.Item name="madonvi" hidden>
      <Input />
    </Form.Item>
    
    {/* Các field khác */}
    <Form.Item name="tendonvi" label="Tên đơn vị">
      <Input />
    </Form.Item>
  </Form>
</Modal>
```

## Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `title` | string | - | Tiêu đề Modal (VD: 'Thêm đơn vị', 'Cập nhật vị trí') |
| `code` | string | - | Mã hiển thị (VD: 'DV123456', 'VT789012') |
| `codeLabel` | string | 'Mã' | Nhãn hiển thị trước mã (VD: 'Mã ĐV', 'Mã VT', 'Mã TS') |
| `isEditMode` | boolean | false | Chế độ chỉnh sửa (màu xanh lá) hay thêm mới (màu xanh dương) |

## Hàm generateAutoCode

Hàm tiện ích để tạo mã tự động không cần hook.

### Import

```jsx
import { generateAutoCode } from '../../../hooks/useAutoCode'
```

### Sử dụng

```jsx
const maDonVi = generateAutoCode('DV')   // Returns: DV1234567890
const maViTri = generateAutoCode('VT')   // Returns: VT9876543242
const maTaiSan = generateAutoCode('TS')  // Returns: TS5678901234
```

### Format mã

`{PREFIX}{TIMESTAMP}{RANDOM}`
- `PREFIX`: Tiền tố bạn truyền vào (2-4 ký tự)
- `TIMESTAMP`: 8 số cuối của timestamp hiện tại
- `RANDOM`: 2 số ngẫu nhiên (00-99)

## Ví dụ đầy đủ

```jsx
import { useState } from 'react'
import { Modal, Form, Input, Button } from 'antd'
import ModalTitleWithCode from '../../../components/ModalTitleWithCode'
import { generateAutoCode } from '../../../hooks/useAutoCode'

const MyForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form] = Form.useForm()

  const handleAdd = () => {
    setEditingId(null)
    form.resetFields()
    const newCode = generateAutoCode('DV')
    form.setFieldsValue({ madonvi: newCode })
    setIsModalOpen(true)
  }

  const handleEdit = (record) => {
    setEditingId(record.id)
    form.setFieldsValue({
      madonvi: record.madonvi,
      tendonvi: record.tendonvi,
    })
    setIsModalOpen(true)
  }

  return (
    <>
      <Button onClick={handleAdd}>Thêm mới</Button>
      
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
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form}>
          <Form.Item name="madonvi" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="tendonvi" label="Tên đơn vị">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
```

## Đã sử dụng ở đâu?

Component này đã được sử dụng tại:
- ✅ `frontend/src/pages/admin/tabs/DonViTab.jsx` - Form Đơn vị (Mã ĐV)
- ✅ `frontend/src/pages/admin/tabs/ViTriTab.jsx` - Form Vị trí (Mã VT)

Bạn có thể sử dụng lại cho:
- Form Loại tài sản (Mã LTS)
- Form Tài sản (Mã TS) - đã có sẵn logic tương tự
- Bất kỳ form nào cần mã tự động

## Giao diện

### Khi thêm mới:
```
┌─────────────────────────────────────────────────────────┐
│ Thêm đơn vị                          Mã ĐV: DV123456 X │ (màu xanh dương)
└─────────────────────────────────────────────────────────┘
```

### Khi chỉnh sửa:
```
┌─────────────────────────────────────────────────────────┐
│ Cập nhật đơn vị                      Mã ĐV: DV123456 X │ (màu xanh lá)
└─────────────────────────────────────────────────────────┘
```
