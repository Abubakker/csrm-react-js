import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedCustomer: null,
  selectedSession: null,
  resetCurrentSessionList: '',
  resetAllSessionList: '',
  messageList: [],
  locale: null,
  baseUrl: null,
  authToken: null,
  pluginKey: null,
  loginUrl: null,
  filterTagIds: [],
};

const imManagerSettings = createSlice({
  name: 'imManagerSettings',
  initialState,
  reducers: {
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
    setSelectedSession: (state, action) => {
      state.selectedSession = action.payload;
    },
    resetCurrentSession: (state) => {
      state.resetCurrentSessionList = Date.now();
    },
    resetAllSession: (state) => {
      state.resetAllSessionList = Date.now();
    },
    storeLocale: (state, action) => {
      state.locale = action.payload;
    },
    resetLocale: (state) => {
      state.locale = null;
    },
    storeBaseUrl: (state, action) => {
      state.baseUrl = action.payload;
    },
    resetBaseUrl: (state) => {
      state.baseUrl = null;
    },
    storePluginKey: (state, action) => {
      state.pluginKey = action.payload;
    },
    resetPluginKey: (state) => {
      state.pluginKey = null;
    },
    storeAuthToken: (state, action) => {
      state.authToken = action.payload;
    },
    resetAuthToken: (state) => {
      state.authToken = null;
    },
    insertMessage: (state, action) => {
      if (state.selectedSession?.id === action?.payload[0]?.imChatId) {
        const newMessages = action.payload;
        const messageMap = new Map(
          state.messageList.map((message) => [message.id, message])
        );
        newMessages.forEach((message) => messageMap.set(message.id, message));
        state.messageList = Array.from(messageMap.values());
      }
    },
    resetMessageList: (state) => {
      state.messageList = [];
    },
    setFilterTagIds: (state, action) => {
      state.filterTagIds = action.payload;
    },
  },
});

export const {
  setSelectedCustomer,
  setSelectedSession,
  resetCurrentSession,
  resetAllSession,
  storeLocale,
  resetLocale,
  storeBaseUrl,
  resetBaseUrl,
  storePluginKey,
  resetPluginKey,
  storeAuthToken,
  resetAuthToken,
  insertMessage,
  resetMessageList,
  setFilterTagIds,
} = imManagerSettings.actions;

export default imManagerSettings.reducer;
