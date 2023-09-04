import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const chatAPISlice = createApi({
  reducerPath: 'chatAPI',
  baseQuery: fetchBaseQuery({baseUrl: 'http://192.168.111.34:3001/api'}),
  endpoints: builder => ({
    getAllChats: builder.query<Chat[], String>({
      query: () => '/allChats',
    }),
    getChat: builder.query<Chat, String>({
      query: (id: string) => `/chat/${id}`,
    }),
    addChat: builder.mutation({
      query: (palyload: ChatPayload) => ({
        url: '/addChat',
        method: 'POST',
        body: palyload,
      }),
      transformResponse: (response: Chat) => {
        return response;
      },
    }),
    editChat: builder.mutation({
      query: (chat: Chat) => ({
        url: `/chat/${chat.id}`,
        method: 'PUT',
        body: chat,
      }),
    }),
    deleteChat: builder.mutation({
      query: (id: number) => ({
        url: `/chat/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetAllChatsQuery,
  useGetChatQuery,
  useAddChatMutation,
  useEditChatMutation,
  useDeleteChatMutation,
} = chatAPISlice;
