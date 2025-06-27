import { Breadcrumb, Button, Flex, Space, Spin, Form, Table, Image, Tag, Typography } from 'antd'
import { LoadingOutlined, PlusOutlined, RightOutlined} from '@ant-design/icons';
import {  Link } from 'react-router-dom';
import ProductsFilter from './ProductsFilter';
import { Product } from '../../types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getProducts } from '../../http/api';
import React from 'react';
import { PER_PAGE } from '../constants';
import { format } from 'date-fns'
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
  const [filterForm] = Form.useForm();
    const [queryParams, setQueryParams] = React.useState<{
      perPage: number;
      currentPage: number;
      q?: string;
      role?: string;
    }>({
      perPage: PER_PAGE,
      currentPage: 1,
      q: undefined,
      role: undefined
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
        {/* {isFetching && (
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            size="small"
          />
        )}
        {isError && <div>{error?.message || 'An error occurred'}</div>} */}
      </Flex>
      <Form form={filterForm} onFieldsChange={()=> {}}>
        <ProductsFilter>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {}}
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
            render: (_text: string, record: Product) => (
              <Button type="link" onClick={() => setCurrentEditingUser(record)}>
                Edit
              </Button>
            )
          }
        ]}
        dataSource={products?.data || []}
        rowKey="id"
        pagination={{
          pageSize: queryParams.perPage,
          current: queryParams.currentPage,
          total: products?.count || 0,
          onChange: (page) =>
            setQueryParams((prev) => ({ ...prev, currentPage: page })),
          showTotal: (total, range: number[]) =>{
            console.log(total, range);
            return `Showing ${range[0]} - ${range[1]} of Total ${total} users`;
          },
        }}
      />

    </Space>
  )
}

export default Products