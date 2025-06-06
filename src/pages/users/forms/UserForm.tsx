import { Card, Col, Form, Input, Row, Select, Space } from 'antd'
import { getTenants } from '../../../http/api';
import { useQuery } from '@tanstack/react-query';
import { Tenant } from '../../../types';

const UserForm = ({isEditMode= false}: { isEditMode: boolean}) => {
  const selectedRole = Form.useWatch('role');
    const {
    data: tenants,

  } = useQuery({
    queryKey: ['tenants'],
    queryFn: () => {
      return getTenants(`perPage=10&currentPage=1`)
        .then((res) => {
         return res.data?.data;       // Fix here if data is wrapped
        })
        .catch((error) => {
          console.error("Error fetching tenants: ", error);
          throw error;  // Re-throw the error so that `isError` can be set to true
        });
    },
  });
  return (
    <Row>
      <Col span={24}>
        <Space direction='vertical' size='large'>
          <Card title="Basic Information" bordered={false}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please input your first name!' }]}>
                  <Input size='large'/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please input your last name!' }]}>
                  <Input size='large'/>
                </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Email is required!' }, { type: 'email', message: 'Please enter a valid email!' }]}>
                    <Input size='large'/>
                  </Form.Item>
                </Col>
            </Row>
          </Card>
          {!isEditMode && (
            <Card title="Security Info" bordered={false}>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                    <Input.Password size='large'/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Confirm Password" name="confirmPassword" rules={[{ required: true, message: 'Please confirm your password!' }]}>
                    <Input.Password size='large'/>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          )}

          <Card title="Role" bordered={false}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label="Role" name="role"  rules={[{ required: true, message: 'Please select a role!' }]}>
                  <Select id="selectBoxInUserForm" style={{width: '100%'}} allowClear={true} placeholder='Select Role' onChange={() => {}}>
                  <Select.Option value='admin'>Admin</Select.Option>
                  <Select.Option value="manager">Manager</Select.Option>
                  <Select.Option value='customer'>Customer</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              { selectedRole === 'manager' && (

                <Col span={12}>
                    <Form.Item label="Restaurant" name="tenantId" rules={[{ required: true, message: 'Please select a restaurant!' }]}>
                    <Select id='selectBoxInTenantForm' size='large' style={{width: '100%'}} allowClear={true} placeholder='Select Restaturent' onChange={() => {}}>
                      {
                        tenants?.map((tenant: Tenant) => (
                          <Select.Option key={tenant.id} value={tenant.id}>
                            {tenant.name}
                          </Select.Option>
                        ))}

                    </Select>
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Card>
        </Space>
        </Col>
    </Row>
  )
}

export default UserForm