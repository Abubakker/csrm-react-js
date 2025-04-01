import { ProductAttributeCodeOption } from 'commons/hooks/useProductAttributeCodeList';
import { cloneDeep } from 'lodash-es';

const setTreeIds = (
  option: ProductAttributeCodeOption,
  productAttributeCodeOptionListCopyedMap: {
    [key: string]: ProductAttributeCodeOption;
  }
) => {
  let parent = option.parentId
    ? productAttributeCodeOptionListCopyedMap[option.parentId]
    : null;
  option.treeIds = option.value;

  while (parent) {
    option.treeIds = `${parent.value},${option.treeIds}`;
    parent = parent.parentId
      ? productAttributeCodeOptionListCopyedMap[parent.parentId]
      : null;
  }
};

const buildTreeFromProductAttributeCodeList = (
  productAttributeCodeOptionList: ProductAttributeCodeOption[]
) => {
  const productAttributeCodeOptionListCopyed = cloneDeep(
    productAttributeCodeOptionList
  );

  const productAttributeCodeOptionListCopyedMap: {
    [key: string]: ProductAttributeCodeOption;
  } = {};
  productAttributeCodeOptionListCopyed.forEach((option) => {
    productAttributeCodeOptionListCopyedMap[option.id] = option;
  });

  productAttributeCodeOptionListCopyed.forEach((option) => {
    setTreeIds(option, productAttributeCodeOptionListCopyedMap);
  });

  productAttributeCodeOptionListCopyed.forEach((option) => {
    const { parentId } = option;

    if (parentId === 0) return;

    const parent = productAttributeCodeOptionListCopyedMap[parentId];

    if (!parent) return;

    if (!parent.children) {
      parent.children = [];
    }

    parent.children.push(option);
  });

  const outPutTree = productAttributeCodeOptionListCopyed.filter(
    (i) => i.parentId === 0
  );

  return outPutTree;
};

export default buildTreeFromProductAttributeCodeList;
