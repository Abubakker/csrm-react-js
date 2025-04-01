// import { Button, Form, Input } from 'antd';
// import { createProductSimple } from 'apis/pms';
// import { useMemo } from 'react';
// import { Modal } from 'antd-mobile';
// import copyToClipboard from 'utils/copyToClipboard';
// import PORTAL_ORIGIN from 'utils/getPortalOrigin';
// import { useNavigate } from 'react-router-dom';
// import LOCALS from '../../commons/locals';
// import { Trans } from 'react-i18next';
// import i18n from '../../i18n';

const AddSalesLink = () => {
  // const [form] = Form.useForm();
  // const navigate = useNavigate();

  // const productSnExample = useMemo(() => {
  //   const today = new Date();
  //   return (
  //     'INS' +
  //     today.getFullYear().toString().substr(2, 2) +
  //     ('0' + (today.getMonth() + 1)).slice(-2) +
  //     ('0' + today.getDate()).slice(-2) +
  //     ('0' + today.getHours()).slice(-2) +
  //     ('0' + today.getMinutes()).slice(-2)
  //   );
  // }, []);

  return (
    <div className="text-center text-base">
      <a
        href="/oms/order-create"
        className="text-red-500 hover:text-red-500 underline hover:underline"
      >
        This function has been offline. Click to use the new version of the
        management backend
        <br />
        この機能はオフラインになっています。新しいバージョンの管理バックグラウンドを使用するにはクリックしてください。
      </a>
    </div>
  );

  // return (
  //   <div>
  //     <p className="text-base font-semibold">{i18n.t(LOCALS.product_add)}</p>
  //     <Form
  //       form={form}
  //       layout="horizontal"
  //       initialValues={{
  //         name: 'Hermès Bag',
  //         productSn: productSnExample,
  //         price: '',
  //         expiredHours: '2',
  //       }}
  //       onFinish={() => {
  //         form.validateFields().then(async (data) => {
  //           const { data: productId } = await createProductSimple({
  //             ...data,
  //             productCategoryId: 9999,
  //           });

  //           Modal.alert({
  //             confirmText: <Trans i18nKey={LOCALS.copy_link} />,
  //             content: (
  //               <div className="text-center">
  //                 {i18n.t(LOCALS.successful_operation)}
  //               </div>
  //             ),
  //             onConfirm: () => {
  //               copyToClipboard(`${PORTAL_ORIGIN}/product/${productId}`);
  //               navigate(`/pms/product-list-mobile?keyword=${data.productSn}`);
  //             },
  //           });
  //         });
  //       }}
  //     >
  //       <Form.Item
  //         label={i18n.t(LOCALS.product_name)}
  //         required
  //         rules={[{ required: true }]}
  //         name="name"
  //       >
  //         <Input placeholder={i18n.t(LOCALS.please_enter) || ''}></Input>
  //       </Form.Item>
  //       <Form.Item
  //         label={i18n.t(LOCALS.product_sn)}
  //         required
  //         rules={[{ required: true }]}
  //         name="productSn"
  //       >
  //         <Input placeholder={i18n.t(LOCALS.please_enter) || ''}></Input>
  //       </Form.Item>
  //       <Form.Item
  //         label={i18n.t(LOCALS.price)}
  //         required
  //         rules={[{ required: true }]}
  //         name="price"
  //       >
  //         <Input placeholder={i18n.t(LOCALS.please_enter) || ''}></Input>
  //       </Form.Item>
  //       <Form.Item
  //         label={i18n.t(LOCALS.expired_hours)}
  //         required
  //         rules={[{ required: true }]}
  //         name="expiredHours"
  //       >
  //         <Input placeholder={i18n.t(LOCALS.please_enter) || ''}></Input>
  //       </Form.Item>

  //       <Button htmlType="submit" type="primary">
  //         {i18n.t(LOCALS.submit)}
  //       </Button>
  //     </Form>
  //   </div>
  // );
};

export default AddSalesLink;
