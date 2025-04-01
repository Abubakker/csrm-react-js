import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Avatar from 'react-avatar';
import { ImageMessages } from '../ImageMessages';
import { AttachmentMessage } from '../AttachmentMessage';
import { TextMessage } from '../TextMessage';
import { SocialAttachmentMessage } from '../SocialAttachmentMessage';
import TimeAgo from './TimeAgo';
import CampaignMessage from './CampaignMessage';
import { parseAndValidateJSON } from '../helpers/utils';

interface MessageBodyProps {
  key?: string;
  customer: any;
  message: any;
  userMedia: string;
}

export const MessageBody = ({
  message,
  customer,
  userMedia,
}: MessageBodyProps) => {
  const locale = useSelector((state: any) => state.imManagerSettings.locale);
  const { personType, imMessageBlockList } = message || {};
  const { t } = useTranslation();

  const { type, value, contentType, originalName, sizeString } =
    imMessageBlockList?.[0] || {};

  const timeAgo =
    userMedia === 'im chat' ? message?.createdAt : message?.created_at;

  // Helper function for rendering text messages
  const renderTextMessage = (value: any) => (
    <TextMessage
      personType={personType}
      value={value || t('not_support_msg')}
      userMedia={userMedia}
    />
  );

  const renderCampaignMessage = (value: any) => {
    const { title, description, imageUrl, buttons } = value;
    return (
      <CampaignMessage
        title={title}
        description={description}
        imageUrl={imageUrl}
        buttons={buttons}
      />
    );
  };

  // Conditionally render content based on the media type
  const renderMessageContent = () => {
    if (userMedia === 'im chat') {
      // For 'im chat' messages, render based on the type of message
      if (type === 'text') {
        const requiredFields = ['title', 'imageUrl', 'buttons', 'language'];
        const parsedData = parseAndValidateJSON(value, requiredFields);

        if (parsedData) {
          return renderCampaignMessage(parsedData);
        }

        return renderTextMessage(value);
      }
      if (type === 'file') {
        if (contentType?.[0] === 'a') {
          return (
            <AttachmentMessage
              imMessageBlockList={imMessageBlockList}
              personType={personType}
              originalName={originalName}
              sizeString={sizeString}
            />
          );
        }
        if (contentType.includes('image')) {
          return (
            <ImageMessages
              personType={personType}
              imMessageBlockList={imMessageBlockList}
              media={message?.media}
              mediaType={type}
              userMedia={userMedia}
            />
          );
        }
      }
    }

    // For non 'im chat' messages (e.g. social media)
    if (userMedia !== 'im chat') {
      if (
        message?.media_type === 'text' ||
        (message?.media_type === 'unknown' && message?.message)
      ) {
        return renderTextMessage(message?.message);
      }
      if (message?.media_type === 'document') {
        return (
          <SocialAttachmentMessage
            personType={personType}
            media={message?.media}
          />
        );
      }
      if (['sticker', 'image'].includes(message?.media_type)) {
        return (
          <ImageMessages
            personType={personType}
            imMessageBlockList={imMessageBlockList}
            media={message?.media}
            mediaType={message?.media_type}
            userMedia={userMedia}
          />
        );
      }
    }

    return null;
  };

  return (
    <div
      className={`flex items-end gap-3 font-NotoSans group ${
        personType === 'user' ? 'flex-row' : 'flex-row-reverse ml-auto'
      } ${userMedia === 'im chat' ? 'max-w-[490px]' : 'max-w-[584px]'}`}
    >
      {/* Display Avatar for 'user' type */}
      {personType === 'user' && (
        <Avatar
          name={customer.first_name || 'Unknown User'}
          round={true}
          size={'32'}
          className="w-[32px] h-[32px] rounded-full"
        />
      )}

      <div
        className={`flex items-center gap-3 font-NotoSans group w-full ${
          personType === 'user' ? 'flex-row' : 'flex-row-reverse'
        }`}
      >
        {/* Render message content based on media type */}
        {renderMessageContent()}

        {/* Time Ago */}
        {timeAgo && <TimeAgo date={new Date(timeAgo)} locale={locale} />}
      </div>
    </div>
  );
};
