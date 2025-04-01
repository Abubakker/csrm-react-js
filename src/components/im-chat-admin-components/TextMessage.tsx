import convertToHtml from './helpers/convertToHtml';

interface TextMessageProps {
  personType: string;
  value: string;
  userMedia: string;
}

export const TextMessage = ({
  personType,
  value,
  userMedia,
}: TextMessageProps) => {
  return (
    <div
      className={`static bottom-0 whitespace-pre-line break-words p-3 rounded-[10px] max-w-[calc(100%-70px)] ${
        personType === 'user'
          ? 'bg-gray-100 text-black'
          : 'bg-[#1677FF] text-white'
      }`}
    >
      <div
        id="im-text-message"
        className={`whitespace-pre-wrap text-[12px] leading-[18px] mb-0 [&_a]:underline ${
          personType !== 'user' && '[&_a]:text-white'
        }`}
        dangerouslySetInnerHTML={{
          __html:
            userMedia === 'im chat' ? convertToHtml(value) || value : value,
        }}
      />
    </div>
  );
};
