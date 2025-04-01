import AddLanguage from 'components/shared/AddLanguage';

interface LanguageSectionProps {
  setContents: (contents: any) => void;
  contents: any[];
  setSelectedButton: (button: any) => void;
  selectedButton: any;
  contentsItem: any;
}

const LanguageSection = ({
  setContents,
  contents,
  setSelectedButton,
  selectedButton,
  contentsItem,
}: LanguageSectionProps) => {
  return (
    <AddLanguage
      setContents={setContents}
      contents={contents}
      setSelectedButton={setSelectedButton}
      selectedButton={selectedButton}
      contentsItem={contentsItem}
    />
  );
};

export default LanguageSection;
