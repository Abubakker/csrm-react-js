export const priceToWithoutTax = (priceWithTax: number) => {
  return Math.ceil((priceWithTax * 10) / 11);
};

export const priceToWithTax = (priceWithoutTax: number) => {
  return Math.ceil((priceWithoutTax * 11) / 10);
};
