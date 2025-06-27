import { useQuery } from '@tanstack/react-query';
import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography } from 'antd';
import { getCategories, getTenants } from '../../http/api';
import { Category, Tenant } from '../../types';

type ProductFilterProps = {
  children: React.ReactNode;
}
const ProductsFilter = ({children}: ProductFilterProps) => {
  const { data: restaurants} = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => {
     return getTenants(`?perPage=1000&currentPage=1`)
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return getCategories(`?perPage=1000&currentPage=1`)
    },
  });
  console.log(categories?.data);
  return <Card>
    <Row justify="space-between">
      <Col span={18}>
        <Row gutter={20}>
          <Col span={5}>
            <Form.Item name="q">
              <Input.Search allowClear={true} placeholder='Search'/>
            </Form.Item>
          </Col>
          <Col span={6}>
          <Form.Item name='category'>
            <Select style={{width: '100%'}}  placeholder='Select Category' allowClear={true} >
                {categories?.data?.map((category: Category) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name='restaurant'>
              <Select style={{width: '100%'}} placeholder='Select Restaurant' allowClear={true}>
                {restaurants?.data?.data?.map((restaurant: Tenant) => (
                  <Select.Option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={7}><Space><Switch  defaultChecked onChange={()=>{}}/> <Typography.Text>Show Only Published</Typography.Text></Space></Col>
         </Row>
      </Col>
      <Col span={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
       {children}
      </Col>

    </Row>
  </Card>
}

export default ProductsFilter