import dayjs from 'dayjs'

export const formatCurrency = (value) => {
  if (!value) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
}

export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return ''
  return dayjs(date).format(format)
}

export const formatDateTime = (date) => {
  if (!date) return ''
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}
