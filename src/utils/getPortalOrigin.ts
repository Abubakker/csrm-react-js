const getPortalOrigin = () => {
  if (window.location.host === 'admin-shop.ginzaxiaoma.com') {
    return 'https://ginzaxiaoma.com';
  } else {
    return 'https://test-shop.ginzaxiaoma.com';
  }
};

const PORTAL_ORIGIN = getPortalOrigin();

export const getOrderDetailPageUrl = (orderId: number) => {
  return `${PORTAL_ORIGIN}/order?orderId=${orderId}`;
};

export default PORTAL_ORIGIN;
