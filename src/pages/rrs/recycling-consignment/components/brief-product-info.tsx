import { memo, useState, useEffect } from 'react';
import styles from './index.module.scss';
import { OmsRecycleOrderItem, OmsRecycleOrderDetail } from 'types/oms';
import { Collapse, Card } from 'antd';
import {
  AccessoriesMapping,
  ProductImageSort,
} from 'constants/RecyclingConsignment';
import { ShowDataType } from 'commons/hooks/useProductFormData';
import ImageSliceShow from 'components/image-slice-show';
import { CaretRightOutlined } from '@ant-design/icons';
import i18n from '../../../../i18n';
import LOCALS from '../../../../commons/locals';

const BriefProductInfo = ({
  data,
  showData,
}: {
  data?: OmsRecycleOrderDetail;
  showData?: ShowDataType;
}) => {
  /** C 端填写的 */
  const [info, setInfo] = useState<OmsRecycleOrderItem>({});
  /** 数据库保存的 */
  const [showInfo, setShowInfo] = useState<ShowDataType>({});
  /** 图片 */
  const [imageList, setImageList] = useState<string[]>([]);
  /** 邮寄信息 */
  const [receivedList, setReceivedList] = useState<string[]>([]);

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;
    if (data?.omsRecycleOrderItem) {
      const {
        productTitle,
        productPics,
        productAccessories,
        productStatus = 0,
      } = data.omsRecycleOrderItem;
      const info: any = {
        productTitle,
        productPics: [],
        productAccessories: '',
        productStatus: ['', i18n.t(LOCALS.unused), i18n.t(LOCALS.secondhand)][
          productStatus
        ],
      };
      if (productPics) {
        const picList: string[] = [];
        const picsParse = JSON.parse(productPics);
        if (picsParse) {
          // 处理图片顺序
          ProductImageSort.forEach((d) => {
            if (picsParse[d]) picList.push(picsParse[d]);
          });
        }
        info.productPics = picList;
        setImageList(picList);
      }
      if (productAccessories) {
        const access = JSON.parse(productAccessories);
        const list = access.map((d: string) => AccessoriesMapping[d]);
        info.productAccessories = list.join('、');
      }
      setInfo(info);
    }
    if (data?.omsRecycleOrderLogistics?.receiptPics) {
      const img = JSON.parse(data?.omsRecycleOrderLogistics.receiptPics);
      setReceivedList(img);
    }
    if (showData) {
      setShowInfo(showData);
      setImageList(showData.imageList || []);
    }
  }, [data, showData]);

  return (
    <Card
      title={i18n.t(LOCALS.product_information)}
      size="small"
      style={{ marginBottom: 24 }}
    >
      <div className={styles.shopInfo}>
        <div className={styles.img}>
          <ImageSliceShow
            imgList={imageList}
            endSliceNumber={imageList.length}
            style={{ marginRight: 24 }}
          />
        </div>
        <div className={styles.detail}>
          <div className={styles.subtitle}>
            {showInfo && !showInfo?.productCategorySelectLabelList ? (
              <>
                <span>{info.productStatus}</span>
                &nbsp;&nbsp;&nbsp;
                <span>{info.productTitle}</span>
                &nbsp;&nbsp;&nbsp;
                <span>{info.productAccessories}</span>
                <div className="mr-2">
                  <span className="text-[#333] font-[800]">
                    {i18n.t(LOCALS.note)}：
                  </span>
                  <span className="text-[#666] ">
                    {data?.omsRecycleOrder?.memberRemark}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="mr-2 inline-block">
                  <span className="text-[#333] font-[800]">
                    {i18n.t(LOCALS.rank)}：
                  </span>
                  <span className="text-[#666] ">
                    {showInfo.rankSelectLabel}
                  </span>
                </div>
                <div className="mr-2 inline-block">
                  <span className="text-[#333] font-[800]">
                    {i18n.t(LOCALS.bag_style)}：
                  </span>
                  <span className="text-[#666] ">
                    {showInfo.productCategorySelectLabelList}
                  </span>
                </div>
                <div className="mr-2 inline-block">
                  <span className="text-[#333] font-[800]">
                    {i18n.t(LOCALS.color)}：
                  </span>
                  <span className="text-[#666] ">
                    {showInfo.colorSelectLabelList}
                  </span>
                </div>
                <div className="mr-2 inline-block">
                  <span className="text-[#333] font-[800]">
                    {i18n.t(LOCALS.material)}：
                  </span>
                  <span className="text-[#666] ">
                    {showInfo.materialSelectLabelList}
                  </span>
                </div>
                <div className="mr-2 inline-block">
                  <span className="text-[#333] font-[800]">
                    {i18n.t(LOCALS.hardware)}：
                  </span>
                  <span className="text-[#666] ">
                    {showInfo.hardwareSelectLabel}
                  </span>
                </div>
                <div className="mr-2 inline-block">
                  <span className="text-[#333] font-[800]">
                    {i18n.t(LOCALS.stamp)}：
                  </span>
                  <span className="text-[#666] ">
                    {showInfo.stampSelectLabel}
                  </span>
                </div>
                <div className="mr-2 inline-block">
                  <span className="text-[#333] font-[800]">
                    {i18n.t(LOCALS.accessories)}：
                  </span>
                  <span className="text-[#666] ">
                    {showInfo.accessorySelectLabel}
                  </span>
                </div>
                <div className="mr-2">
                  <span className="text-[#333] font-[800]">
                    {i18n.t(LOCALS.note)}：
                  </span>
                  <span className="text-[#666] ">
                    {data?.omsRecycleOrder?.memberRemark}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
        {receivedList && receivedList.length > 0 && (
          <div className={styles.cargo}>
            <Collapse
              bordered={false}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
              style={{ background: '#fff' }}
              size="small"
              items={[
                {
                  key: '1',
                  label: i18n.t(LOCALS.receipt_photo),
                  children: <ImageSliceShow imgList={receivedList} />,
                },
              ]}
            />
          </div>
        )}
      </div>
    </Card>
  );
};
export default memo(BriefProductInfo);
