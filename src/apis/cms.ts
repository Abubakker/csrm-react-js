import { BASE_URL, ginzaxiaomaApiRequest } from 'apis';
import { PageQuery } from 'types/base';
import { PmsProduct } from 'types/pms';

export const s3UploadUrl = `${BASE_URL}/cms/s3/upload`;

export type CmsHelp = {
  id: number;
  categoryId: number;
  icon?: string;
  title: string;
  description?: string;
  recommendStatus: number;
  showStatus?: number;
  language: string;
  sort?: number;
  createTime: string;
  readCount?: number;
  content: string;
  modifyTime?: string;
  path?: string;
};

export type CmsHelpCategory = {
  id: number;
  name: string;
  showStatus: number;
  icon: string;
};

export type CmsSubjectCategory = {
  id: number;
  name: string;
  showStatus: number;
  icon: string;
  subjectCount: number;
};

export type CmsSubject = {
  id: number;
  categoryId: number;
  title: string;
  pic: string;
  recommendStatus: number;
  createTime: string;
  collectCount: number;
  readCount: number;
  commentCount: number;
  albumPics: string;
  description: string;
  showStatus: number;
  language: string;
  sort: number;
  forwardCount: number;
  categoryName: string;
  content: string;
  cmsSubjectProductRelations: CmsSubjectProductRelations[];
};

export type CmsSubjectProductRelations = {
  id?: number;
  subjectId: number;
  productId: number;
  pmsProduct?: PmsProduct;
};

export const CmsApi = {
  getHelpList(
    dto: {
      keyword?: string;
      categoryIdList?: string;
      langList?: string;
    } & PageQuery
  ) {
    return ginzaxiaomaApiRequest.get<{
      list: CmsHelp[];
      total: number;
    }>('/admin/cms/help-list', {
      params: dto,
    });
  },

  helpPublish(id: CmsHelp['id']) {
    return ginzaxiaomaApiRequest.post(`/admin/cms/help/publish/${id}`);
  },

  helpUnPublish(id: CmsHelp['id']) {
    return ginzaxiaomaApiRequest.post(`/admin/cms/help/un-publish/${id}`);
  },

  getHelpDetail(id: CmsHelp['id']) {
    return ginzaxiaomaApiRequest.get<CmsHelp>(`/admin/cms/help/${id}`);
  },

  helpCreate(dto: Partial<CmsHelp>) {
    return ginzaxiaomaApiRequest.post<CmsHelp>(`/admin/cms/help/create`, dto);
  },

  helpUpdate(dto: Partial<CmsHelp>) {
    return ginzaxiaomaApiRequest.put<CmsHelp>(`/admin/cms/help/update`, dto);
  },

  helpDelete(id: CmsHelp['id']) {
    return ginzaxiaomaApiRequest.delete<CmsHelp>(`/admin/cms/help/${id}`);
  },

  getHelpCategory() {
    return ginzaxiaomaApiRequest.get<CmsHelpCategory[]>(
      '/admin/cms/help-category'
    );
  },

  getHelpCategoryEdit(dto: Partial<CmsHelpCategory>) {
    return ginzaxiaomaApiRequest.post<CmsHelpCategory>(
      '/admin/cms/help-category',
      dto
    );
  },

  helpCategoryDelete(id: CmsHelpCategory['id']) {
    return ginzaxiaomaApiRequest.delete<CmsHelp>(
      `/admin/cms/help-category/${id}`
    );
  },

  getSubjectCategory(dto?: { name?: string }) {
    return ginzaxiaomaApiRequest.get<CmsSubjectCategory[]>(
      '/admin/cms/subject-category',
      {
        params: dto,
      }
    );
  },

  getSubjectCategoryEdit(dto: Partial<CmsHelpCategory>) {
    return ginzaxiaomaApiRequest.post<CmsHelpCategory>(
      '/admin/cms/subject-category',
      dto
    );
  },

  subjectCategoryDelete(id: CmsHelpCategory['id']) {
    return ginzaxiaomaApiRequest.delete<CmsHelp>(
      `/admin/cms/subject-category/${id}`
    );
  },

  getSubjectList(
    dto: {
      keyword?: string;
      categoryIdList?: string;
      langList?: string;
    } & PageQuery
  ) {
    return ginzaxiaomaApiRequest.get<{
      list: CmsSubject[];
      total: number;
    }>('/admin/cms/subject-list', {
      params: dto,
    });
  },

  getSubjectDetail(id: CmsSubject['id']) {
    return ginzaxiaomaApiRequest.get<CmsSubject>(
      `/admin/cms/cms-subject/${id}`
    );
  },

  subjectEdit(dto: Partial<CmsSubject>) {
    return ginzaxiaomaApiRequest.post<CmsSubject>(
      `/admin/cms/cms-subject`,
      dto
    );
  },

  subjectDelete(id: CmsSubject['id']) {
    return ginzaxiaomaApiRequest.delete<CmsSubject>(
      `/admin/cms/cms-subject/${id}`
    );
  },

  subjectProductDelete(id: CmsSubjectProductRelations['id']) {
    return ginzaxiaomaApiRequest.delete<CmsSubjectProductRelations>(
      `/admin/cms/subject-product/${id}`
    );
  },
};
