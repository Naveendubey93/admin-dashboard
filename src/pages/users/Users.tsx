import { Breadcrumb, Space, Table } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../http/api';
import { User } from '../../types';
import { useAuthStore } from '../../store';
import UsersFilter from './UsersFilter';

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
    render: (_text: string, record: User) => {
      // Safeguard against undefined record
      if (!record) return null;
      return <div>{record.firstName} {record.lastName}</div>;
    }
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
  }
];

export const Users = () => {
  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => {
      return getUsers()
        .then((res) => {
          console.log("API Response: ", res);  // Log the response here
          return res.data;
        })
        .catch((error) => {
          console.error("Error fetching users: ", error);
          throw error;  // Re-throw the error so that `isError` can be set to true
        });
    },
  });


  const { user } = useAuthStore();
  if (user?.role !== 'admin') {
    return <Navigate to='/' />;
  }

  return (
    <Space direction="vertical" size='large' style={{ width: '100%' }}>
      <Breadcrumb
        separator={<RightOutlined />}
        items={[{ title: <Link to='/'>Dashboard</Link> }, { title: 'Users' }]}
      />

      {isLoading && <div>Loading...</div>}
      {isError && <div>{error?.message || 'An error occurred'}</div>}

      <UsersFilter onFilterChange={(filterName, filterValue) => {
        console.log({ filterName, filterValue });
      }}/>
      <Table
        columns={columns}
        dataSource={Array.isArray(users) ? users : []}  
        rowKey="id" // Ensure there's a unique key for each row
      />
    </Space>
  );
};
