import { Button, Card, Form, Input } from 'antd';
import { userLogin } from 'apis/user';
import { getLocalStorageFirstPage, LOCAL_STORAGE_TOKEN_KEY } from 'commons';
import { useCallback } from 'react';
import styles from './index.module.scss';
import { Trans } from 'react-i18next';
import LOCALS from 'commons/locals';
import i18n from 'i18n';

const Login = () => {
  const onFinish = useCallback(async (values: any) => {
    const { username, password } = values;

    const {
      data: { tokenHead, token },
    } = await userLogin({ username, password });

    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, tokenHead + token);
    window.location.href = getLocalStorageFirstPage(username);
  }, []);

  return (
    <div className={styles.login}>
      <Card style={{ width: 384 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24, fontSize: 20 }}>
          GINZA XIAOMA ADMIN
        </h2>
        <Form
          layout="vertical"
          labelCol={{ span: 8 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
        >
          <Form.Item
            label={<Trans i18nKey={LOCALS.account} />}
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder={i18n.t(LOCALS.please_enter) || ''} />
          </Form.Item>

          <Form.Item
            label={<Trans i18nKey={LOCALS.password} />}
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder={i18n.t(LOCALS.please_enter) || ''} />
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              <Trans i18nKey={LOCALS.log_in} />
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
