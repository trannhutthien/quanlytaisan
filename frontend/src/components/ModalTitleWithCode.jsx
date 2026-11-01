/**
 * ModalTitleWithCode - Component hiển thị title Modal với mã tự động
 * 
 * @param {string} title - Tiêu đề Modal (VD: 'Thêm đơn vị', 'Cập nhật vị trí')
 * @param {string} code - Mã hiển thị (VD: 'DV123456', 'VT789012')
 * @param {string} codeLabel - Nhãn hiển thị trước mã (VD: 'Mã ĐV', 'Mã VT', 'Mã TS')
 * @param {boolean} isEditMode - Có phải chế độ chỉnh sửa không
 * 
 * @example
 * <Modal
 *   title={
 *     <ModalTitleWithCode
 *       title="Thêm đơn vị"
 *       code="DV123456"
 *       codeLabel="Mã ĐV"
 *       isEditMode={false}
 *     />
 *   }
 * >
 */
const ModalTitleWithCode = ({ 
  title, 
  code, 
  codeLabel = 'Mã',
  isEditMode = false 
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      paddingRight: 24 
    }}>
      <span>{title}</span>
      {code && (
        <span style={{ 
          fontSize: 14, 
          fontWeight: 'normal', 
          color: isEditMode ? '#52c41a' : '#1890ff' 
        }}>
          {codeLabel}: {code}
        </span>
      )}
    </div>
  )
}

export default ModalTitleWithCode
