import { useState, useEffect } from 'react';
import { useUpdateUserMutation, useDeleteUserMutation } from './usersApiSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { ROLES } from '../../config/roles';
import { UserProps } from '../../ts/interfaces/features_interfaces';

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

interface EditUserFormProps {
  user: UserProps;
}

const EditUserForm = ({ user }: EditUserFormProps) => {
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const [
    deleteUser,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteUserMutation();

  const navigate = useNavigate();

  const [userName, setUserName] = useState(user.userName);
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(user.roles);
  const [active, setActive] = useState(user.active);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(userName));
  }, [userName]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    console.log(isSuccess);
    if (isSuccess || isDelSuccess) {
      setUserName('');
      setPassword('');
      setRoles([]);
      navigate('/dash/users');
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onUsernameChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUserName(e.target.value);
  const onPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const onRolesChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setRoles(values);
  };

  const onActiveChanged = () => setActive((prev) => !prev);

  const onSaveUserClicked = async (e: React.FormEvent) => {
    if (password) {
      await updateUser({ id: user.id, userName, password, roles, active });
    } else {
      await updateUser({ id: user.id, userName, roles, active });
    }
  };

  const onDeleteUserClicked = async () => {
    await deleteUser({ id: user.id });
  };

  const options = Object.values(ROLES).map((role) => {
    return (
      <option key={role} value={role}>
        {' '}
        {role}
      </option>
    );
  });

  let canSave;
  if (password) {
    canSave =
      [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;
  } else {
    canSave = [roles.length, validUsername].every(Boolean) && !isLoading;
  }

  const errClass = isError || isDelError ? 'errmsg' : 'offscreen';
  const validUserClass = !validUsername ? 'form__input--incomplete' : '';
  const validPwdClass =
    password && !validPassword ? 'form__input--incomplete' : '';
  const validRolesClass = !Boolean(roles.length)
    ? 'form__input--incomplete'
    : '';

  //@ts-ignore
  const errContent = (error?.data?.message || delerror?.data?.message) ?? '';

  return (
    <>
      <p className={errClass}>{errContent}</p>

      <form className='form' onSubmit={(e) => e.preventDefault()}>
        <div className='form__title-row'>
          <h2>Edit User</h2>
          <div className='form__action-buttons'>
            <button
              className='icon-button'
              title='Save'
              onClick={onSaveUserClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className='icon-button'
              title='Delete'
              onClick={onDeleteUserClicked}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>
        <label className='form__label' htmlFor='userName'>
          Username: <span className='nowrap'>[3-20 letters]</span>
        </label>
        <input
          className={`form__input ${validUserClass}`}
          id='userName'
          name='userName'
          type='text'
          autoComplete='off'
          value={userName}
          onChange={onUsernameChanged}
        />

        <label className='form__label' htmlFor='password'>
          Password: <span className='nowrap'>[empty = no change]</span>{' '}
          <span className='nowrap'>[4-12 chars incl. !@#$%]</span>
        </label>
        <input
          className={`form__input ${validPwdClass}`}
          id='password'
          name='password'
          type='password'
          value={password}
          onChange={onPasswordChanged}
        />

        <label
          className='form__label form__checkbox-container'
          htmlFor='user-active'
        >
          ACTIVE:
          <input
            className='form__checkbox'
            id='user-active'
            name='user-active'
            type='checkbox'
            checked={active}
            onChange={onActiveChanged}
          />
        </label>

        <label className='form__label' htmlFor='roles'>
          ASSIGNED ROLES:
        </label>
        <select
          id='roles'
          name='roles'
          className={`form__select ${validRolesClass}`}
          multiple={true}
          size={3}
          value={roles}
          onChange={onRolesChanged}
        >
          {options}
        </select>
      </form>
    </>
  );
};

export default EditUserForm;
