import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography } from 'antd';

type ProductFilterProps = {
  children: React.ReactNode;
}
const ProductsFilter = ({children}: ProductFilterProps) => {
  return <Card>
    <Row justify="space-between">
      <Col span={16}>   <Row gutter={20}>
            <Col span={6}>
              <Form.Item name="q">
                <Input.Search allowClear={true} placeholder='Search'/>
              </Form.Item>
            </Col>
            <Col span={6}>
            <Form.Item name='role'>
                <Select style={{width: '100%'}} allowClear={true} placeholder='Select Category' >
                <Select.Option value='pizza'>Pizza</Select.Option>
                <Select.Option value="beverages">Beverages</Select.Option>
              </Select>
            </Form.Item>
            </Col>
            <Col span={6}>
              <Select style={{width: '100%'}} placeholder='Select Restaurant' allowClear={true}>
                <Select.Option value='ban'>Pizza hub</Select.Option>
                <Select.Option value="active">Softy Corner</Select.Option>
              </Select>
            </Col>
            <Col span={6}><Space><Switch  defaultChecked onChange={()=>{}}/> <Typography.Text>Show Only Published</Typography.Text></Space></Col>
          </Row>
        </Col>
      <Col span={6} style={{ display: 'flex', justifyContent: 'end' }}>
       {children}
      </Col>

    </Row>"
  </Card>
}

export default ProductsFilter