import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '../../app/hooks';
import { selectUserById } from './usersApiSlice';

interface UserProps {
  userId: string | number;
}

const User = ({ userId }: UserProps) => {
  const user = useAppSelector((state) => selectUserById(state, userId));

  const navigate = useNavigate();

  if (user) {
    const handleEdit = () => navigate(`/dash/users/${userId}`);

    const userRolesString = user.roles.toString().replaceAll(',', ', ');

    const cellStatus = user.active ? '' : 'table__cell--inactive';

    return (
      <>
        <tr className='table__row user'>
          <td className={`table__cell ${cellStatus}`}>{user.userName}</td>
          <td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
          <td className={`table__cell ${cellStatus}`}>
            <button className='icon-button table__button' onClick={handleEdit}>
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
          </td>
        </tr>
      </>
    );
  } else return null;
};
export default User;
