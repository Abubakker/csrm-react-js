import { Select, Spin } from 'antd';
import { getMemberList } from 'apis/ums';
import { UmsMember } from 'types/ums';
import { useCallback, useMemo, useState } from 'react';
import { debounce } from 'lodash-es';
import i18n from 'i18n';
import LOCALS from 'commons/locals';

interface Props {
  onChange: (memberId: UmsMember['id'] | undefined) => void;
  value?: UmsMember['id'] | undefined;
}

const SimpleMemberSelect = ({ onChange, value }: Props) => {
  const [umsMemberList, setUmsMemberList] = useState<UmsMember[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedHandleSearch = useMemo(() => {
    return debounce((keyword: string) => {
      keyword = keyword.trim();
      if (!keyword) {
        setUmsMemberList([]);
        return;
      }
      setLoading(true);
      getMemberList({ keyword, pageNum: 1, pageSize: 10 })
        .then((data) => {
          setUmsMemberList(data.data.list);
        })
        .catch()
        .finally(() => setLoading(false));
    }, 300);
  }, []);

  const handleSearch = useCallback(
    (keyword: string) => {
      debouncedHandleSearch(keyword);
    },
    [debouncedHandleSearch]
  );

  return (
    <div className="flex">
      <Select
        placeholder={i18n.t(LOCALS.phone_or_email) || '電話番号/メールアドレス'}
        filterOption={false}
        notFoundContent={loading ? <Spin size="small" /> : null}
        onSearch={handleSearch}
        showSearch
        allowClear
        value={value}
        onChange={(memberId: UmsMember['id'] | undefined) => {
          onChange(memberId);
        }}
        options={umsMemberList.map((i) => ({
          value: i.id,
          label: `${i.showName}(${i.email})`,
        }))}
        style={{
          width: '100%',
          height: 32,
        }}
        className="rounded-r border-l-0"
        popupMatchSelectWidth
      />
    </div>
  );
};

export default SimpleMemberSelect;
