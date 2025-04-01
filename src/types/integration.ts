export type Channel = {
  url: string;
  icon: string;
  name: string;
  description: string;
};

export type Note = {
  isImportant: boolean;
  note: string;
};

export type IntegrationBtnTyp = {
  handleBtnClick: () => void;
};
