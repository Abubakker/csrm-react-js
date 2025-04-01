import { useMemo, useState, useCallback, ChangeEvent, useEffect } from 'react';
import { Input, Row, Col, Space, Tag } from 'antd';
import {
  nameValue,
  langageInputType,
  LANGAGE_INPUT_MAP,
  TagClassName,
  metalListDefault,
  bottomListDefault,
  bodyListDefault,
  insideListDefault,
  handrailListDefault,
  brightListDefault,
  shoulderStrapListDefault,
  othersListDefault,
  handleSubText,
  headTextData,
} from './utils';
import { Trans } from 'react-i18next';
import LOCALS from 'commons/locals';
import i18n from 'i18n';

interface RankDescProps {
  value?: nameValue;
  onChange?: (value: nameValue) => void;
  inputLang: langageInputType;
  rank?: nameValue;
  mode?: 'add' | 'view' | 'edit';
  rankDescription?: string;
  rankChange?: boolean;
}

// 拼接选中内容
const handleData = (list: any[], head: string, lang: langageInputType) => {
  const checkedItems = list.filter((d) => d.checked);
  if (checkedItems.length === 0) return '';

  // 移除标题后的额外空行，只保留一个换行符
  let text = head + '\n';

  checkedItems.forEach((item, index) => {
    text += '  ' + (item[lang] || item.name);

    // 只在每个项目后添加一个换行符
    if (index < checkedItems.length - 1) {
      text += '\n';
    }
  });

  // 每个分类之后添加一个换行符
  return text + '\n';
};

const RankDesc = ({
  value,
  onChange,
  inputLang,
  rank,
  mode,
  rankDescription,
}: RankDescProps) => {
  const [metalList, setMetalList] = useState(metalListDefault());
  const [metalDesc, setMetalDesc] = useState<nameValue>({});
  const [bottomList, setBottomList] = useState(bottomListDefault());
  const [bottomDesc, setBottomDesc] = useState<nameValue>({});
  const [bodyList, setBodyList] = useState(bodyListDefault());
  const [bodyDesc, setBodyDesc] = useState<nameValue>({});
  const [insideList, setInsideList] = useState(insideListDefault());
  const [insideDesc, setInsideDesc] = useState<nameValue>({});
  const [shoulderStrapList, setShoulderStrapList] = useState(
    shoulderStrapListDefault()
  );
  const [shoulderStrapDesc, setShoulderStrapDesc] = useState<nameValue>({});
  const [othersList, setOthersList] = useState(othersListDefault());
  const [othersDesc, setOthersDesc] = useState<nameValue>({});
  const [handrailList, setHandrailList] = useState(handrailListDefault());
  const [handrailDesc, setHandrailDesc] = useState<nameValue>({});
  const [brightList, setBrightList] = useState(brightListDefault());
  const [brightDesc, setBrightDesc] = useState<nameValue>({});

  // 清空数据
  useEffect(() => {
    setMetalList([...metalListDefault()]);
    setBottomList([...bottomListDefault()]);
    setBodyList([...bodyListDefault()]);
    setInsideList([...insideListDefault()]);
    setHandrailList([...handrailListDefault()]);
    setShoulderStrapList([...shoulderStrapListDefault()]);
    setOthersList([...othersListDefault()]);
    setBrightList([...brightListDefault()]);
  }, [rank]);

  const nameEN = useMemo(() => {
    return value?.en || '';
  }, [value?.en]);

  const nameJA = useMemo(() => {
    return value?.ja || '';
  }, [value?.ja]);

  const nameZH = useMemo(() => {
    return value?.zh || '';
  }, [value?.zh]);

  const nameZHTW = useMemo(() => {
    return value?.zh_TW || '';
  }, [value?.zh_TW]);

  const triggerChange = useCallback(
    (changedValue: nameValue) => {
      const t = {
        en: nameEN,
        ja: nameJA,
        zh: nameZH,
        zh_TW: nameZHTW,
        ...changedValue,
      };
      // console.log('🚀  提交出去的内容:', t);
      onChange?.(t);
    },
    [nameEN, nameJA, nameZH, nameZHTW, onChange]
  );

  // 把Tag列表转成文本
  const handleTagListToText = useCallback(
    (lang: langageInputType) => {
      const metalText = handleData(
        metalList,
        `【${headTextData.Hardware[lang]}】`,
        lang
      );
      const bottomText = handleData(
        bottomList,
        `【${headTextData.Edges[lang]}】`,
        lang
      );
      const bodyText = handleData(
        bodyList,
        `【${headTextData.Outer[lang]}】`,
        lang
      );
      const insideText = handleData(
        insideList,
        `【${headTextData.Inner[lang]}】`,
        lang
      );
      const handrailText = handleData(
        handrailList,
        `【${headTextData.Handle[lang]}】`,
        lang
      );
      const shoulderStrapText = handleData(
        shoulderStrapList,
        `【${headTextData.ShoulderStrap[lang]}】`,
        lang
      );
      console.log('🚀  shoulderStrapText:', shoulderStrapText);
      const othersText = handleData(
        othersList,
        `【${headTextData.Others[lang]}】`,
        lang
      );
      console.log('🚀  othersText:', othersText);
      const brightText = handleData(
        brightList,
        `【${headTextData.Highlights[lang]}】`,
        lang
      );
      const rankLabel = rank && rank[lang] ? `${rank[lang]}\n` : '';
      return {
        rankLabel,
        metalText,
        bottomText,
        bodyText,
        insideText,
        shoulderStrapText,
        othersText,
        handrailText,
        brightText,
      };
    },
    [
      bodyList,
      bottomList,
      brightList,
      handrailList,
      insideList,
      metalList,
      othersList,
      rank,
      shoulderStrapList,
    ]
  );

  // 设置对应 Description
  useEffect(() => {
    const TagTextJA = handleTagListToText(LANGAGE_INPUT_MAP.JA);
    const TagTextEN = handleTagListToText(LANGAGE_INPUT_MAP.EN);
    const TagTextZH = handleTagListToText(LANGAGE_INPUT_MAP.ZH);
    const TagTextZH_TW = handleTagListToText(LANGAGE_INPUT_MAP.ZH_TW);
    const textListZH = nameZH.split('\n');
    const textListJA = nameJA.split('\n');
    const textListEN = nameEN.split('\n');
    const textListZHTW = nameZHTW.split('\n');
    setMetalDesc({
      zh_TW: handleSubText(textListZHTW, TagTextZH_TW.metalText),
      ja: handleSubText(textListJA, TagTextJA.metalText),
      en: handleSubText(textListEN, TagTextEN.metalText),
      zh: handleSubText(textListZH, TagTextZH.metalText),
    });
    setBottomDesc({
      zh_TW: handleSubText(textListZHTW, TagTextZH_TW.bottomText),
      ja: handleSubText(textListJA, TagTextJA.bottomText),
      en: handleSubText(textListEN, TagTextEN.bottomText),
      zh: handleSubText(textListZH, TagTextZH.bottomText),
    });
    setBodyDesc({
      zh_TW: handleSubText(textListZHTW, TagTextZH_TW.bodyText),
      ja: handleSubText(textListJA, TagTextJA.bodyText),
      en: handleSubText(textListEN, TagTextEN.bodyText),
      zh: handleSubText(textListZH, TagTextZH.bodyText),
    });
    setInsideDesc({
      zh_TW: handleSubText(textListZHTW, TagTextZH_TW.insideText),
      ja: handleSubText(textListJA, TagTextJA.insideText),
      en: handleSubText(textListEN, TagTextEN.insideText),
      zh: handleSubText(textListZH, TagTextZH.insideText),
    });
    setHandrailDesc({
      zh_TW: handleSubText(textListZHTW, TagTextZH_TW.handrailText),
      ja: handleSubText(textListJA, TagTextJA.handrailText),
      en: handleSubText(textListEN, TagTextEN.handrailText),
      zh: handleSubText(textListZH, TagTextZH.handrailText),
    });
    setShoulderStrapDesc({
      zh_TW: handleSubText(textListZHTW, TagTextZH_TW.shoulderStrapText),
      ja: handleSubText(textListJA, TagTextJA.shoulderStrapText),
      en: handleSubText(textListEN, TagTextEN.shoulderStrapText),
      zh: handleSubText(textListZH, TagTextZH.shoulderStrapText),
    });
    setOthersDesc({
      zh_TW: handleSubText(textListZHTW, TagTextZH_TW.othersText),
      ja: handleSubText(textListJA, TagTextJA.othersText),
      en: handleSubText(textListEN, TagTextEN.othersText),
      zh: handleSubText(textListZH, TagTextZH.othersText),
    });
    setBrightDesc({
      zh_TW: handleSubText(textListZHTW, TagTextZH_TW.brightText),
      ja: handleSubText(textListJA, TagTextJA.brightText),
      en: handleSubText(textListEN, TagTextEN.brightText),
      zh: handleSubText(textListZH, TagTextZH.brightText),
    });
  }, [handleTagListToText, nameEN, nameJA, nameZH, nameZHTW]);

  // 处理拼接
  const handleTagChangeText = useCallback(
    (lang: langageInputType) => {
      let text = '';
      const TagToText = handleTagListToText(lang);
      if (rank && rank[lang]) text += rank[lang] + '\n';
      if (TagToText.metalText)
        text += TagToText.metalText + metalDesc[lang] + '\n';
      if (TagToText.bottomText)
        text += TagToText.bottomText + bottomDesc[lang] + '\n';
      if (TagToText.bodyText)
        text += TagToText.bodyText + bodyDesc[lang] + '\n';
      if (TagToText.insideText)
        text += TagToText.insideText + insideDesc[lang] + '\n';
      if (TagToText.shoulderStrapText)
        text += TagToText.shoulderStrapText + shoulderStrapDesc[lang] + '\n';
      if (TagToText.handrailText)
        text += TagToText.handrailText + handrailDesc[lang] + '\n';
      if (TagToText.othersText)
        text += TagToText.othersText + othersDesc[lang] + '\n';
      if (TagToText.brightText)
        text += TagToText.brightText + brightDesc[lang] + '\n';
      return text;
    },
    [
      bodyDesc,
      bottomDesc,
      brightDesc,
      handleTagListToText,
      handrailDesc,
      insideDesc,
      metalDesc,
      othersDesc,
      rank,
      shoulderStrapDesc,
    ]
  );

  //  快捷操作
  const QuickOperationRender = useCallback(
    (lang: langageInputType) => {
      const list = [
        {
          lable: i18n.t('Hardware'),
          list: metalList,
          listChange: (checked: boolean, i: number) => {
            const t = [...metalList];
            t[i].checked = checked;
            setMetalList(t);
          },
        },
        {
          lable: i18n.t('Edges'),
          list: bottomList,
          listChange: (checked: boolean, i: number) => {
            const t = [...bottomList];
            t[i].checked = checked;
            setBottomList(t);
          },
        },
        {
          lable: i18n.t('Outer'),
          list: bodyList,
          listChange: (checked: boolean, i: number) => {
            const t = [...bodyList];
            t[i].checked = checked;
            setBodyList(t);
          },
        },
        {
          lable: i18n.t('Inner'),
          list: insideList,
          listChange: (checked: boolean, i: number) => {
            const t = [...insideList];
            t[i].checked = checked;
            setInsideList(t);
          },
        },
        {
          lable: i18n.t('Handle'),
          list: handrailList,
          listChange: (checked: boolean, i: number) => {
            const t = [...handrailList];
            t[i].checked = checked;
            setHandrailList(t);
          },
        },
        {
          lable: i18n.t('shoulder_strap'),
          list: shoulderStrapList,
          listChange: (checked: boolean, i: number) => {
            const t = [...shoulderStrapList];
            t[i].checked = checked;
            setShoulderStrapList(t);
          },
        },
        {
          lable: i18n.t('others'),
          list: othersList,
          listChange: (checked: boolean, i: number) => {
            const t = [...othersList];
            t[i].checked = checked;
            setOthersList(t);
          },
        },
        {
          lable: i18n.t('Highlights'),
          list: brightList,
          listChange: (checked: boolean, i: number) => {
            const t = [...brightList];
            t[i].checked = checked;
            setBrightList(t);
          },
        },
      ];
      // 1. 新增时显示 rank必须有
      // 2. 新增时未编辑【成色描述】，再次编辑时显示
      if (
        (lang === inputLang &&
          'add' === mode &&
          rank &&
          Object.keys(rank).length) ||
        (lang === inputLang &&
          'edit' === mode &&
          rankDescription &&
          rankDescription?.split('\n').length <= 1) ||
        (lang === inputLang && !rankDescription)
      ) {
        return (
          <div>
            {list.map((d, i) => (
              <Row key={i}>
                <Col span={24}>
                  <div className="flex mb-2 h-full">
                    <div className="w-[10%] text-right mr-2 h-full">
                      {d.lable}
                      <span className="mx-1">:</span>
                    </div>
                    <div className="w-[90%]">
                      {d.list.map((dd, ii) => (
                        <Tag.CheckableTag
                          key={dd.name}
                          checked={dd.checked}
                          onChange={(checked) => {
                            d.listChange(checked, ii);
                            triggerChange({
                              en: handleTagChangeText(LANGAGE_INPUT_MAP.EN),
                              ja: handleTagChangeText(LANGAGE_INPUT_MAP.JA),
                              zh: handleTagChangeText(LANGAGE_INPUT_MAP.ZH),
                              zh_TW: handleTagChangeText(
                                LANGAGE_INPUT_MAP.ZH_TW
                              ),
                            });
                          }}
                          className="border-[#000] bottom-1"
                        >
                          {dd.name}
                        </Tag.CheckableTag>
                      ))}
                    </div>
                  </div>
                </Col>
              </Row>
            ))}
          </div>
        );
      }
      return <></>;
    },

    [
      metalList,
      bottomList,
      bodyList,
      insideList,
      handrailList,
      shoulderStrapList,
      othersList,
      brightList,
      inputLang,
      mode,
      rank,
      rankDescription,
      triggerChange,
      handleTagChangeText,
    ]
  );

  const getColor = useCallback(
    (lang: langageInputType) => {
      if (lang === inputLang) {
        return { color: '#1677ff' };
      }
      return { color: '' };
    },
    [inputLang]
  );

  const InputProps = useCallback(
    (lang: langageInputType) => {
      function getValue() {
        if (lang === LANGAGE_INPUT_MAP.EN) return nameEN;
        if (lang === LANGAGE_INPUT_MAP.JA) return nameJA;
        if (lang === LANGAGE_INPUT_MAP.ZH) return nameZH;
        if (lang === LANGAGE_INPUT_MAP.ZH_TW) return nameZHTW;
      }
      const props = {
        className: 'w-full',
        value: getValue(),
        onChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
          triggerChange({ [lang]: e.target.value });
        },
        autoSize: true,
      };
      if (lang === inputLang) {
        props.className = 'w-full border-[#1677ff] border-2';
      }
      return props;
    },
    [nameEN, nameJA, nameZH, nameZHTW, triggerChange, inputLang]
  );

  return (
    <div className="bg-[#eee] p-4">
      {mode === 'edit' && (
        <p className="text-[red] text-[12px]">{i18n.t('rank_desc_note')}</p>
      )}
      <div className="flex">
        <div className="w-[90%]">
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Space.Compact block>
                <Tag
                  className={TagClassName}
                  {...getColor(LANGAGE_INPUT_MAP.JA)}
                >
                  <Trans i18nKey={LOCALS.ja} />
                </Tag>
                <Input.TextArea {...InputProps(LANGAGE_INPUT_MAP.JA)} />
              </Space.Compact>
            </Col>
            <Col span={24}>{QuickOperationRender(LANGAGE_INPUT_MAP.JA)}</Col>
            <Col span={24}>
              <Space.Compact block>
                <Tag
                  className={TagClassName}
                  {...getColor(LANGAGE_INPUT_MAP.EN)}
                >
                  <Trans i18nKey={LOCALS.en} />
                </Tag>
                <Input.TextArea {...InputProps(LANGAGE_INPUT_MAP.EN)} />
              </Space.Compact>
            </Col>
            <Col span={24}>{QuickOperationRender(LANGAGE_INPUT_MAP.EN)}</Col>
            <Col span={24}>
              <Space.Compact block>
                <Tag
                  className={TagClassName}
                  {...getColor(LANGAGE_INPUT_MAP.ZH)}
                >
                  <Trans i18nKey={LOCALS.zh_CN} />
                </Tag>
                <Input.TextArea {...InputProps(LANGAGE_INPUT_MAP.ZH)} />
              </Space.Compact>
            </Col>
            <Col span={24}>{QuickOperationRender(LANGAGE_INPUT_MAP.ZH)}</Col>
            <Col span={24}>
              <Space.Compact block>
                <Tag
                  className={TagClassName}
                  {...getColor(LANGAGE_INPUT_MAP.ZH_TW)}
                >
                  <Trans i18nKey={LOCALS.zh_TW} />
                </Tag>
                <Input.TextArea {...InputProps(LANGAGE_INPUT_MAP.ZH_TW)} />
              </Space.Compact>
            </Col>
            <Col span={24}>{QuickOperationRender(LANGAGE_INPUT_MAP.ZH_TW)}</Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default RankDesc;
