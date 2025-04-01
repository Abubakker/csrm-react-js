import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import '../style.css';
import PreviewSection from './PreviewSection';
import InputResponseField from './InputResponseField';
import InputTitleField from './InputTitleField';

interface OfflineResponseContent {
  buttonText: string;
  responseText: string;
  lang: string;
}

interface CreateOffLineResponseContentProps {
  setOfflineResponse: Dispatch<SetStateAction<OfflineResponseContent[]>>;
  offlineResponse: OfflineResponseContent[];
  language: string;
  errors: { buttonText: string; responseText: string };
  setErrors: (errors: { buttonText: string; responseText: string }) => void;
  setDiscard: (discard: boolean) => void;
  discard: boolean;
}

const CreateOffLineResponseContent = ({
  setOfflineResponse,
  offlineResponse,
  language,
  errors,
  setErrors,
  setDiscard,
  discard,
}: CreateOffLineResponseContentProps) => {
  const [buttonText, setButtonText] = useState('');
  const [responseText, setResponseText] = useState('');

  // Initialize state from the selected language
  useEffect(() => {
    const activeContent = offlineResponse.find(
      (content) => content.lang === language
    );
    if (activeContent) {
      setButtonText(activeContent.buttonText || '');
      setResponseText(activeContent.responseText || '');
    } else {
      setButtonText('');
      setResponseText('');
    }
    setDiscard(false);
  }, [language, discard]);

  // Update the offlineResponse when buttonText or responseText changes
  const handleUpdateOfflineResponse = () => {
    const updatedContents: OfflineResponseContent[] = offlineResponse.map(
      (content: OfflineResponseContent) => {
        if (content.lang === language) {
          return {
            ...content,
            buttonText,
            responseText,
          };
        }
        return content;
      }
    );
    setOfflineResponse(updatedContents);
    setErrors({ buttonText: '', responseText: '' });
  };

  useEffect(() => {
    handleUpdateOfflineResponse();
  }, [buttonText, responseText]);

  return (
    <div>
      {/* response create and Preview Section */}
      <div className="grid grid-cols-2 gap-8 bg-[#F7F8FC] p-6 rounded-[10px]">
        {/* Left: Button and Response */}
        <div className="pr-[36px]">
          <InputTitleField
            value={buttonText}
            onChange={setButtonText}
            error={errors.buttonText}
          />

          <InputResponseField
            value={responseText}
            onChange={setResponseText}
            error={errors.responseText}
          />
        </div>
        {/* Right: Preview */}
        <PreviewSection buttonText={buttonText} responseText={responseText} />
      </div>
    </div>
  );
};

export default CreateOffLineResponseContent;
