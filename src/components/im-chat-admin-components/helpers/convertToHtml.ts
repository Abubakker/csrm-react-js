import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';

const convertToHtml = (value: any) => {
  let parsedData;
  try {
    parsedData = JSON.parse(value);
  } catch (e) {
    parsedData = null;
  }
  const converter = new QuillDeltaToHtmlConverter(parsedData || [], {});
  return converter.convert();
};

export default convertToHtml;
