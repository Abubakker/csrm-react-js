import { CascaderOption } from 'types/base';

const findCascaderOptionById = (
  id: CascaderOption['value'],
  options: CascaderOption[]
) => {
  let target: CascaderOption | undefined;

  const innerFun = (option: CascaderOption) => {
    if (target) return;

    if (option.value === id) {
      target = option;
      return;
    } else {
      option?.children?.forEach((option) => {
        innerFun(option);
      });
    }
  };

  options.forEach((option) => {
    innerFun(option);
  });

  return target;
};

export default findCascaderOptionById;
