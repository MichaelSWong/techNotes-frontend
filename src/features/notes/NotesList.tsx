import { useGetNotesQuery } from './notesApiSlice';
import Note from './Note';
import PlaceHolder from '../../components/PlaceHolder';

const NotesList = () => {
  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery(undefined, {
    // Useful option to refetch data (stall)
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    if ('data' in error) {
      //@ts-ignore
      return <p className='errmsg'>{error?.data?.message}</p>;
    }
  }

  let tableContent;
  if (isSuccess) {
    const { ids } = notes;
    console.log(`NOTELIST_IDS: ${ids}`);

    tableContent = ids?.length ? (
      ids.map((noteId) => <Note key={noteId} noteId={noteId} />)
    ) : (
      <PlaceHolder />
    );
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
