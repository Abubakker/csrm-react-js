import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  getStockTakingDetail,
  PmsProductStockTaking,
  PmsProductStockTakingRecord,
  STOCK_TAKING_RECORD_CHECK_STATUS,
  updateStockStatusForStockTaking,
  updateStockTaking,
} from 'apis/pms';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FloatButton, Input } from 'antd';
import classNames from 'classnames';
import BarcodeScanner from 'components/barcode-scanner';
import i18n from 'i18n';
import LOCALS from 'commons/locals';
import { debounce } from 'lodash-es';
import ImageNotFound from 'assets/images/image-not-found.png';
import { SyncOutlined } from '@ant-design/icons';
import {
  storeScannerBeepAudioError,
  storeScannerBeepAudioSuccess,
} from 'commons';

const SHOW_PRODUCT_COUNT = 20;

type SHOW_MODE = 'SCAN' | 'LIST';

const ItemType = {
  PRODUCT: 'product',
};

const DraggableItem = ({
  record,
  onDrop,
  productId,
}: {
  record: PmsProductStockTakingRecord;
  onDrop: (item: PmsProductStockTakingRecord) => void;
  productId: string;
}) => {
  const [, drag] = useDrag(() => ({
    type: ItemType.PRODUCT,
    item: record,
  }));

  return (
    <div
      ref={drag}
      className={classNames(
        'border border-gray-300 p-2 rounded cursor-pointer grid gap-2 w-40',
        Number(productId) === record.productId && 'border-red-500 border-2'
      )}
    >
      <div className="flex justify-center">
        <img
          src={record.productPic || ImageNotFound}
          alt={''}
          className="w-16 h-16"
        />
      </div>
      <div className="text-center">{record.productName}</div>
      <div className="text-center">
        {record.currency} {record.price.toLocaleString()}（税込）
      </div>
      <div className="text-center">
        <Link target="_blank" to={`/pms/product-view/${record.productId}`}>
          {record.productId}
        </Link>
      </div>
    </div>
  );
};

const DroppableArea = ({
  title,
  records,
  onDrop,
  productId,
}: {
  title: string;
  records: PmsProductStockTakingRecord[];
  onDrop: (item: PmsProductStockTakingRecord) => void;
  productId: string;
}) => {
  const [, drop] = useDrop({
    accept: ItemType.PRODUCT,
    drop: (item: PmsProductStockTakingRecord) => onDrop(item),
  });

  const recordsToShow = records.slice(0, SHOW_PRODUCT_COUNT);

  return (
    <div>
      <h3 className="text-center">
        {title}（{records.length}）
      </h3>
      <div
        ref={drop}
        className="flex gap-2 flex-wrap border border-gray-300 p-2 rounded items-start min-h-80"
      >
        {recordsToShow.map((record) => (
          <DraggableItem
            key={record.id}
            record={record}
            onDrop={onDrop}
            productId={productId}
          />
        ))}
      </div>
      <div className="text-center mt-2">前 {SHOW_PRODUCT_COUNT} 件を表示</div>
    </div>
  );
};

const StockTaking = () => {
  const { id } = useParams<{ id: string }>();
  const [unconfirmed, setUnconfirmed] = useState<PmsProductStockTakingRecord[]>(
    []
  );
  const [confirmed, setConfirmed] = useState<PmsProductStockTakingRecord[]>([]);

  const [productId, setProductId] = useState<string>('');
  const [stockTaking, setStockTaking] = useState<PmsProductStockTaking>();
  const [mode, setMode] = useState<SHOW_MODE>('SCAN');

  // 这里用 ref 的原因是避免 BarcodeScanner 组件的重新渲染
  const lastScanResult = useRef<string>('');

  useEffect(() => {
    if (id) {
      getStockTakingDetail(Number(id)).then(({ recordList, ...rest }) => {
        setStockTaking(rest);
        setUnconfirmed(recordList.UNCONFIRMED || []);
        setConfirmed(recordList.CONFIRMED || []);
      });
    }
  }, [id]);

  const handleDropToConfirmed = useCallback(
    async (item: PmsProductStockTakingRecord) => {
      if (confirmed.find((record) => record.id === item.id)) {
        return;
      }

      await updateStockStatusForStockTaking({
        productIdList: [item.productId],
        newStockTakingStatus: STOCK_TAKING_RECORD_CHECK_STATUS.CONFIRMED,
        stockTakingId: Number(id),
      });
      setUnconfirmed((prev) => prev.filter((record) => record.id !== item.id));
      setConfirmed((prev) => [item, ...prev]);
      setProductId('');
      storeScannerBeepAudioSuccess
        .play()
        .catch((err) =>
          console.log('Autoplay requires user interaction:', err)
        );
    },
    [id, confirmed]
  );

  const handleDropToUnconfirmed = useCallback(
    async (item: PmsProductStockTakingRecord) => {
      if (unconfirmed.find((record) => record.id === item.id)) {
        return;
      }

      await updateStockStatusForStockTaking({
        productIdList: [item.productId],
        newStockTakingStatus: STOCK_TAKING_RECORD_CHECK_STATUS.UNCONFIRMED,
        stockTakingId: Number(id),
      });
      setConfirmed((prev) => prev.filter((record) => record.id !== item.id));
      setUnconfirmed((prev) => [item, ...prev]);
      setProductId('');
    },
    [id, unconfirmed]
  );

  useEffect(() => {
    if (productId) {
      setUnconfirmed((prev) => {
        const index = prev.findIndex(
          (record) => record.productId === Number(productId)
        );
        if (index !== -1) {
          const newArr = [...prev];
          newArr.splice(index, 1);
          setTimeout(() => {
            handleDropToConfirmed(prev[index]);
          }, 300);
          return [prev[index], ...newArr];
        }
        return prev;
      });
    }
  }, [handleDropToConfirmed, productId]);

  // 重复扫描提示音
  useEffect(() => {
    if (
      productId &&
      confirmed.find((record) => record.productId === Number(productId))
    ) {
      storeScannerBeepAudioError
        .play()
        .catch((err) =>
          console.log('Autoplay requires user interaction:', err)
        );
    }
  }, [confirmed, productId]);

  const handleScanSuccess = useCallback((text: string) => {
    if (text === lastScanResult.current) {
      return;
    }
    lastScanResult.current = text;
    setProductId(text);
  }, []);

  const debouncedHandleUpdateStockTaking = useMemo(() => {
    return debounce(
      (data: { stockTakingId: number; name: string; note?: string }) => {
        updateStockTaking(data);
      },
      300
    );
  }, []);

  const handleUpdateStockTaking = useCallback(
    (data: { stockTakingId: number; name: string; note?: string }) => {
      debouncedHandleUpdateStockTaking(data);
    },
    [debouncedHandleUpdateStockTaking]
  );

  return (
    <div className="relative">
      <FloatButton.Group shape="square">
        <FloatButton
          icon={<SyncOutlined />}
          onClick={() => {
            setMode(mode === 'SCAN' ? 'LIST' : 'SCAN');
          }}
        />
      </FloatButton.Group>
      {mode === 'SCAN' && (
        <div>
          <BarcodeScanner
            onScanSuccess={handleScanSuccess}
            className="max-w-md mx-auto"
          />
          <div className="mt-4 text-center grid gap-2">
            <div>
              {i18n.t('oRDtoUEFuk')}: {unconfirmed.length} 件
            </div>
            <div>
              {i18n.t('KjExOCBoik')}: {confirmed.length} 件
            </div>
          </div>
        </div>
      )}

      {mode === 'LIST' && (
        <DndProvider backend={HTML5Backend}>
          <div className="grid mb-4 gap-4">
            <div className="flex flex-col gap-2">
              <label>商品ID</label>
              <Input
                placeholder="商品ID"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>{i18n.t(LOCALS.title)}</label>
              <Input
                onChange={(e) => {
                  if (stockTaking) {
                    setStockTaking({ ...stockTaking, name: e.target.value });
                    handleUpdateStockTaking({
                      ...stockTaking,
                      stockTakingId: stockTaking.id,
                      name: e.target.value,
                    });
                  }
                }}
                value={stockTaking?.name}
                placeholder={i18n.t(LOCALS.title) || ''}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>{i18n.t(LOCALS.note)}</label>
              <Input.TextArea
                rows={3}
                onChange={(e) => {
                  if (stockTaking) {
                    setStockTaking({ ...stockTaking, note: e.target.value });
                    handleUpdateStockTaking({
                      ...stockTaking,
                      stockTakingId: stockTaking.id,
                      note: e.target.value,
                    });
                  }
                }}
                placeholder={i18n.t(LOCALS.note) || ''}
                value={stockTaking?.note || ''}
              />
            </div>
          </div>

          <div className="flex justify-center mb-4 items-center gap-4"></div>

          <div className="grid grid-cols-2 gap-4">
            <DroppableArea
              title={i18n.t('oRDtoUEFuk')}
              records={unconfirmed}
              onDrop={handleDropToUnconfirmed}
              productId={productId}
            />
            <DroppableArea
              title={i18n.t('KjExOCBoik')}
              records={confirmed}
              onDrop={handleDropToConfirmed}
              productId={productId}
            />
          </div>
        </DndProvider>
      )}
    </div>
  );
};

export default StockTaking;
