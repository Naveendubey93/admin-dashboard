import { Breadcrumb, Button, Drawer, Space, Table, theme , Form, Spin, Flex} from 'antd';
import { LoadingOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import {  Link, Navigate } from 'react-router-dom';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser, getUsers } from '../../http/api';
import { CreateUserData, FieldData } from '../../types';
import { useAuthStore } from '../../store';
import UsersFilter from './UsersFilter';
import React from 'react';
import UserForm from './forms/UserForm';
import {  PER_PAGE } from '../constants';
import { debounce } from 'lodash';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'First Name',
    dataIndex: 'firstName',
    key: 'firstName',
    // render: (_text: string, record: User) => {
    //   // Safeguard against undefined record
    //   if (!record) return null;
    //   return <div>{record.firstName} {record.lastName}</div>;
    // }
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName',
    key: 'lastName',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
  },
  // {
  //   title: 'Restaurant',
  //   dataIndex: 'tenant',
  //   key: 'tenant',
  //   render: (_text: string, record: User) => {
  //     return <div>{record.tenant?.name}</div>;
  //   }
  // }
];

export const Users = () => {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const queryClient = useQueryClient();
  const { token : { colorBgLayout } } = theme.useToken();

  const [queryParams, setQueryParams] = React.useState<{
    perPage: number;
    currentPage: number;
    q?: string;
    role?: string;
  }>({
    perPage: PER_PAGE,
    currentPage: 1,
    q: undefined,
    role: undefined,
  });

  const [ drawerOpen, setDrawerOpen] = React.useState(false);
  const { data: users, isFetching, isError, error } = useQuery({
    queryKey: ['users', queryParams],

    queryFn: () => {
      const filterdParams = Object.fromEntries(Object.entries(queryParams).filter((Item) => !!Item[1]));
      // const queryString = `?currentPage=${queryParams.currentPage}&perPage=${queryParams.perPage}&q=${queryParams.q || ''}&role=${queryParams.role || ''}`;
     const queryString = new URLSearchParams(filterdParams as  unknown as Record<string, string>).toString();
      return getUsers(queryString)
        .then((res) => {
          console.log("API Response: ", res?.data);  // Log the response here
          return res.data;
        })
        .catch((error) => {
          console.error("Error fetching users: ", error);
          throw error;  // Re-throw the error so that `isError` can be set to true
        });
    },
    placeholderData: keepPreviousData
  });
  console.log("Users Data: ", users);  // Log the users data here

const CreateUser = async(credential: CreateUserData) => {
  // server calling logic
  const data = await createUser(credential);
  return data;
}

  const { user } = useAuthStore();

  const  { mutate: userMutate} = useMutation({
    mutationKey: ['user'],
    // mutationFn: async (data: CreateUserData) => await createUser(data).then((res) =>res.data),
    mutationFn: CreateUser,
    onSuccess: async () => {
       queryClient.invalidateQueries({ queryKey: ['users'] });
      // logoutFromStore();
    },
  });

  const onHandleSubmit = async () => {
    await form.validateFields()
    userMutate(form.getFieldsValue());
    form.resetFields(); // Reset the form fields after submission
    // If validation passes, you can access the form values here
    console.log("Form Values: ", form.getFieldsValue());  // Log the form values here
      setDrawerOpen(false); // Close the drawer after submission
  }

  const debounceQUpdate = React.useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value}));
  },1000);
  }, []);

  const onFIlterChange = (changedValue: FieldData[]) => {
    // const values = filterForm.getFieldsValue();
    console.log("Filter Values: ", changedValue);  // Log the filter values here
    const changedFilterFileds = changedValue.reduce((acc: Record<string, unknown>, field) => {
      if (field.value !== undefined && field.value !== null) {
        acc[field.name] = field.value;
      }
      return acc;
    }, {} as Record<string, unknown>);
    console.log("Changed Filter Fields: ", changedFilterFileds);  // Log the changed filter fields here
   if('q' in changedFilterFileds) {
      debounceQUpdate(changedFilterFileds.q as string | undefined);
    } else {
    setQueryParams(prev => ({
      ...prev,
      ...changedFilterFileds
    }));
    }
  };


  if (user?.role !== 'admin') {
    return <Navigate to='/' />;
  }

  return (
    <Space direction="vertical" size='large' style={{ width: '100%' }}>
      <Flex justify='space-between' >
        <Breadcrumb
          separator={<RightOutlined />}
          items={[{ title: <Link to='/'>Dashboard</Link> }, { title: 'Users' }]}
        />

        {isFetching && <div>  <Spin indicator={<LoadingOutlined style={{fontSize:24}} spin  />} size="small" /></div>}
        {isError && <div>{error?.message || 'An error occurred'}</div>}
      </Flex>
      <Form form={filterForm} onFieldsChange={onFIlterChange}>
        <UsersFilter>
        <Button type='primary' icon={<PlusOutlined/>}
            onClick={() => setDrawerOpen(true)}
            >Add User</Button>
        </UsersFilter>
      </Form>


      <Table
        columns={columns}

        // dataSource={Array.isArray(users) ? users : []}
        dataSource={users?.users} // Ensure this is the correct path to your users data
        rowKey="id" // Ensure there's a unique key for each row
        pagination={{
          pageSize: queryParams.perPage,
          current: queryParams.currentPage,
          total: users?.count, // Ensure this is the correct path to your total count
          // showSizeChanger: true,
            onChange: (page) => setQueryParams(prev => ({ ...prev, currentPage: page })),

        }}

      />
      <Drawer
        title="Create user" width={720} destroyOnClose={true}
        style={{ background: colorBgLayout }}
        open={drawerOpen} onClose={() => {
            setDrawerOpen(false)        }}
        extra={
          <Space>
            <Button>Cancel</Button>
            <Button onClick={onHandleSubmit} type='primary' icon={<PlusOutlined/>}
            >Submit</Button>
          </Space>

        }>
        <Form layout='vertical' form={form}>
          <UserForm />
        </Form>
      </Drawer>
    </Space>
  );
};
