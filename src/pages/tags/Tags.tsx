import { useCallback, useEffect, useState } from 'react';
import { TagMessageIcon, TagUserICon } from 'assets/images';
import { useTranslation } from 'react-i18next';
import { Form, Modal, notification } from 'antd';
import TagForm from 'components/tags/TagForm';
import {
  useCreateTagMutation,
  useSearchTagsQuery,
  useUpdateTagMutation,
} from 'store/tags-store/tagsApi';
import UserTagsSection from 'components/tags/TagsSection';
import TagsSection from 'components/tags/TagsSection';

export enum TagType {
  User = 'user',
  Chat = 'chat',
}

const Tags = () => {
  const [isUpdate, setIsUpdate] = useState<{ status: boolean; item: any }>({
    status: false,
    item: null,
  });
  const [isModalOpen, setIsModalOpen] = useState({ status: false, type: '' });

  const [initialValues, setInitialValues] = useState({
    name: '',
    color: '#C9E5C3',
    description: '',
  });

  const {
    data: userTags,
    isSuccess,
    isLoading: userTagsLoading,
  } = useSearchTagsQuery({ keyword: '', type: 'user' });

  const {
    data: chatTags,
    isSuccess: chatTagsSuccess,
    isLoading: chatTagsLoading,
  } = useSearchTagsQuery({ keyword: '', type: 'chat' });

  const [
    createTag,
    { isLoading: createTagLoading, isSuccess: createTagSuccess },
  ] = useCreateTagMutation();

  const [updateTag, { isLoading: updateLoading, isSuccess: updateSuccess }] =
    useUpdateTagMutation();

  const { t } = useTranslation();

  const [form] = Form.useForm();

  const handleCloseModal = useCallback(() => {
    setIsModalOpen({ status: false, type: '' });
    setInitialValues({ name: '', color: '#C9E5C3', description: '' });
    form.resetFields();
  }, [form, setIsModalOpen, setInitialValues]);

  const handleOpenModal = (type: string) => {
    setIsModalOpen({ status: true, type });
  };

  const handleSubmit = async (
    name: string,
    description: string,
    color: string
  ) => {
    try {
      const result = isUpdate.status
        ? await updateTag({
            id: isUpdate.item?.id,
            data: {
              name,
              description,
              color,
              isActive: true,
              type: isModalOpen.type,
            },
          })
        : await createTag({
            name,
            description,
            color,
            isActive: true,
            type: isModalOpen.type,
          });

      if ('data' in result) {
        notification.success({
          message: '',
          description: isUpdate.status ? t('tag_updated') : t('tag_created'),
          duration: 2,
          placement: 'bottomRight',
        });
      } else if ('error' in result) {
        if ('data' in result.error) {
          notification.error({
            message: '',
            description:
              `${(result.error.data as any).message}` || t('unknown_error'),
            duration: 2,
            placement: 'bottomRight',
          });
        } else {
          notification.error({
            message: '',
            description: t('unknown_error'),
            duration: 2,
            placement: 'bottomRight',
          });
        }
      }
    } catch (error) {
      notification.error({
        message: '',
        description:
          error instanceof Error ? error.message : t('unknown_error'),
        duration: 2,
        placement: 'bottomRight',
      });
    }
  };

  const handleUpdate = (tag: any) => {
    new Promise((resolve) => {
      setInitialValues({
        name: tag.name,
        color: tag.color,
        description: tag.description,
      });
      resolve(true);
    }).then(() => {
      setIsUpdate({ status: true, item: tag });
      handleOpenModal(tag.type);
    });
  };

  const handleInputChange = (event: { name: string; value: string }) => {
    setInitialValues((prevValues) => ({
      ...prevValues,
      [event.name]: event.value,
    }));
  };

  useEffect(() => {
    if (createTagSuccess || updateSuccess) {
      handleCloseModal();
    }
  }, [createTagSuccess, updateSuccess, handleCloseModal]);

  return (
    <div className="-mx-8 -my-10 overflow-x-auto">
      <div className="max-w-[1920px] bg-white min-h-[calc(100vh-64px)] w-full flex flex-col md:flex-row justify-between border-t-2 border-[#DADDEB]">
        <div className="flex-1 border-r-2 border-[#DADDEB] p-6">
          <UserTagsSection
            tags={userTags || []}
            isLoading={userTagsLoading}
            isSuccess={isSuccess}
            btnText={t('create_new_user_tag')}
            message={t('no_user_tags')}
            icon={TagUserICon}
            onOpenModal={handleOpenModal}
            onUpdateTag={handleUpdate}
            type={TagType.User}
          />
        </div>
        <div className="flex-1 p-6">
          <TagsSection
            type={TagType.Chat}
            tags={chatTags || []}
            isLoading={chatTagsLoading}
            isSuccess={chatTagsSuccess}
            btnText={t('create_new_chat_tag')}
            message={t('no_chat_tags')}
            icon={TagMessageIcon}
            onOpenModal={handleOpenModal}
            onUpdateTag={handleUpdate}
          />
        </div>
        <Modal
          title={
            <h3 className="font-bold font-NotoSans">
              {t(
                isModalOpen.type === 'user'
                  ? isUpdate.status
                    ? 'edit_user_tag'
                    : 'create_new_user_tag'
                  : isUpdate.status
                  ? 'edit_chat_tag'
                  : 'create_new_chat_tag'
              )}
            </h3>
          }
          centered
          open={isModalOpen.status}
          onCancel={handleCloseModal}
          footer={null}
          className="integration-modal"
        >
          <TagForm
            initialValues={initialValues}
            handleSubmit={handleSubmit}
            isLoading={createTagLoading || updateLoading}
            handleCancel={handleCloseModal}
            isUpdate={isUpdate.status}
            form={form}
            handleInputChange={handleInputChange}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Tags;
