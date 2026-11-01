import { useState, useEffect } from 'react'
import { Tabs, message } from 'antd'
import { UnorderedListOutlined, QrcodeOutlined } from '@ant-design/icons'
import DanhSachDotKiemKe from './tabs/DanhSachDotKiemKe'
import QuetKiemKe from './tabs/QuetKiemKe'

const KiemKe = () => {
  const [activeTab, setActiveTab] = useState('danh-sach')

  const tabs = [
    {
      key: 'danh-sach',
      label: (
        <span>
          <UnorderedListOutlined />
          Danh sách đợt kiểm kê
        </span>
      ),
      children: <DanhSachDotKiemKe />,
    },
    {
      key: 'quet-kiem-ke',
      label: (
        <span>
          <QrcodeOutlined />
          Quét kiểm kê
        </span>
      ),
      children: <QuetKiemKe />,
    },
  ]

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabs}
      />
    </div>
  )
}

export default KiemKe
