import { Breadcrumb, Space, Table } from 'antd';
import {RightOutlined} from '@ant-design/icons'
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../http/api';
import { User } from '../../types';

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
    render: (_text: string, record:User) => <div>{record.firstName} {record.lastName }</div>
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName',
    key: 'lastName',
    // render: (text: string) => <Link to = {`/users/${text}`}>{text}</Link>,
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
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    render: () => {
      return(
      <div>
        <Link to='/users/edit'>Edit</Link>
        </div>
      );
    } 
  }
];

export const Users = () => {
  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => {
      return getUsers().then((users) =>users.data);
    },
  });
  return (
    
    <Space direction="vertical" size ='large' style={{width: '100%'}}>
      <Breadcrumb 
        separator={<RightOutlined/>} items={[{ title: <Link to='/'>Dashboard</Link> }, {title: 'Users'}]}
       />
      {isLoading && <div>Loading...</div>}
      {isError && <div>{error.message}</div>}
      <Table columns={columns} dataSource={[users]} />
    </Space>
     

  )
}
