import { Button, Collapse, CollapseProps, Input, message } from 'antd';
import { getSeoConfigs, updateSeoConfigs } from 'apis/sys';
import { produce } from 'immer';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { SeoConfig } from 'types/sys';

type language = 'en' | 'ja' | 'cn' | 'tw';

const SEO_CONFIG_LIST = [
  { key: 'index', name: '首页' },
  {
    key: 'productList',
    name: '商品列表页',
    desc: '{title}可代指商品分类的名称',
  },
  {
    key: 'productDetail',
    name: '商品详情页',
    desc: '{title}可代指商品分类的名称',
  },
  { key: 'newIn', name: 'NewIn 页' },
  { key: 'search', name: '搜索页' },
  { key: 'special', name: '专题页', desc: '{title}可代指专题的标题' },
  { key: 'guideList', name: '导购列表页' },
  { key: 'guideDetail', name: '导购详情页', desc: '{title}可代指文章的标题' },
  { key: 'blogList', name: '博客列表页' },
  { key: 'blogDetail', name: '博客详情页', desc: '{title}可代指文章的标题' },
];

const LANG_LIST: {
  lang: language;
  name: string;
}[] = [
  {
    lang: 'en',
    name: ' 英文',
  },
  {
    lang: 'ja',
    name: '日文',
  },
  {
    lang: 'cn',
    name: '简体中文',
  },
  {
    lang: 'tw',
    name: '繁体中文',
  },
];

const SysSeoConfig = () => {
  const [seoConfigs, setSeoConfigs] = useState<SeoConfig[]>([]);

  useEffect(() => {
    getSeoConfigs().then((res) => {
      setSeoConfigs(res.data);
    });
  }, []);

  const getValueFromSeoConfigs = useCallback(
    (
      key: string,
      name: 'title' | 'keywords' | 'description',
      lang: language
    ) => {
      const targetSeoConfig = seoConfigs.find((i) => i.page === key);
      if (!targetSeoConfig) return '';

      if (!targetSeoConfig[name]) {
        return '';
      }

      return targetSeoConfig[name][lang];
    },
    [seoConfigs]
  );

  const setValueToSeoConfigs = useCallback(
    (
      key: string,
      name: 'title' | 'keywords' | 'description',
      lang: language,
      value: string
    ) => {
      const nextState = produce(seoConfigs, (draft) => {
        const targetSeoConfig = draft.find((i) => i.page === key);
        if (!targetSeoConfig) return;

        if (!targetSeoConfig[name]) {
          return;
        }

        targetSeoConfig[name][lang] = value;
      });

      setSeoConfigs(nextState);
    },
    [seoConfigs]
  );

  const handleSubmit = useCallback(
    (key: string) => {
      const targetSeoConfig = seoConfigs.find((i) => i.page === key);
      if (!targetSeoConfig) {
        return;
      }

      updateSeoConfigs(targetSeoConfig.id, {
        title: targetSeoConfig.title,
        keywords: targetSeoConfig.keywords,
        description: targetSeoConfig.description,
      }).then(() => {
        message.success('操作成功');
      });
    },
    [seoConfigs]
  );

  const items: CollapseProps['items'] = useMemo(() => {
    return SEO_CONFIG_LIST.map(({ key, name, desc }) => {
      return {
        key,
        label: name,
        children: (
          <div>
            {!!desc && <p>{desc}</p>}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
                gap: '1rem',
              }}
            >
              {LANG_LIST.map(({ lang, name }) => {
                return (
                  <div style={{ flexBasis: '48%' }} key={lang}>
                    <p style={{ fontWeight: 'bold', marginLeft: 100 }}>
                      {name}
                    </p>
                    <div style={{ display: 'flex' }}>
                      <label
                        style={{
                          width: 100,
                          textAlign: 'right',
                          flexShrink: 0,
                        }}
                      >
                        标题：
                      </label>
                      <Input
                        value={getValueFromSeoConfigs(key, 'title', lang)}
                        onChange={(e) => {
                          setValueToSeoConfigs(
                            key,
                            'title',
                            lang,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', marginTop: 12 }}>
                      <label
                        style={{
                          width: 100,
                          textAlign: 'right',
                          flexShrink: 0,
                        }}
                      >
                        关键词：
                      </label>
                      <Input
                        value={getValueFromSeoConfigs(key, 'keywords', lang)}
                        onChange={(e) => {
                          setValueToSeoConfigs(
                            key,
                            'keywords',
                            lang,
                            e.target.value
                          );
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', marginTop: 12 }}>
                      <label
                        style={{
                          width: 100,
                          textAlign: 'right',
                          flexShrink: 0,
                        }}
                      >
                        描述：
                      </label>
                      <Input.TextArea
                        rows={5}
                        value={getValueFromSeoConfigs(key, 'description', lang)}
                        onChange={(e) => {
                          setValueToSeoConfigs(
                            key,
                            'description',
                            lang,
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <Button
              type="primary"
              style={{ marginLeft: 100, marginTop: 12 }}
              onClick={() => {
                handleSubmit(key);
              }}
            >
              提交
            </Button>
          </div>
        ),
      };
    });
  }, [getValueFromSeoConfigs, handleSubmit, setValueToSeoConfigs]);

  return (
    <div>
      <h2>搜索引擎优化配置</h2>
      <div>
        <Collapse items={items} accordion />
      </div>
    </div>
  );
};

export default SysSeoConfig;
