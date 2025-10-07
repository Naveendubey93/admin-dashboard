import { Breadcrumb, Button, Flex, Space, Spin, Form, Table, Image, Tag, Typography, Drawer, theme } from 'antd'
import { LoadingOutlined, PlusOutlined, RightOutlined} from '@ant-design/icons';
import {  Link } from 'react-router-dom';
import ProductsFilter from './ProductsFilter';
import { FieldData, Product } from '../../types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getProducts } from '../../http/api';
import React from 'react';
import { PER_PAGE } from '../constants';
import { format } from 'date-fns'
import { debounce } from 'lodash';
import { useAuthStore } from '../../store';
import ProductForm from './forms/ProductForm';
const columns = [
  { title: 'Product Name', dataIndex: 'name', key: 'name' ,
    render: (_text: string, record: Product) => {
      return (
        <div>
          <Space><Image src={record.image} width={50} height={50} preview={false}></Image> {record.name}</Space>
        </div>
      )
    }
  },
  { title: 'Description', dataIndex: 'description', key: 'description' },
  { title: 'Status', dataIndex: 'isPublish', key: 'isPublish',
    render: (_: boolean, record: Product) => {
      return <>
        {record.isPublish ? <Tag color='green'>Published</Tag> : <Tag color='red'>Draft</Tag> }
      </>
    }
   },
  {
    title: 'CreatedAt',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (text: string) => {
      return <>
        {<Typography.Text> {format(new Date(text), 'dd//MM/yyyy HH:mm')} </Typography.Text>}
        </>
    }
  }
];

const Products = () => {
  const {token: {colorBgLayout}} = theme.useToken();
  const [form] = Form.useForm()
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [filterForm] = Form.useForm();
  const {user} = useAuthStore();
    const [queryParams, setQueryParams] = React.useState<{
      limit: number;
      page: number;
      q?: string;
      tenantId?: number,
    }>({
      limit: PER_PAGE,
      page: 1,
      q: undefined,
      tenantId: user?.role === 'manager' ? user?.tenant?.id : undefined
    });

    const { data: products, isFetching, isError, error } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => {
      const filteredParams = Object.fromEntries(Object.entries(queryParams).filter((Item) => !!Item[1]));
      const queryString = new URLSearchParams(
        filteredParams as Record<string, string>
      ).toString();
      return getProducts(queryString)
        .then((res) => res.data)
        .catch((err) => {
          console.error('Error fetching users:', err);
          throw err;
        });
    },
    placeholderData: keepPreviousData
  });

  const debounceQUpdate = React.useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, page: 1 }));
      }, 500)
  }, []);

  const onFilterChange = (changedValue: FieldData[]) => {
    const changedFields = changedValue.reduce((acc: Record<string, unknown>, field) => {
      if (field.value !== undefined && field.value !== null) {
        acc[field.name] = field.value;
      }
      return acc;
    }, {});

    if ('q' in changedFields) {
      debounceQUpdate(changedFields.q as string | undefined);
    } else {
      setQueryParams((prev) => ({ ...prev, ...changedFields, page: 1 }));
    }
  };



  const handleFormSubmit = () => {
    console.log('submitting...');
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Flex justify="space-between">
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to="/">Dashboard</Link> },
            { title: 'Products' }
          ]}
        />
        {isFetching && (
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            size="small"
          />
        )}
        {isError && <div>{error?.message || 'An error occurred'}</div>}
      </Flex>
      <Form form={filterForm} name='category' onFieldsChange={onFilterChange}>
        <ProductsFilter>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawerOpen(true)}
          >
            Add Product
          </Button>
        </ProductsFilter>
      </Form>


      <Table
        columns={[
          ...columns,
          {
            title: 'Actions',
            key: 'actions',
            render: () => (
              <Button type="link" onClick={() => ({})}>
                Edit
              </Button>
            )
          }
        ]}
        dataSource={products?.data || []}
        rowKey="id"
        pagination={{
          pageSize: queryParams.limit,
          current: queryParams.page,
          total: products?.total || 0,
          onChange: (page) =>
            setQueryParams((prev) => ({ ...prev,  page })),
          showTotal: (total, range: number[]) =>{
            console.log(total, range);
            return `Showing ${range[0]} - ${range[1]} of Total ${total} users`;
          },
        }}
      />
    <Space>
      <Drawer
        title={'Add Product'}
        width={720}
        destroyOnClose
        style={{ background: colorBgLayout }}
        open={drawerOpen}
        onClose={() => {
          form.resetFields();
          setDrawerOpen(false);
        }}
        extra={
          <Space>
            <Button onClick={() => {
              setDrawerOpen(false);
            }}>
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              type="primary"
              icon={<PlusOutlined />}
            >
              Submit
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          <ProductForm />
        </Form>
      </Drawer>
    </Space>
  </Space>
  )
}

export default Products