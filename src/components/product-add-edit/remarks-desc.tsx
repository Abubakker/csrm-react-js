import { useMemo, ChangeEvent } from 'react';
import { Input, Row, Col, Space, Tag } from 'antd';
import {
  nameValue,
  langageInputType,
  LANGAGE_INPUT_MAP,
  TagClassName,
} from './utils';
import { Trans } from 'react-i18next';
import LOCALS from 'commons/locals';

interface RemarksDescProps {
  value?: nameValue;
  onChange?: (value: nameValue) => void;
  inputLang: langageInputType;
}

const RemarksDesc = ({ value = {}, onChange, inputLang }: RemarksDescProps) => {
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

  const triggerChange = (changedValue: nameValue) => {
    onChange?.({ ...value, ...changedValue });
  };

  const getColor = (lang: langageInputType) => {
    if (lang === inputLang) {
      return { color: '#1677ff' };
    }
    return { color: '' };
  };

  const getInputProps = (lang: langageInputType) => {
    function getValue() {
      if (lang === LANGAGE_INPUT_MAP.EN) return nameEN;
      if (lang === LANGAGE_INPUT_MAP.JA) return nameJA;
      if (lang === LANGAGE_INPUT_MAP.ZH) return nameZH;
      if (lang === LANGAGE_INPUT_MAP.ZH_TW) return nameZHTW;
    }
    const props = {
      className: 'w-full',
      onChange: (e: ChangeEvent<HTMLTextAreaElement>) =>
        triggerChange({ [lang]: e.target.value }),
      value: getValue(),
    };
    if (lang === inputLang) {
      props.className = 'w-full border-[#1677ff] border-2';
    }
    return props;
  };

  return (
    <div className="bg-[#eee] p-4">
      <Row gutter={[24, 8]}>
        <Col span={12}>
          <Space.Compact block>
            <Tag className={TagClassName} {...getColor(LANGAGE_INPUT_MAP.JA)}>
              <Trans i18nKey={LOCALS.ja} />
            </Tag>
            <Input.TextArea {...getInputProps(LANGAGE_INPUT_MAP.JA)} />
          </Space.Compact>
        </Col>
        <Col span={12}>
          <Space.Compact block>
            <Tag className={TagClassName} {...getColor(LANGAGE_INPUT_MAP.EN)}>
              <Trans i18nKey={LOCALS.en} />
            </Tag>
            <Input.TextArea {...getInputProps(LANGAGE_INPUT_MAP.EN)} />
          </Space.Compact>
        </Col>
        <Col span={12}>
          <Space.Compact block>
            <Tag className={TagClassName} {...getColor(LANGAGE_INPUT_MAP.ZH)}>
              <Trans i18nKey={LOCALS.zh_CN} />
            </Tag>
            <Input.TextArea {...getInputProps(LANGAGE_INPUT_MAP.ZH)} />
          </Space.Compact>
        </Col>
        <Col span={12}>
          <Space.Compact block>
            <Tag
              className={TagClassName}
              {...getColor(LANGAGE_INPUT_MAP.ZH_TW)}
            >
              <Trans i18nKey={LOCALS.zh_TW} />
            </Tag>
            <Input.TextArea {...getInputProps(LANGAGE_INPUT_MAP.ZH_TW)} />
          </Space.Compact>
        </Col>
      </Row>
    </div>
  );
};

export default RemarksDesc;
