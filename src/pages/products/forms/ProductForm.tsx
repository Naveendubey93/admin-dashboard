import { Button, Card, Col, Form, Input, Row, Select, Space, Switch, Typography, Upload } from 'antd'
import { Category, Tenant } from '../../../types'
import { getCategories, getTenants } from '../../../http/api';
import { useQuery } from '@tanstack/react-query';
// import { Tenant } from '../../../types'
import {PlusOutlined} from '@ant-design/icons'
import { Pricing } from './Pricing';
import { Attributes } from './Attributes';

const ProductForm = () => {

  const selectedCategory =  Form.useWatch('categoryId');

   const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return getCategories(`?limit=1000&page=1`)
    },
  });

  const { data: restaurants} = useQuery({
      queryKey: ['restaurants'],
      queryFn: () => {
       return getTenants(`?limit=1000&page=1`)
      },
    });

  return (
      <Row>
      <Col span={24}>
        <Space direction='vertical' size='large'>
          <Card title="Product Information" bordered={false}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label="Product Name" name="name" rules={[{ required: true, message: 'Product name is required' }]}>
                  <Input size='large'/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Category" name="categoryId" rules={[{ required: true, message: 'Please Select category!' }]}>
                  <Select style={{width: '100%'}} allowClear={true} placeholder='Select Category' onChange={() => {}}>
                  {
                        categories?.data?.map((category: Category) => (
                          <Select.Option key={category._id} value={JSON.stringify(category)}>
                            {category.name}
                          </Select.Option>
                        ))}
                  </Select>
                </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Description is required!' }]}>
                    <Input.TextArea rows={2} maxLength={100} size='large'/>
                  </Form.Item>
                </Col>
            </Row>
          </Card>
          {/* {!isEditMode && ( */}
            <Card title="Product Image" bordered={false}>
              <Row gutter={20}>
                <Col span={24}>
                  <Form.Item label="Image" name="image" rules={[{ required: true, message: 'Please upload product Image!' }]}>
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                      // beforeUpload={beforeUpload}
                      // onChange={handleChange}
                    >
                      {/* {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton} */}
                      <div>
                        <Space direction='vertical'>
                          <PlusOutlined/>
                          <Typography.Text>Upload</Typography.Text>
                        </Space>
                      </div>
                    </Upload>
                   </Form.Item>
                </Col>
              </Row>
            </Card>
          {/* )} */}

          <Card title="Tenant Info" bordered={false}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item label="Restaurant" name="tenantId"  rules={[{ required: true, message: 'Please select a restaurant!' }]}>
                    <Select id='selectBoxInTenantForm' size='large' style={{width: '100%'}} allowClear={true} placeholder='Select Restaturent' onChange={() => {}}>
                      {
                        restaurants?.data?.data?.map((tenant: Tenant) => (
                          <Select.Option key={tenant.id} value={tenant.id}>
                            {tenant.name}
                          </Select.Option>
                        ))}

                    </Select>
                  </Form.Item>
                </Col>
              {/* )} */}
            </Row>
          </Card>

          {
            selectedCategory && <Pricing selectedCategory={selectedCategory}/>
          }

          {
            selectedCategory && <Attributes/>
          }

          <Card title="Other Properties" bordered={false}>
            <Row gutter={24}>
              <Col span={24}>
                 <Space>
                    <Form.Item name='isPublish'>
                      <Switch  defaultChecked={false} onChange={()=>{}} checkedChildren="Yes" unCheckedChildren="No" />
                    </Form.Item>
                      <Typography.Text style={{ marginBottom: 24, display: 'block' }}>Published</Typography.Text>
                  </Space>
                </Col>
              {/* )} */}
            </Row>
          </Card>

        </Space>
        </Col>
    </Row>
  )
}

export default ProductForm