import { Button, Modal } from 'antd';
import usePosPrinter from 'commons/hooks/use-pos-printer';
import { SHOP_MAP } from 'commons/options';
import { useRef } from 'react';
import { useToggle } from 'react-use';
import { OmsOrderDetail } from 'types/oms';
import html2canvas from 'html2canvas';
import connectToPosPrinter from 'utils/connect-to-pos-printer';
import i18n from 'i18next';

const PrintRyoshushoButton = ({
  omsOrderDetail,
}: {
  omsOrderDetail: OmsOrderDetail;
}) => {
  const { createdFrom } = omsOrderDetail;
  const { posPrinterInfo } = usePosPrinter();
  const ref = useRef<HTMLDivElement>(null);

  const [open, toggleOpen] = useToggle(false);

  // 目前只开发了日本银座店的領収書功能
  if (createdFrom !== SHOP_MAP.GINZA) {
    return null;
  }

  const now = new Date();
  // 格式化日期为 YYYY年MM月DD日
  const formattedDate = `${now.getFullYear()}年${
    now.getMonth() + 1
  }月${now.getDate()}日`;

  return (
    <div>
      <Modal
        open={open}
        title="領収書"
        okText={i18n.t('GOEpsVQFAo')}
        okButtonProps={{ loading: posPrinterInfo.status === 'connecting' }}
        onCancel={toggleOpen}
        onOk={async () => {
          if (!ref.current) return;

          try {
            const printer = await connectToPosPrinter();
            html2canvas(ref.current).then((canvas) => {
              // 获取原始宽度和高度
              const width = canvas.width;
              const height = canvas.height;

              // 创建一个新的 canvas 来进行旋转操作
              const rotatedCanvas = document.createElement('canvas');
              const ctx = rotatedCanvas.getContext('2d');
              if (!ctx) return;

              // 交换宽度和高度，因为旋转90度
              rotatedCanvas.width = height;
              rotatedCanvas.height = width;

              // 旋转画布，移动原点到画布中心
              ctx.translate(height / 2, width / 2);
              ctx.rotate(Math.PI / 2); // 90度 = π/2 弧度

              // 绘制旋转后的图像，将原图放置到新的旋转位置
              ctx.drawImage(canvas, -width / 2, -height / 2);

              /**
               * @description 下面这一大段魔法代码，是直接从 epson epos sdk for javascript 里复制粘贴过来的
               * @link https://www.epson.jp/dl_soft/readme/40081.htm
               */
              // @ts-ignore
              printer.brightness = 1.0;
              // @ts-ignore
              printer.halftone = printer.HALFTONE_ERROR_DIFFUSION;
              // @ts-ignore
              printer.addImage(
                ctx,
                0,
                0,
                512,
                1512,
                // @ts-ignore
                printer.COLOR_1,
                // @ts-ignore
                printer.MODE_GRAY16,
              );
              // @ts-ignore
              printer.addCut(printer.CUT_FEED);
              printer.send();
            });
          } catch (err) {}
        }}
        width="1000px"
      >
        <div className="flex justify-center">
          <div
            className="w-[200mm] h-[73mm] py-[4mm] px-[6mm] relative"
            ref={ref}
          >
            <div className="absolute text-center top-[4mm] right-[6mm] text-sm">
              No: {omsOrderDetail.orderSn}
              <br />
              発行日：{formattedDate}
            </div>

            <div className="absolute bottom-[4mm] right-[6mm] text-sm">
              GINZA XIAOMA
              <br />
              東京都中央区銀座1丁目8-21
              <br />
              第21中央ビル1F・2F
              <br />
              03-6264-5267
              <br />
              登録番号：T6011101072905
              <br />
              担当者：{omsOrderDetail.staffName}
              <br />
            </div>
            <div className="text-center font-medium text-lg mb-[2mm]">
              領収書
            </div>
            <div className="w-[92mm] border-b text-right">様</div>

            <div className="mt-[4mm] relative">
              <div className="absolute left-[6mm] top-[1mm] border-dashed border flex justify-center items-center px-[2mm] aspect-[3/4]">
                収入印紙
              </div>

              <div className="border w-1/2 mx-auto text-center py-[1mm] text-lg mb-[6mm]">
                ¥{omsOrderDetail.payAmountActualCurrency?.toLocaleString()}
              </div>
              <div className="w-1/2 mb-[1mm] mx-auto">
                <div className="w-3/4 border-b">但し</div>
              </div>
              <div className="w-1/2 mx-auto">上記正しに領収いたしました。</div>
            </div>

            <div className="mt-[4mm]">
              <div className="border-b w-1/3 flex justify-between">内訳</div>
              <div className="border-b w-1/3 flex justify-between">
                <span>内消費税額 10%</span>
                <span>¥{omsOrderDetail.totalTaxAmount?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Button onClick={toggleOpen} type="primary">
        {i18n.t('GOEpsVQFAo')}
      </Button>
    </div>
  );
};

export default PrintRyoshushoButton;
