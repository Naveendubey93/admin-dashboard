import { Card, Col, Input, Row, Form } from 'antd';
import React from 'react'

type TenantsFilterProps = {
  children?: React.ReactNode;
  // onFilterChange: (filterName: string, filterValue: string) => void;
}

const tenantsFilter = ({ children }: TenantsFilterProps) => {
  return (
    <Card>
      <Row  justify="space-between">
        <Col span={16}>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item name="q">
                <Input.Search allowClear={true} placeholder='Search'/>
              </Form.Item>
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