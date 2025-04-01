import {
  UmsMember,
  UmsMemberMail,
  UmsMemberMailTemplate,
  UmsMemberPointHistory,
  UmsMemberReceiveAddress,
  UmsMemberReceiveAddressV1,
  UmsIntegralType,
  UmsIntegralPayload,
  UmsIntegralHistoryPayload,
  UmsIntegralEditPayload,
  UmsIntegralHistory,
  UmsStaff,
  StaffReserveHistory,
} from 'types/ums';
import request, { ginzaxiaomaApiRequest } from '.';
import { BaseRes, PageQuery, UnwrapPromise } from 'types/base';
import { useEffect, useState } from 'react';

export type GetMemberListDto = {
  createSource?: number;
  keyword?: string;
  memberLevel?: string;
} & PageQuery;

export const getMemberById = (id: UmsMember['id']) => {
  return request.get<BaseRes<UmsMember>>(`/ums/member/${id}`);
};

export const getMemberByIdV2 = (id: UmsMember['id']) => {
  return ginzaxiaomaApiRequest.get<{
    id: number;
    email: string;
    integration: number;
    username: string;
    phone: string;
    language: string;
    country: string;
    createTime: string;
    createSource: number;
    firstName: string;
    lastName: string;
    status: number;
    memberLevelId: number;
    firstNameKatakana?: string;
    lastNameKatakana?: string;
    gender: number;
    birthday?: string;
    countryCode?: string;
    socialAccount?: string;
    socialName?: string;
    nickname?: string;
    city?: string;
    detailAddress?: string;
    pointExpireTime?: string;
    lastLoginTime?: string;
    memberLevel: string;
    tags?: string[];
    totalPayAmount: number;
    remark?: string;
    idCertificate?: string;
    paymentDetails?: string;
  }>(`/admin/umsMember/info/${id}`);
};

export const getMemberList = (params: GetMemberListDto) => {
  return request
    .get<
      BaseRes<{
        list: UmsMember[];
        total: number;
      }>
    >('/ums/member/list', { params })
    .then((res) => {
      res.data.list.forEach((i) => {
        const { firstName, lastName, phone, countryCode, email } = i;
        let showName = '';
        const isChineseOrJapanese = (text: string) =>
          /[\u4E00-\u9FFF\u3040-\u30FF]/.test(text);

        if (firstName && lastName) {
          if (isChineseOrJapanese(firstName) || isChineseOrJapanese(lastName)) {
            showName = `${lastName} ${firstName}`; // 中文或日文：姓在前，名在后
          } else {
            showName = `${firstName} ${lastName}`; // 英文：名在前，姓在后
          }
        } else {
          showName = email || '-';
        }

        i.showName = showName;
        i.showPhone = countryCode && phone ? `+${countryCode} ${phone}` : '-';
      });

      return res;
    });
};

export const getMemberListV2 = (
  dto: {
    keyword: string;
    createSource: number[];
    memberLevel: string[];
    sortField?: string;
    sortOrder?: string;
  } & PageQuery
) => {
  return ginzaxiaomaApiRequest
    .post<{
      list: (UnwrapPromise<ReturnType<typeof getMemberByIdV2>> & {
        showName?: string;
        showPhone?: string;
      })[];
      total: number;
    }>('/admin/umsMember/list', dto)
    .then((res) => {
      res.list.forEach((i) => {
        const { firstName, lastName, nickname, phone, countryCode } = i;
        let showName = '';
        if (firstName && lastName) {
          showName = `${firstName} ${lastName}`;
        } else {
          showName = nickname || '-';
        }

        i.showName = showName;
        i.showPhone = countryCode && phone ? `+${countryCode} ${phone}` : '-';
      });

      return res;
    });
};

export const editUmsMemberTags = ({
  tags,
  id,
}: {
  tags: string[];
  id: number;
}) => {
  return ginzaxiaomaApiRequest.post(`/admin/umsMember/update-tags/${id}`, {
    tags,
  });
};

export const getUmsMemberTagOptions = () => {
  return ginzaxiaomaApiRequest.get<string[]>('/admin/umsMember/tag-options');
};

type UmsMemberPointHistorySearchDto = {
  memberId?: number;
  orderId?: number;
  startTime?: string;
  endTime?: string;
} & PageQuery;

export const umsMemberPointHistorySearch = (
  data: UmsMemberPointHistorySearchDto
) => {
  return request.post<
    BaseRes<{
      list: UmsMemberPointHistory[];
      total: number;
    }>
  >('/ums/member-point-history/search', data);
};

export const getMemberReceiveAddressListV1 = (memberId: UmsMember['id']) => {
  return request.get<BaseRes<UmsMemberReceiveAddressV1[]>>(
    `/member/address/default/member/${memberId}`
  );
};

export const getMemberReceiveAddressList = (memberId: UmsMember['id']) => {
  return request.get<BaseRes<UmsMemberReceiveAddress[]>>(
    `/ums/member/address/default/member/${memberId}`
  );
};

export const useGetMemberReceiveAddressList = (memberId: UmsMember['id']) => {
  const [loading, setLoading] = useState(false);
  const [memberReceiveAddressList, setMemberReceiveAddressList] = useState<
    UmsMemberReceiveAddress[]
  >([]);

  useEffect(() => {
    getAddressList(memberId);
  }, [memberId]);

  const getAddressList = (memberId: number) => {
    setLoading(true);
    getMemberReceiveAddressList(memberId)
      .then(({ data }) => {
        setMemberReceiveAddressList(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    loading,
    memberReceiveAddressList,
    getAddressList,
  };
};

export const umsMemberUpdate = (data: Partial<UmsMember>) => {
  return request.post<BaseRes<null>>('/ums/member/update', data);
};

export const umsMemberCreate = (data: Omit<UmsMember, 'id'>) => {
  return request.post<BaseRes<UmsMember>>('/ums/member/create', data);
};

export const umsMemberCreateAPI = (data: Omit<UmsMember, 'id'>) => {
  return ginzaxiaomaApiRequest.post<UmsMember>('/admin/umsMember/create', data);
};

export const getMemberPointRate = (memberId: number) => {
  return request.get<
    BaseRes<{
      isBirthdayMonth: boolean;
      pointRate: number;
    }>
  >('/ums/member-point-rate/getByMemberId', {
    params: {
      memberId,
    },
  });
};

// 积分变更接口
export const umsMemberPointUpdate = (data: {
  memberId: UmsMember['id'];
  type: number;
  point: number;
  operateNote: string;
}) => {
  return request.post('/ums/member/point/update', data);
};

// 回收寄卖预约管理
export const umsSearchMember = (keyword: string) => {
  return request.get<BaseRes<UmsMember>>(
    `/ums/member/umsMemberInfo?keyword=${keyword}`
  );
};

// 增加用户地址
export const umsAddMemberAddress = (data: UmsMemberReceiveAddress) => {
  return request.post<BaseRes<string>>(`/member/address/add`, data);
};

export const umsMemberMailSearch = (data: { memberId: number } & PageQuery) => {
  return request.post<
    BaseRes<{
      list: UmsMemberMail[];
      total: number;
    }>
  >('/ums/member-mail/search', data);
};

export const umsMemberUpdateStatus = (
  data: Pick<UmsMember, 'id' | 'status'>
) => {
  return request.post('ums/member/updateStatus', null, {
    params: data,
  });
};

export const getMailTemplateList = (data: PageQuery) => {
  return request.post<
    BaseRes<{
      list: UmsMemberMailTemplate[];
      total: number;
    }>
  >('ums/member-mail/get-mail-template-list', data);
};

export const umsMemberMailTemplateSaveOrUpdate = (
  data: UmsMemberMailTemplate
) => {
  return request.post('ums/member-mail/template/saveOrUpdate', data);
};

export const umsMemberSendCustomMail = (data: {
  memberId: UmsMember['id'];
  subject: string;
  mailContent: string;
}) => {
  return request.post('ums/member-mail/sendCustomMail', data);
};

export const getIntegralList = (data?: UmsIntegralPayload) => {
  return ginzaxiaomaApiRequest.post<UmsIntegralType[]>(
    'admin/point-marketing/findAll',
    data
  );
};

export const getIntegralDetail = (id: UmsIntegralType['id']) => {
  return ginzaxiaomaApiRequest.get<UmsIntegralType>(
    `admin/point-marketing/findOne/${id}`
  );
};

export const getIntegralHistory = (
  data: PageQuery & UmsIntegralHistoryPayload
) => {
  return ginzaxiaomaApiRequest.post<{
    list: UmsIntegralHistory[];
    total: number;
  }>(`admin/point-marketing/point-history-list`, data);
};

export const getIntegralEdit = (data: UmsIntegralEditPayload) => {
  return ginzaxiaomaApiRequest.post(`admin/point-marketing/addOrUpdate`, data);
};

export const getUmsMemberMailList = (
  data: PageQuery & { memberId?: number; orderId?: number }
) => {
  return ginzaxiaomaApiRequest.get<{
    list: UmsMemberMail[];
    total: number;
  }>(`admin/ums-member-email/list`, { params: data });
};

export const getUmsStaffList = (data: {
  storeId: number;
  pageNum: number;
  pageSize: number;
  name?: string;
}) => {
  return ginzaxiaomaApiRequest.post<UmsStaff[]>('/admin/staff/list', data);
};

export const upsertStaff = (
  data: Partial<
    Pick<
      UmsStaff,
      | 'id'
      | 'storeId'
      | 'name'
      | 'romanName'
      | 'description'
      | 'avatar'
      | 'enabled'
      | 'personalPhoto'
      | 'status'
      | 'languages'
      | 'sort'
      | 'appraisal'
      | 'regularVisit'
    >
  >
) => {
  return ginzaxiaomaApiRequest.post<UmsStaff>(
    '/admin/staff/create-or-update',
    data
  );
};

export const deleteStaff = (id: UmsStaff['id']) => {
  return ginzaxiaomaApiRequest.delete(`/admin/staff/${id}`);
};

export const reserveList = (data: StaffReserveHistory) => {
  return ginzaxiaomaApiRequest.post<StaffReserveHistory[]>(
    `admin/staff/reserve/list`,
    data
  );
};
