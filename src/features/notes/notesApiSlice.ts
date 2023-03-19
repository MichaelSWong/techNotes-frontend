import {
  createSelector,
  createEntityAdapter,
  EntityState,
} from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';
import { RootState } from '../../app/store';

type NoteResponseType = {
  userName: string;
  title: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  id?: string;
  _id?: string;
};

const notesAdapter = createEntityAdapter<NoteResponseType>({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query<EntityState<unknown>, void>({
      query: () => ({
        url: `/notes`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      keepUnusedDataFor: 5,
      transformResponse: (responseData: NoteResponseType[]) => {
        const loadedNotes = responseData.map((note: NoteResponseType) => {
          note.id = note._id;
          return note;
        });
        return notesAdapter.setAll(initialState, loadedNotes);
      },

      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Note', id: 'LIST' },
            ...result.ids.map((id: any) => ({ type: 'Note' as const, id })),
          ];
        } else return [{ type: 'Note', id: 'LIST' }];
      },
    }),
  }),
});

export const { useGetNotesQuery } = notesApiSlice;

// returns the query result object
export const selectnotesResult = notesApiSlice.endpoints.getNotes.select();

// creates memoized selector
const selectNotesData = createSelector(
  selectnotesResult,
  (notesResult) => notesResult.data // normalized state object with ids and entities
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
  // pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors(
  //@ts-ignore
  (state: RootState) => selectNotesData(state) ?? initialState
);
