import { MallCity, MallCountry } from './home';
import { SysUser } from './sys';
export type UmsMember = {
  id: number;
  totalPayAmount: number;
  memberLevel: string;
  lastName: string;
  lastNameKatakana: string;
  birthday?: string;
  city: string;
  country: string;
  countryCode: string;
  createSource: number;
  createTime: string;
  createdBy?: string;
  detailAddress: string;
  email: string;
  firstName: string;
  firstNameKatakana: string;
  gender: number;
  integration?: number;
  phone?: string;
  pointExpireTime?: string;
  remark?: string;
  socialAccount?: string;
  socialName?: string;
  status: number;
  memberLevelId?: number;
  language?: string;
  lastLoginTime: string | null;
  idCertificate?: string;
  paymentDetails?: string;
  // 计算属性
  showName?: string;
  showPhone?: string;
};

export type UmsMemberPointHistory = {
  id: number;
  memberId: number;
  orderId?: number;
  orderCreatedFrom: number;
  orderSn?: string;
  changeCount: number;
  operateMan: string;
  operateNote: string;
  operateType: number;
  createTime: string;
  activityNote: string;
};

export type UmsMemberReceiveAddress = {
  id: number;
  memberId: number;
  name: string;
  phoneNumber: string;
  defaultStatus: number;
  postCode: string;
  province: string;
  city: string;
  detailAddress: string;
};

/** 新收货地址 */
export type UmsMemberReceiveAddressV1 = {
  id: number;
  memberId: number;
  name: string;
  phoneNumber: string;
  defaultStatus: number;
  postCode: string;
  province: string;
  city: MallCity;
  detailAddress: string;
  country: MallCountry;
};

export type UmsMemberMail = {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  type: string;
  templateName: string;
  memberId?: number;
  orderId?: number;
  status: number;
  sendTime: string;
  createTime: string;
  remarks?: string;
};

export type UmsMemberMailTemplate = {
  id: number;
  templateName: string;
  description?: string;
  jaSubject?: string;
  enSubject?: string;
  zhCnSubject?: string;
  zhTwSubject?: string;
  jaMailContent?: string;
  enMailContent?: string;
  zhCnMailContent?: string;
  zhTwMailContent?: string;
};

export type UmsResource = {
  id: number;
  name: string;
  url: string;
  categoryId: number;
  createTime: string;
  description?: string;
};

export type UmsIntegralType = {
  id: number;
  name: string;
  type: string;
  points: number;
  startAt: string;
  endAt: string;
  status: number;
  directions?: string;
  createAt: string;
  deletedAt?: number;
  pointsRate?: string;
  logs: UmsIntegralLog[];
};

export type UmsIntegralPayload = {
  name?: string;
  startDate?: string;
  endDate?: string;
};

export type UmsIntegralHistoryPayload = {
  keyword?: string;
  startDate?: string;
  endDate?: string;
  id: number;
};

export type UmsIntegralEditPayload = Pick<
  UmsIntegralType,
  'name' | 'type' | 'points' | 'startAt' | 'endAt' | 'status' | 'directions'
> &
  Partial<Pick<UmsIntegralType, 'id'>>;

export type UmsIntegralHistory = {
  id: number;
  createTime?: string;
  member?: UmsMember;
  orderId?: number;
  orderSn?: string;
};

export type UmsIntegralLog = {
  id: number;
  createTime: string;
  description: string;
  admin: SysUser;
};

export type UmsStaff = {
  id: number;
  name: string;
  romanName: string;
  enabled: number;
  description: string;
  status: string;
  storeId: number;
  avatar: string;
  personalPhoto: string;
  languages: string;
  sort: number;
  reserveCount: number;
  regularVisit: number;
  appraisal: number;
};

export type StaffReserveHistory = {
  storeId: number;
  name?: string;
  startTime?: string;
  endTime?: string;
};
