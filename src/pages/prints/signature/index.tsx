import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import styles from './index.module.scss';

function HandwrittenSignature() {
  const signatureRef = useRef<any>();
  const [image, setImage] = useState<string>('');

  const clearSignature = () => {
    console.log(
      '🚀  clearSignature  signatureRef.current:',
      signatureRef.current
    );

    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const saveSignature = () => {
    const signatureImage = signatureRef.current.toDataURL(); // 获取签名图像数据
    // 在这里，你可以将签名图像数据保存到数据库或发送到服务器
    console.log(signatureImage);
    setImage(signatureImage);
  };

  return (
    <div className={styles.container}>
      <SignatureCanvas
        ref={signatureRef}
        backgroundColor="white"
        penColor="black"
        canvasProps={{ width: 400, height: 200, className: 'sigCanvas' }}
      />
      <button onClick={clearSignature}>清除</button>
      <button onClick={saveSignature}>保存</button>
      {image && <img src={image} alt={'1'} />}
    </div>
  );
}

export default HandwrittenSignature;
