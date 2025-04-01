import { ginzaxiaomaApiRequest } from 'apis';

const commonApi = {
  photoRoomRemoveBackground(dto: { url: string; addShadow: boolean }) {
    return ginzaxiaomaApiRequest.post<Promise<string>>(
      '/admin/common/photo-room/remove-background-url',
      dto
    );
  },

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return ginzaxiaomaApiRequest.post<{
      url: string;
    }>('/admin/common/upload-file', formData);
  },

  getSignedFileUrl(key: string) {
    return ginzaxiaomaApiRequest.get<{
      url: string;
    }>(`/admin/common/get-signed-file-url?key=${key}`);
  },
  recycleConsignmentDraftData() {
    return ginzaxiaomaApiRequest.get(
      '/admin/common/recycle-consignment-draft-data'
    );
  },
  setRecycleConsignmentDraftData(data: any) {
    return ginzaxiaomaApiRequest.post(
      '/admin/common/recycle-consignment-draft-data',
      data
    );
  },
};

export default commonApi;
