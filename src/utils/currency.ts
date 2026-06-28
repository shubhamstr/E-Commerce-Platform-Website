export const CONVERSION_RATE = 94;

export const convertUsdToInr = (usdAmount: any): number => {
  const amount = parseFloat(usdAmount) || 0;
  return amount * CONVERSION_RATE;
};

export const formatPrice = (usdAmount: any): string => {
  const inrAmount = convertUsdToInr(usdAmount);
  return `₹${inrAmount.toFixed(2)}`;
};
