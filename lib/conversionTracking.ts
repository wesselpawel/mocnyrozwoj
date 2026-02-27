declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

export const trackConversion = (
  conversionId: string,
  conversionLabel: string,
  value?: number,
  currency: string = "PLN"
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "conversion", {
      send_to: `AW-17358957721/${conversionId}`,
      value: value,
      currency: currency,
      transaction_id: `${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
    });
  }
};

export const trackPurchase = (
  transactionId: string,
  value: number,
  currency: string = "PLN",
  items?: Array<{
    item_id: string;
    item_name: string;
    price: number;
    quantity: number;
  }>
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "purchase", {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items,
    });
  }
};

export const trackBeginCheckout = (
  value: number,
  currency: string = "PLN",
  items?: Array<{
    item_id: string;
    item_name: string;
    price: number;
    quantity: number;
  }>
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "begin_checkout", {
      value: value,
      currency: currency,
      items: items,
    });
  }
};
