import { Button } from 'antd';

const docsLink =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRsvuQS5-nq6pGfly5xGYg3gjWcmVbDQhb4ZmIdz9veG6Fq5-yjEqJmHD6lpvmBg58qNdZMvjA5zAML/pubhtml';
const SOP = () => {
  return (
    <div className="h-[75vh]">
      <div className="text-right mb-2">
        <Button type="link" onClick={() => window.open(docsLink)}>
          New page open
        </Button>
      </div>
      <iframe className="w-full h-full" title="Docs" src={docsLink} />
    </div>
  );
};

export default SOP;
