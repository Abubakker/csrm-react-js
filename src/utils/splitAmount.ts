/**
 * @description 多笔支付金额拆分算法
 */
function splitAmount(totalAmount: number, count: number, firstAmount: number) {
  // 确保参数合法性
  if (count <= 1 || totalAmount < firstAmount || firstAmount < 0) {
    throw new Error('参数错误');
  }

  // 计算剩余金额
  let remainingAmount = totalAmount - firstAmount;
  // 计算每笔金额的基础值
  let baseAmount = Math.floor(remainingAmount / (count - 1));
  // 计算剩余金额需要分配的份数
  let remainingShares = count - 1;

  // 分配金额到每一笔
  let result = [firstAmount];
  for (let i = 0; i < remainingShares - 1; i++) {
    let currentAmount = Math.min(baseAmount, remainingAmount);
    result.push(currentAmount);
    remainingAmount -= currentAmount;
  }

  // 最后一笔直接使用剩余金额，确保总分配额等于原始金额
  result.push(remainingAmount);

  return result;
}

export default splitAmount;
