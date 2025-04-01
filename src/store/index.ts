import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userInfoReducer from './slices/userInfoSlice';
import globalInfoReducer from './slices/globalInfoSlice';
import {
  imManagerChatApi,
  mediaChatApi,
} from './im-chat-stores/imManagerChatApi.js';
import imManagerSettingsSlice from './im-chat-stores/imManagerSettingsSlice.js';
import { integrationSettingsApi } from './im-chat-stores/integrationSettingsApi';
import { couponApi } from './Coupon-stores/couponApi';
import { rewardApi } from './im-chat-stores/reward.Api';
import { pushNotificationAPi } from './push-notification-stores/pushNotificationApi';
import { imOfflineResponseAPi } from './im-chat-stores/imManagerChatApi.js';
import { tagsApi } from './tags-store/tagsApi';
import socketReducer from './im-chat-stores/socketSlice.js';

export const store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
    globalInfo: globalInfoReducer,
    [imManagerChatApi.reducerPath]: imManagerChatApi.reducer,
    [imOfflineResponseAPi.reducerPath]: imOfflineResponseAPi.reducer,
    [mediaChatApi.reducerPath]: mediaChatApi.reducer,
    [integrationSettingsApi.reducerPath]: integrationSettingsApi.reducer,
    [couponApi.reducerPath]: couponApi.reducer,
    [rewardApi.reducerPath]: rewardApi.reducer,
    [pushNotificationAPi.reducerPath]: pushNotificationAPi.reducer,
    [tagsApi.reducerPath]: tagsApi.reducer,
    imManagerSettings: imManagerSettingsSlice,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      imManagerChatApi.middleware,
      integrationSettingsApi.middleware,
      couponApi.middleware,
      rewardApi.middleware,
      pushNotificationAPi.middleware,
      imOfflineResponseAPi.middleware,
      mediaChatApi.middleware,
      integrationSettingsApi.middleware,
      tagsApi.middleware
    ),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
