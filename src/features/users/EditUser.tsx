import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import EditUserForm from './EditUserForm';
useAppSelector;
import { selectUserById } from './usersApiSlice';

const EditUser = () => {
  const { id } = useParams();

  const user = useAppSelector((state) => selectUserById(state, id as string));

  return <>{user ? <EditUserForm user={user} /> : <p>Loading...</p>}</>;
};
export default EditUser;
