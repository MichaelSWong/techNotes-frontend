import { useGetNotesQuery } from './notesApiSlice';
import Note from './Note';

const NotesList = () => {
  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    //@ts-ignore
    return <p className='errmsg'>{error?.data?.message}</p>;
  }
  let tableContent;
  if (isSuccess) {
    const { ids } = notes;

    tableContent = ids?.length
      ? ids.map((noteId) => <Note key={noteId} noteId={noteId} />)
      : null;
  }
  return (
    <table className='table table--notes'>
      <thead className='table__thead'>
        <tr>
          <th scope='col' className='table__th note__status'>
            Status
          </th>
          <th scope='col' className='table__th note__created'>
            Created
          </th>
          <th scope='col' className='table__th note__updated'>
            Updated
          </th>
          <th scope='col' className='table__th note__title'>
            Title
          </th>
          <th scope='col' className='table__th note__userName'>
            Owner
          </th>
          <th scope='col' className='table__th note__edit'>
            Edit
          </th>
        </tr>
      </thead>
      <tbody>{tableContent}</tbody>
    </table>
  );
};
export default NotesList;
