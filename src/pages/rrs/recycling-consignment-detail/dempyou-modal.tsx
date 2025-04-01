import { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import dayjs from 'dayjs';
import { DempyouType } from 'pages/prints/dempyou';
import { useForm } from 'antd/es/form/Form';
import { OmsRecycleOrderDetail, OmsRecycleOrderProductInfo } from 'types/oms';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import { useCityList } from 'apis/home';
import i18n from 'i18n';
import LOCALS from 'commons/locals';
import { CURRENCY_MAP } from 'commons/options';

interface Props {
  open: boolean;
  onCancel: () => void;
  dataSource: OmsRecycleOrderDetail;
  productInfo: OmsRecycleOrderProductInfo;
}

const DempyouModal = ({ open, onCancel, dataSource, productInfo }: Props) => {
  const [dempyouForm] = useForm();
  const { staffSelectOptions, countryOptions, rankSelectOptions } =
    useAppSelector(selectGlobalInfo);

  const cityList = useCityList(
    dataSource.omsRecycleOrderLogistics?.country || '',
  );

  useEffect(() => {
    const { name, phone, postCode, country, city, detailAddress } =
      dataSource.omsRecycleOrderLogistics || {};
    const { code, submissionId, settlementType, createBy, createTime, type } =
      dataSource.omsRecycleOrder || {};
    const { finalSalePrice, finalRecyclePrice, guestRemarks } =
      dataSource.omsRecycleOrderItem || {};

    const countryStr = countryOptions.find((d) => d.value === country);
    const countryIsJP = countryStr?.value === 'JPN';
    const countryLabel = countryIsJP ? '' : countryStr?.label;
    const cityStr = cityList.find((d) => d.code === city);
    const nameStr = countryIsJP ? `${name || '-'}  様` : `${name || '-'}`;
    const userInfo = (() => {
      const arr = [
        nameStr,
        // 香港需要展示用户的身份证信息
        dataSource.omsRecycleOrder?.currency === CURRENCY_MAP.HKD
          ? `+${phone}        ${dataSource.umsMember?.idCertificate || ''}`
          : `+${phone}`,
        `${countryLabel} ${cityStr?.name || ''} ${detailAddress} ${
          postCode || ''
        }`,
      ];

      return arr
        .map((i) => i?.trim())
        .filter(Boolean)
        .join('\n');
    })();
    const { category, info, fullStamp } = productInfo;
    let productName = ``;
    if (info && info.length) {
      productName += `${category} ${info[3].value} ${info[0].value} ${
        fullStamp || info[5].value
      } ${info[4].value}`;
    }
    const productPrice =
      (type === 1 ? finalSalePrice : finalRecyclePrice) || '';

    let rankDesc = (info && info.length && info[2].value) || '';
    // 这一步的目的是把 rankSelectOptions 里面的等级信息内容清除掉
    rankSelectOptions.forEach((item) => {
      rankDesc = rankDesc.replace(item.label, '');
    });
    dempyouForm.setFieldsValue({
      code: submissionId ? submissionId.toString() : code,
      date: dayjs(createTime).format('YYYY/MM/DD'),
      staff: createBy,
      payType: ['', i18n.t(LOCALS.iJVtIJxKRd), i18n.t(LOCALS.XLtWNsvkPj)][
        settlementType || 1
      ],
      userInfo,
      productName,
      guestRemarks: [rankDesc, guestRemarks].filter(Boolean).join(' ').trim(),
      productPrice,
    });
  }, [
    dataSource,
    countryOptions,
    cityList,
    dempyouForm,
    productInfo,
    rankSelectOptions,
  ]);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={i18n.t('yYqvdvcMFh')}
      onOk={async () => {
        const { staff, productName, guestRemarks, productPrice, ...rest } =
          dempyouForm.getFieldsValue();
        const type = dataSource.omsRecycleOrder?.type;
        const temp = {
          staff: staffSelectOptions.find((d) => d.value === staff)?.label,
          ...rest,
          totalPrice: productPrice,
          prints: true,
          productList: [
            {
              productSn: dataSource.omsRecycleOrderProduct?.productSn,
              productName,
              guestRemarks,
              productPrice,
              brandName: dataSource.omsRecycleOrderProduct?.brandName,
              productId: dataSource.omsRecycleOrderItem?.productId,
            },
          ],
          memberId: dataSource.omsRecycleOrder?.memberId,
        };
        // 判断类型
        const [t1, t2] =
          type === 1
            ? [DempyouType.sell_customer, DempyouType.sell_store]
            : [DempyouType.recycle_customer, DempyouType.recycle_store];
        // 一次性打印两张
        const encode = encodeURIComponent(
          JSON.stringify([
            { ...temp, dempyouType: t1 },
            { ...temp, dempyouType: t2 },
          ]),
        );
        window.open(`/prints/dempyou?body=${encode}`);
      }}
      width={1280}
    >
      <Form form={dempyouForm} labelCol={{ span: 8 }}>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item label={i18n.t('cGWwPIcXWq')} name="code">
            <Input disabled></Input>
          </Form.Item>
          <Form.Item label={i18n.t('date')} name="date">
            <Input></Input>
          </Form.Item>
          <Form.Item label={i18n.t('staff')} name="staff">
            <Select
              options={staffSelectOptions.map((option) => {
                return {
                  value: option.value,
                  label: option.label,
                };
              })}
            ></Select>
          </Form.Item>
          <Form.Item label={i18n.t('xzgBKptwqF')} name="payType">
            <Select
              options={[
                {
                  value: i18n.t(LOCALS.XLtWNsvkPj),
                  label: i18n.t(LOCALS.XLtWNsvkPj),
                },
                {
                  value: i18n.t(LOCALS.iJVtIJxKRd),
                  label: i18n.t(LOCALS.iJVtIJxKRd),
                },
              ]}
            ></Select>
          </Form.Item>
          <Form.Item label={i18n.t('RILmyFVuBj')} name="userInfo">
            <Input.TextArea rows={5}></Input.TextArea>
          </Form.Item>
          <Form.Item label={i18n.t('product_name')} name="productName">
            <Input.TextArea rows={5}></Input.TextArea>
          </Form.Item>
          <Form.Item label={i18n.t('guest_remarks')} name="guestRemarks">
            <Input.TextArea
              rows={5}
              placeholder={i18n.t('show_to_the_guest') || ''}
            ></Input.TextArea>
          </Form.Item>
          <Form.Item label={i18n.t('KNCVBZIrFK')} name="productPrice">
            <Input></Input>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default DempyouModal;
