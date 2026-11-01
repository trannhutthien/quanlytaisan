const PhamViKiemKeCard = ({ value, currentValue, onClick, title, description }) => {
  const isSelected = currentValue === value

  return (
    <div
      onClick={onClick}
      style={{
        border: isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
        borderRadius: '6px',
        padding: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backgroundColor: isSelected ? '#e6f7ff' : '#fff',
        boxShadow: isSelected ? '0 2px 8px rgba(24, 144, 255, 0.2)' : 'none',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = '#1890ff'
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 144, 255, 0.1)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = '#d9d9d9'
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
        <div
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            border: isSelected ? '5px solid #1890ff' : '2px solid #d9d9d9',
            marginRight: '8px',
            transition: 'all 0.3s ease',
          }}
        />
        <strong style={{ fontSize: '14px' }}>{title}</strong>
      </div>
      <div style={{ fontSize: '12px', color: '#8c8c8c', marginLeft: '24px' }}>
        {description}
      </div>
    </div>
  )
}

export default PhamViKiemKeCard
