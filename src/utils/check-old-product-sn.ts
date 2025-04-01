import { CURRENCY_MAP } from 'commons/options';

/**
 *
 * @description 校验旧商品编号和商品币种是否匹配
 */
const checkOldProductSn = ({
  oldProductSn,
  currency,
}: {
  oldProductSn?: string;
  currency: string;
}) => {
  // 没有填写旧商品编号，默认通过校验
  if (!oldProductSn) return true;

  // 校验必须为纯数字
  if (!/^\d+$/.test(oldProductSn)) return false;

  // 目前是必定小于等于 8 位数字
  if (oldProductSn.length > 8) return false;

  // 新加坡规则
  if (
    oldProductSn.length === 8 &&
    oldProductSn.startsWith('3') &&
    currency === CURRENCY_MAP.SGD
  )
    return true;

  // 香港规则
  if (
    oldProductSn.length === 8 &&
    oldProductSn.startsWith('1') &&
    currency === CURRENCY_MAP.HKD
  )
    return true;

  // 日本规则
  if (oldProductSn.length < 8 && currency === CURRENCY_MAP.JPY) return true;

  return false;
};

export default checkOldProductSn;
