import { useGetUsersQuery } from './usersApiSlice';
import User from './User';
import PlaceHolder from '../../components/PlaceHolder';

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery();

  if (isLoading) {
    return <p>{isLoading}</p>;
  }

  if (isError) {
    if ('data' in error) {
      //@ts-ignore
      return <p className='errmsg'>{error?.data?.message}</p>;
    }
  }
  let tableContent;
  if (isSuccess) {
    const { ids } = users;
    tableContent = ids?.length ? (
      ids.map((userId) => <User key={userId} userId={userId} />)
    ) : (
      <PlaceHolder />
    );
  }
  return (
    <>
      <table className='table table--users'>
        <thead className='table__thead'>
          <tr>
            <th scope='col' className='table__th user__username'>
              Username
            </th>
            <th scope='col' className='table__th user__roles'>
              Roles
            </th>
            <th scope='col' className='table__th user__edit'>
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    </>
  );
};
export default UsersList;
