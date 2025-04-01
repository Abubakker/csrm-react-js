import { Button, Input, Switch, message } from 'antd';
import { InfiniteScroll } from 'antd-mobile';
import { getProductList, publishProduct, unPublishProduct } from 'apis/pms';
import usePagination from 'commons/hooks/usePagination';
import { useCallback, useEffect, useState } from 'react';
import { PageQuery } from 'types/base';
import { PmsProduct } from 'types/pms';
import img404 from 'assets/images/img-404.png';
import PORTAL_ORIGIN from 'utils/getPortalOrigin';
import copyToClipboard from 'utils/copyToClipboard';
import { produce } from 'immer';
import queryString from 'query-string';
import { Trans } from 'react-i18next';
import LOCALS from '../../commons/locals';
import i18n from '../../i18n';

const ProductListMobile = () => {
  const [isChanging, setIsChanging] = useState(false);
  const [keyword, setKeyword] = useState('');

  const {
    setLoading,
    pageNum,
    setPageNum,
    pageSize,
    total,
    setTotal,
    dataSource,
    setDataSource,
  } = usePagination<PmsProduct>();

  const getDataSource = useCallback(
    async ({
      pageNum,
      pageSize,
      keyword,
    }: PageQuery & {
      keyword?: string;
    }) => {
      try {
        setLoading(true);
        const {
          data: { list, total },
        } = await getProductList({
          pageNum,
          pageSize,
          keyword,
        });

        setDataSource((dataSource) => {
          return [...dataSource, ...list];
        });
        setTotal(total);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    [setDataSource, setLoading, setTotal]
  );

  useEffect(() => {
    const parsed = queryString.parse(window.location.search);
    const rowKeyword = parsed.keyword;
    let keyword = '';

    if (rowKeyword && typeof rowKeyword === 'string') {
      setKeyword(rowKeyword);
      keyword = rowKeyword;
    }

    getDataSource({ pageNum: 1, pageSize: 10, keyword });
  }, [getDataSource]);

  const handleInputChange = useCallback(
    async (keyword: string) => {
      setPageNum(1);
      setKeyword(keyword);
      setDataSource([]);
      setIsChanging(true);
      await getDataSource({
        pageNum: 1,
        pageSize: 10,
        keyword,
      });
      setIsChanging(false);
    },
    [getDataSource, setDataSource, setPageNum]
  );

  const handlePublishStatusChange = useCallback(
    async (checked: boolean, id: PmsProduct['id']) => {
      const publishStatus = checked ? 1 : 0;

      if (checked) {
        await publishProduct([id]);
      } else {
        await unPublishProduct([id]);
      }

      const nextState = produce(dataSource, (draft) => {
        const target = draft.find((i) => i.id === id);

        if (target) {
          target.publishStatus = publishStatus;
        }
      });

      setDataSource(nextState);
    },
    [dataSource, setDataSource]
  );

  return (
    <div>
      <Input
        className="mb-2"
        value={keyword}
        placeholder={i18n.t(LOCALS.search) || ''}
        onChange={(event) => {
          handleInputChange(event.target.value);
        }}
      />

      <p className="mb-4 text-base">
        <Trans i18nKey={LOCALS.total_products} />:
        <span className="text-red-500">{total}</span>
      </p>

      {dataSource.map(
        ({
          id,
          price,
          productSn,
          pic,
          publishStatus,
          name,
          stock,
          subTitle,
        }) => {
          return (
            <div
              key={id}
              className="flex items-center border-b py-2 border-gray-300"
            >
              <img src={pic || img404} alt={subTitle} className="w-32" />
              <div className="text-sm ml-4">
                <div className="mb-1 font-semibold text-base">
                  {subTitle || name}
                </div>
                <div className="mb-1">
                  <Trans i18nKey={LOCALS.product_sn}></Trans>：{productSn}
                </div>
                <div className="mb-1">
                  <Trans i18nKey={LOCALS.price} />
                  ：￥{price.toLocaleString()}
                </div>
                <div className="mb-1">
                  <Trans i18nKey={LOCALS.stock} />：{stock}
                </div>
                <div className="mb-2">
                  <Trans i18nKey={LOCALS.publish_status} />：
                  <Switch
                    checked={publishStatus === 1}
                    onChange={(checked) => {
                      handlePublishStatusChange(checked, id);
                    }}
                  />
                </div>
                <div>
                  <Button
                    type="primary"
                    className="copy-btn text-sm"
                    onClick={() => {
                      copyToClipboard(`${PORTAL_ORIGIN}/product/${id}`);
                      message.success(i18n.t(LOCALS.successful_operation));
                    }}
                  >
                    <Trans i18nKey={LOCALS.copy_link} />
                  </Button>
                </div>
              </div>
            </div>
          );
        }
      )}

      <InfiniteScroll
        loadMore={() => {
          setPageNum(pageNum + 1);
          return getDataSource({
            pageNum: pageNum + 1,
            pageSize,
            keyword,
          });
        }}
        hasMore={!isChanging && dataSource.length < total}
      />
    </div>
  );
};

export default ProductListMobile;
