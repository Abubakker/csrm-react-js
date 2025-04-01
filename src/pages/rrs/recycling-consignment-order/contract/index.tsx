import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Badge,
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Popconfirm,
  message,
} from 'antd';
import { OmsRecycleOrderCreateDTO } from 'types/oms';
import UserInfo from '../components/user-info';
import ProductPriceInfo from '../components/product-price-info';
import PayInfo from '../components/pay-info';
import { fetchRecycleOrderCreate, fetchRecycleOrderDetail } from 'apis/oms';
import { useNavigate } from 'react-router-dom';
import i18n from 'i18n';
import { useAppSelector } from 'store/hooks';
import { selectGlobalInfo } from 'store/slices/globalInfoSlice';
import {
  getDempyouProduct,
  getDempyouOrderInfo,
  getDempyouToPrint,
  ProductType,
  PrintParamType,
} from 'utils/getDempyouParam';
import { UserType } from '../components/user-info';
import { getProductLabel } from 'utils/getProductLabel';
import {
  removeRecyclingConsignmentStore,
  ITEM_NAME_MAP,
} from '../components/utils';
import { useToggle } from 'react-use';
import commonApi from 'apis/common';
import { Trans } from 'react-i18next';
import LOCALS from '../../../../commons/locals';

interface OrderResult {
  orderSn: string;
  id: string;
}

const CreateOrderContract = ({ type }: { type: number }) => {
  const navigate = useNavigate();
  const [modal, contextHolder] = Modal.useModal();

  const [form0] = Form.useForm<OmsRecycleOrderCreateDTO>();
  const [form1] = Form.useForm<OmsRecycleOrderCreateDTO>();
  const [form2] = Form.useForm<OmsRecycleOrderCreateDTO>();

  const [userInfo, setUserInfo] = useState<UserType>();

  const payloadRef = useRef<OmsRecycleOrderCreateDTO>({ type });
  const {
    staffSelectOptions,
    countryOptions,
    productCategoryCascaderOptions,
    colorSelectOptions,
    rankSelectOptions,
    stampSelectOptions,
    materialCascaderOptionsMap,
    hardwareSelectOptions,
    accessorySelectOptions,
  } = useAppSelector(selectGlobalInfo);
  // 监听 form0 中的 storeId（即 createdFrom）
  const createdFrom =
    Form.useWatch('storeId', form0) || payloadRef.current.createdFrom;
  const success = () => {
    Promise.all([
      form0.validateFields(),
      form1.validateFields(),
      form2.validateFields(),
    ])
      .then(() => {
        getCreate();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const ItemName = ITEM_NAME_MAP.RECYCLING_CONSIGNMENT_CONTRACT;

  const getCreate = useCallback(() => {
    const { memberId } = payloadRef.current;
    if (!memberId) {
      message.error(i18n.t('please_select_a_member'));
      return;
    }
    fetchRecycleOrderCreate({ ...payloadRef.current })
      .then((d) => {
        removeRecyclingConsignmentStore(ItemName);
        const dParse = JSON.parse(d.data) as OrderResult[];
        modal.confirm({
          title: i18n.t('successful_operation'),
          content: (
            <div>
              {dParse.map((d) => (
                <div key={d.id}>
                  <a href={`/rrs/recycling-consignment-detail/${d.id}`}>
                    {d.orderSn}
                  </a>
                </div>
              ))}
            </div>
          ),
          onOk: async () => {
            const prodList: ProductType[] = [];
            let orderInfo: PrintParamType | undefined = undefined;
            let index = 0;
            for (const { id } of dParse) {
              const { data } = await fetchRecycleOrderDetail({ id });
              const attrOption = {
                productCategoryCascaderOptions,
                colorSelectOptions,
                rankSelectOptions,
                stampSelectOptions,
                materialCascaderOptionsMap,
                hardwareSelectOptions,
                accessorySelectOptions,
              };
              const attrProd = {
                attrAccessory: data.omsRecycleOrderProduct?.accessory,
                attrColor: data.omsRecycleOrderProduct?.attrColor,
                attrHardware: data.omsRecycleOrderProduct?.attrHardware,
                attrMaterial: data.omsRecycleOrderProduct?.attrMaterial,
                attrSize: data.omsRecycleOrderProduct?.attrSize,
                attrStamp: data.omsRecycleOrderProduct?.attrStamp,
                productCategoryId:
                  data.omsRecycleOrderProduct?.productCategoryId,
              };
              const label = getProductLabel(attrOption, attrProd);
              // 「商品名　尺寸　素材　色　刻印　金具」
              const name = `${label.productCategorySelectLabelList} ${
                label.materialSelectLabelList
              } ${label.colorSelectLabelList} ${
                data.omsRecycleOrderProduct?.fullStamp || label.stampSelectLabel
              } ${label.hardwareSelectLabel}`;
              prodList.push(getDempyouProduct(data, { name })!);
              if (index === 0) {
                orderInfo = await getDempyouOrderInfo(data, {
                  staffSelectOptions,
                  countryOptions,
                  idCertificate: data.umsMember?.idCertificate,
                });
              }
              index++;
            }
            if (prodList && orderInfo) {
              getDempyouToPrint({
                productList: prodList,
                printParam: orderInfo,
                prints: true,
              });
              navigate(`/rrs/recycling-consignment-list`);
            }
          },
          okText: <Trans i18nKey={LOCALS.yYqvdvcMFh} />,
          onCancel: () => {
            navigate(`/rrs/recycling-consignment-list`);
          },
        });
      })
      .catch((d) => {});
  }, [
    ItemName,
    accessorySelectOptions,
    colorSelectOptions,
    countryOptions,
    hardwareSelectOptions,
    materialCascaderOptionsMap,
    modal,
    navigate,
    productCategoryCascaderOptions,
    rankSelectOptions,
    staffSelectOptions,
    stampSelectOptions,
  ]);

  const [draftSaveOpen, toggleDraftSaveOpen] = useToggle(false);
  const [draftListOpen, toggleDraftListOpen] = useToggle(false);
  const [draftList, setDraftList] = useState<
    {
      title: string;
      time: number;
      data: string;
    }[]
  >([]);
  useEffect(() => {
    commonApi.recycleConsignmentDraftData().then((d) => {
      if (d) {
        setDraftList(d);
      }
    });
  }, [ItemName]);

  return (
    <div>
      <div className="flex justify-center">
        <div className="text-2xl font-medium text-center">
          {type === 1
            ? i18n.t('consignmentContractOrder')
            : i18n.t('recyclingContractOrder')}
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-full">
          <div className="mb-4">
            <Divider orientation="center">
              <div className="text-2xl">{i18n.t('member_info')}</div>
            </Divider>
            <UserInfo
              form={form0}
              orderType={type}
              type="contract"
              onChange={({ user, ...rest }) => {
                payloadRef.current = {
                  ...payloadRef.current,
                  ...rest,
                  createdFrom: rest.storeId,
                };
                setUserInfo(user);
              }}
            />
          </div>
          {/*  */}
          <div className="mb-4">
            <Divider orientation="center">
              <div className="text-2xl">{i18n.t('product_info')}</div>
            </Divider>
            <ProductPriceInfo
              form={form1}
              onChange={(data) => {
                payloadRef.current = { ...payloadRef.current, ...data };
              }}
              type="contract"
              orderType={type}
              createdFrom={createdFrom}
            />
          </div>
          {/*  */}
          <div className="mb-4">
            <Divider orientation="center">
              <div className="text-2xl">{i18n.t('payment_information')}</div>
            </Divider>
            <PayInfo
              form={form2}
              type="contract"
              orderType={type}
              onChange={(data) => {
                payloadRef.current = { ...payloadRef.current, ...data };
              }}
              userInfo={userInfo}
              createdFrom={createdFrom}
            />
          </div>
        </div>
      </div>

      {contextHolder}

      <Modal
        title={i18n.t('rluYnqBHGi')}
        open={draftSaveOpen}
        onCancel={toggleDraftSaveOpen}
        footer={null}
      >
        <Form
          onFinish={async ({ title }: { title: string }) => {
            const data = localStorage.getItem(ItemName);
            if (!data) {
              return;
            }

            draftList.push({ title, data, time: new Date().getTime() });
            await commonApi.setRecycleConsignmentDraftData(draftList);

            message.success('保存しました');

            setTimeout(() => {
              window.location.reload();
            }, 300);
          }}
        >
          <Form.Item
            label={i18n.t('title')}
            name="title"
            required
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={toggleDraftSaveOpen}> {i18n.t('cancel')}</Button>
            <Button type="primary" htmlType="submit">
              {i18n.t('save')}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        open={draftListOpen}
        onCancel={toggleDraftListOpen}
        title={i18n.t('SXpNgLWetM')}
      >
        <div className="grid gap-3">
          {draftList
            .sort(({ time: timeA }, { time: timeB }) => {
              return timeB - timeA;
            })
            .map((d, i) => (
              <div key={i} className="flex justify-between">
                <div className="flex items-center">{d.title}</div>

                <div className="flex gap-2 items-center">
                  <div>{new Date(d.time).toLocaleString()}</div>
                  <Button
                    type="primary"
                    onClick={() => {
                      localStorage.setItem(ItemName, d.data);
                      window.location.reload();
                    }}
                  >
                    {i18n.t('ThAdOdLIza')}
                  </Button>
                  <Button
                    danger
                    onClick={async () => {
                      draftList.splice(i, 1);
                      await commonApi.setRecycleConsignmentDraftData(draftList);

                      message.success('削除しました');

                      setTimeout(() => {
                        window.location.reload();
                      }, 300);
                    }}
                  >
                    {i18n.t('delete')}
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </Modal>

      <div className="fixed bottom-12 right-12">
        <div className="grid gap-2">
          <Button type="primary" onClick={() => success()}>
            {i18n.t('submit')}
          </Button>
          <Button onClick={toggleDraftSaveOpen}> {i18n.t('rluYnqBHGi')}</Button>

          <Badge count={draftList.length} size="default">
            <Button onClick={toggleDraftListOpen}>
              {i18n.t('SXpNgLWetM')}
            </Button>
          </Badge>

          <Popconfirm
            onConfirm={() => {
              form0.resetFields();
              form1.resetFields();
              form2.resetFields();
              removeRecyclingConsignmentStore(ItemName);
              window.location.reload();
            }}
            title={i18n.t('reset')}
          >
            <Button danger>{i18n.t('reset')}</Button>
          </Popconfirm>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderContract;
