import {
  createSelector,
  createEntityAdapter,
  EntityState,
} from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';
import { RootState } from '../../app/store';

type UserResponseType = {
  userName: string;
  password: string;
  roles: string[];
  active?: boolean;
  id?: string;
  _id?: string;
};

const usersAdapter = createEntityAdapter<UserResponseType>({});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<EntityState<unknown>, void>({
      query: () => ({
        url: `/users`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      keepUnusedDataFor: 5,
      transformResponse: (responseData: UserResponseType[]) => {
        const loadedUsers = responseData.map((user: UserResponseType) => {
          user.id = user._id;
          return user;
        });
        return usersAdapter.setAll(initialState, loadedUsers);
      },

      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'User', id: 'LIST' },
            ...result.ids.map((id: any) => ({ type: 'User' as const, id })),
          ];
        } else return [{ type: 'User', id: 'LIST' }];
      },
    }),
  }),
});

export const { useGetUsersQuery } = usersApiSlice;

// returns the query result object
export const selectusersResult = usersApiSlice.endpoints.getUsers.select();

// creates memoized selector
const selectUsersData = createSelector(
  selectusersResult,
  (usersResult) => usersResult.data // normalized state object with ids and entities
);

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  // pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(
  //@ts-ignore
  (state: RootState) => selectUsersData(state) ?? initialState
);
