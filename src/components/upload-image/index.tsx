import { useEffect, useState } from 'react';
import { Row, Col, Upload, Modal } from 'antd';
import { getLocalStorageToken } from 'commons';
import { s3UploadUrl } from 'apis/cms';
import type { UploadFile } from 'antd/es/upload/interface';
import type { UploadProps } from 'antd';
import type { RcFile } from 'antd/es/upload';
import i18n from 'i18n';
import { getUploadImageObj } from 'constants/RecyclingConsignment';

interface uploadObject {
  [key: string]: string | undefined;
  front?: string;
  back?: string;
  interior?: string;
  blindStamp?: string;
}

interface Props {
  onChange?: (data: uploadObject) => void;
  value?: uploadObject;
  ItemName?: string;
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const UploadImage = ({ onChange, value, ItemName }: Props) => {
  /** 单个文件 */
  const [front, setFront] = useState<UploadFile[]>([]);
  const [back, setBack] = useState<UploadFile[]>([]);
  const [interior, setInterior] = useState<UploadFile[]>([]);
  const [blindStamp, setBlindStamp] = useState<UploadFile[]>([]);
  /** 多个文件 */
  const [hardwareList, setHardwareList] = useState<UploadFile[]>([]);
  const [signsOfWearList, setSignsOfWearList] = useState<UploadFile[]>([]);
  const [accessoriesList, setAccessoriesList] = useState<UploadFile[]>([]);
  const [moreList, setMoreList] = useState<UploadFile[]>([]);
  /** 预览 */
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const uploadProps: UploadProps = {
    data: {
      loginToken: getLocalStorageToken(),
    },
    accept: 'image/*',
    listType: 'picture-card',
    action: s3UploadUrl,
    onPreview: handlePreview,
  };

  const onChangeFunc = (fileList: UploadFile[], field: string) => {
    const payload: uploadObject = {};
    if (fileList.length && fileList.every((d) => d.status === 'done')) {
      fileList.forEach((d: UploadFile, i) => {
        if (d.response) {
          if (['front', 'back', 'interior', 'blindStamp'].includes(field)) {
            payload[field] = d.response.data.url;
          } else {
            payload[`${field}${i}`] = d.response.data.url;
          }
        }
      });
      onChange?.({ ...value, ...payload });
    } else {
      if (['front', 'back', 'interior', 'blindStamp'].includes(field)) {
        payload[field] = '';
      } else {
        payload[`${field}0`] = '';
      }
      onChange?.({ ...value, ...payload });
    }
  };

  useEffect(() => {
    if (!value || Object.keys(value).length === 0) return;
    if (value.front) setFront([getUploadImageObj(value.front, 0)]);
    if (value.back) setBack([getUploadImageObj(value.back, 0)]);
    if (value.interior) setInterior([getUploadImageObj(value.interior, 0)]);
    if (value.blindStamp)
      setBlindStamp([getUploadImageObj(value.blindStamp, 0)]);
    const hardwareList: UploadFile[] = [];
    const signsOfWearList: UploadFile[] = [];
    const accessoriesList: UploadFile[] = [];
    const moreList: UploadFile[] = [];
    Object.keys(value).forEach((key, i) => {
      if (key.indexOf('hardware') > -1) {
        hardwareList.push(getUploadImageObj(value[key], i));
      }
      if (key.indexOf('signsOfWear') > -1) {
        signsOfWearList.push(getUploadImageObj(value[key], i));
      }
      if (key.indexOf('accessories') > -1) {
        accessoriesList.push(getUploadImageObj(value[key], i));
      }
      if (key.indexOf('more') > -1) {
        moreList.push(getUploadImageObj(value[key], i));
      }
    });
    // console.log('🚀  useEffect  hardwareList:', hardwareList);
    if (hardwareList.length) setHardwareList(hardwareList);
    if (signsOfWearList.length) setSignsOfWearList(signsOfWearList);
    if (accessoriesList.length) setAccessoriesList(accessoriesList);
    if (moreList.length) setMoreList(moreList);
  }, [ItemName, value]);

  return (
    <div>
      <Row gutter={8}>
        <Col>
          <Upload
            {...uploadProps}
            fileList={front}
            onChange={(e) => {
              const { fileList } = e;
              setFront(fileList);
              onChangeFunc(fileList, 'front');
            }}
          >
            {front.length === 1 ? null : (
              <div>
                {i18n.t('front')}
                <br />({i18n.t('required')})
              </div>
            )}
          </Upload>
        </Col>
        <Col>
          <Upload
            {...uploadProps}
            fileList={back}
            onChange={(e) => {
              const { fileList } = e;
              setBack(fileList);
              onChangeFunc(fileList, 'back');
            }}
          >
            {back.length === 1 ? null : (
              <div>
                {i18n.t('back1')}
                <br />({i18n.t('required')})
              </div>
            )}
          </Upload>
        </Col>
        <Col>
          <Upload
            {...uploadProps}
            fileList={interior}
            onChange={(e) => {
              const { fileList } = e;
              setInterior(fileList);
              onChangeFunc(fileList, 'interior');
            }}
          >
            {interior.length === 1 ? null : (
              <div>
                {i18n.t('interior')}
                <br />({i18n.t('required')})
              </div>
            )}
          </Upload>
        </Col>
        <Col>
          <Upload
            {...uploadProps}
            fileList={blindStamp}
            onChange={(e) => {
              const { fileList } = e;
              setBlindStamp(fileList);
              onChangeFunc(fileList, 'blindStamp');
            }}
          >
            {blindStamp.length === 1 ? null : (
              <div>{i18n.t('blind_stamp')}</div>
            )}
          </Upload>
        </Col>
        <Col>
          <Upload
            {...uploadProps}
            fileList={hardwareList}
            onChange={(e) => {
              const { fileList } = e;
              setHardwareList(fileList);
              onChangeFunc(fileList, 'hardware');
            }}
          >
            <div>{i18n.t('hardware')}</div>
          </Upload>
        </Col>
        <Col>
          <Upload
            {...uploadProps}
            fileList={signsOfWearList}
            onChange={(e) => {
              const { fileList } = e;
              setSignsOfWearList(fileList);
              onChangeFunc(fileList, 'signsOfWear');
            }}
          >
            <div>{i18n.t('signs_of_wear')}</div>
          </Upload>
        </Col>
        <Col>
          <Upload
            {...uploadProps}
            fileList={accessoriesList}
            onChange={(e) => {
              const { fileList } = e;
              setAccessoriesList(fileList);
              onChangeFunc(fileList, 'accessories');
            }}
          >
            <div>{i18n.t('accessories')}</div>
          </Upload>
        </Col>
        <Col>
          <Upload
            {...uploadProps}
            fileList={moreList}
            onChange={(e) => {
              const { fileList } = e;
              setMoreList(fileList);
              onChangeFunc(fileList, 'more');
            }}
          >
            <div>{i18n.t('upload_more')}</div>
          </Upload>
        </Col>
      </Row>

      <Modal
        open={previewOpen}
        title={<div>&nbsp;</div>}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default UploadImage;
