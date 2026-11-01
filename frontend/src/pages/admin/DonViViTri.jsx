import { useState, useEffect } from 'react'
import { Tabs, Card } from 'antd'
import { ApartmentOutlined, EnvironmentOutlined } from '@ant-design/icons'
import DonViTab from './tabs/DonViTab'
import ViTriTab from './tabs/ViTriTab'

const DonViViTri = () => {
  const [activeTab, setActiveTab] = useState('donvi')

  const tabs = [
    {
      key: 'donvi',
      label: (
        <span>
          <ApartmentOutlined />
          Đơn vị
        </span>
      ),
      children: <DonViTab />,
    },
    {
      key: 'vitri',
      label: (
        <span>
          <EnvironmentOutlined />
          Vị trí
        </span>
      ),
      children: <ViTriTab />,
    },
  ]

  return (
    <Card title="Quản lý Đơn vị và Vị trí">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabs}
      />
    </Card>
  )
}

export default DonViViTri
