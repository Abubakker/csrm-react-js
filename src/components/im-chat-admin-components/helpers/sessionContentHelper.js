export const sessionContent = (session, translation) => {
  let { personType } = session?.latestImMessage || { personType: 'user' }
  let { type: messageType, value: lastTextMessage} = session?.latestImMessage?.imMessageBlockList?.[0] || {}
  let numberOfAttachments = session?.latestImMessage?.imMessageBlockList?.length

  const getAttachmentMessage = (count) => {
    return count === 1
      ? translation('Sent an attachment')
      : translation('Sent {{count}} attachments', { count });
  };

  return {
    lastMessage: messageType === 'text' ? lastTextMessage : getAttachmentMessage(numberOfAttachments),
    personType
  }
};