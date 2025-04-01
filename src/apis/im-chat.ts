export const getImChatBaseUrl = () => {
  return process.env.REACT_APP_IM_CHAT_BASE_API || '';
};

export const socketBaseUrl = process.env.REACT_APP_IM_CHAT_SOCKET_API;
