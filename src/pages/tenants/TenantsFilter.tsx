import { Card, Col, Input, Row } from 'antd';
import React from 'react'

type TenantsFilterProps = {
  children?: React.ReactNode;
  onFilterChange: (filterName: string, filterValue: string) => void;
}

const tenantsFilter = ({ onFilterChange, children }: TenantsFilterProps) => {
  return (
    <Card>
      <Row  justify="space-between">
        <Col span={16}>
          <Row gutter={20}>
            <Col span={12}><Input.Search placeholder='Search' onChange = {(e) => onFilterChange('SearchFilter', e.target.value)}/> 
            </Col>
          </Row>
        </Col>
        <Col span={8} style={{ display: "flex", justifyContent: 'end'}}>
          {children}
        </Col>
      </Row>
    </Card> )
}

export default tenantsFilter