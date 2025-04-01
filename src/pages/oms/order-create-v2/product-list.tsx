import { Descriptions, Select } from 'antd';
import {
  CHECKOUT_OUT_PRODUCT_PRICE_TYPE,
  CHECKOUT_OUT_PRODUCT_PRICE_TYPE_OPTION_LIST,
  PMS_PRODUCT_STOCK_STATUS_OPTION_LIST,
  PUBLISH_STATUS_OPTION_LIST,
  STOCK_PLACE_OPTION_LIST,
  findLabelByValue,
} from 'commons/options';
import { Link } from 'react-router-dom';
import { PmsProduct } from 'types/pms';
import { thousands } from 'utils/tools';
import { CloseOutlined } from '@ant-design/icons';
import i18n from '../../../i18n';
import LOCALS from '../../../commons/locals';
import { StoreConfirmOrder } from 'types/oms';

interface Props {
  productList: (PmsProduct & { isTaxFree: number })[];
  onDelete: (id: PmsProduct['id']) => void;
  onPriceTypeChange: (data: { productId: number; priceType: string }) => void;
  confirmOrderInfo?: StoreConfirmOrder;
}

const ProductList = ({
  productList,
  onDelete,
  onPriceTypeChange,
  confirmOrderInfo,
}: Props) => {
  return (
    <div>
      {productList.map((product) => {
        const {
          pic,
          id,
          name,
          productSn,
          price,
          currency,
          stockPlace,
          publishStatus,
          stock,
          stockStatus,
        } = product;

        const orderItem = confirmOrderInfo?.omsOrderItems.find(
          (i) => i.productId === id
        );

        return (
          <div
            key={id}
            className="w-full p-2 mb-2 rounded border border-gray-200 flex items-center relative"
          >
            <button
              className="absolute top-0 right-0 p-2 bg-gray-300 text-white rounded-tr"
              onClick={() => {
                onDelete(id);
              }}
            >
              <CloseOutlined />
            </button>
            <img
              src={pic}
              alt={name}
              className="w-24 h-24 lg:w-32 lg:h-32 shrink-0 mr-4"
            />

            <Descriptions size="small">
              <Descriptions.Item
                label={i18n.t(LOCALS.product_sn) || '商品编号'}
              >
                <Link to={`/pms/product-view/${id}`} target="_blank">
                  {productSn}
                </Link>
              </Descriptions.Item>
              <Descriptions.Item
                label={i18n.t(LOCALS.product_name) || '商品名称'}
              >
                {name}
              </Descriptions.Item>
              <Descriptions.Item label={i18n.t(LOCALS.stock_place) || '库存地'}>
                {findLabelByValue(stockPlace, STOCK_PLACE_OPTION_LIST)}
              </Descriptions.Item>
              <Descriptions.Item label={i18n.t(LOCALS.price) || '商品价格'}>
                {`${currency} ${thousands(
                  orderItem ? orderItem.productPriceActualCurrency : price
                )}`}
              </Descriptions.Item>
              <Descriptions.Item
                label={i18n.t(LOCALS.price_type) || 'price_type'}
              >
                <Select
                  className="w-32"
                  size="small"
                  value={
                    product.isTaxFree
                      ? CHECKOUT_OUT_PRODUCT_PRICE_TYPE.WITH_OUT_TAX
                      : CHECKOUT_OUT_PRODUCT_PRICE_TYPE.WITH_TAX
                  }
                  options={CHECKOUT_OUT_PRODUCT_PRICE_TYPE_OPTION_LIST}
                  onChange={(value) => {
                    onPriceTypeChange({
                      priceType: value,
                      productId: id,
                    });
                  }}
                ></Select>
              </Descriptions.Item>

              <Descriptions.Item label={i18n.t(LOCALS.uMihwkqqts)}>
                {findLabelByValue(
                  stockStatus,
                  PMS_PRODUCT_STOCK_STATUS_OPTION_LIST
                )}
              </Descriptions.Item>
              <Descriptions.Item
                label={i18n.t(LOCALS.publish_status) || '上架状态'}
              >
                {findLabelByValue(publishStatus, PUBLISH_STATUS_OPTION_LIST)}
                {` / ${stock}`}
              </Descriptions.Item>
            </Descriptions>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;
