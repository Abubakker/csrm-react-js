import {
  InstagramIcon,
  LineIcon,
  MessengerIcon,
  WeChatIcon,
  WhatsAppIcon,
} from 'assets/images';

export const shortenString = (str: string, maxLength: number) =>
  str?.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str;

export const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
};

export const getSocialIcon = (mediaType: string) => {
  switch (mediaType) {
    case 'messenger':
      return MessengerIcon;
    case 'instagram':
      return InstagramIcon;
    case 'line':
      return LineIcon;
    case 'whatsapp':
      return WhatsAppIcon;
    case 'wechat':
      return WeChatIcon;
    default:
      return null;
  }
};

export const getTagStyles = (tagColor: string) => ({
  backgroundColor: `rgba(${hexToRgb(tagColor)}, 0.1)`,
  color: tagColor,
  borderColor: `rgba(${hexToRgb(tagColor)}, 0.5)`,
});

export const isObjectWithFields = (value, fields) => {
  return (
    value &&
    typeof value === 'object' &&
    true &&
    fields.every((field) => field in value)
  );
};

export const parseAndValidateJSON = (jsonString, requiredFields) => {
  try {
    const parsed = JSON.parse(jsonString);
    if (isObjectWithFields(parsed, requiredFields)) {
      return parsed;
    }
  } catch (e) {
    // 解析失败或者不是有效的JSON
  }
  return null;
};
