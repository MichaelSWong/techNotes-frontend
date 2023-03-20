import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectNoteById } from './notesApiSlice';
import { selectAllUsers } from '../users/usersApiSlice';
import EditNoteForm from './EditNoteForm';

const EditNote = () => {
  const { id } = useParams();

  const note = useAppSelector((state) => selectNoteById(state, id as string));
  const users = useAppSelector(selectAllUsers);

  return (
    <>
      {note && users ? (
        <EditNoteForm note={note} users={users} />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default EditNote;
