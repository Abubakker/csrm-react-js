# 晓马商铺店头系统

## 开发

### 项目启动

```
yarn
yarn start
```

### 调试本地接口

项目默认调用测试环境接口

```
// .env.development
REACT_APP_BASE_API=http://test1.ginzaxiaoma.com:8190/mall-admin
```

如果想在本地调试时，调用本地的后台服务，需要在项目新建 `.env.development.local` 配置文件：

```
touch .env.development.local
echo 'REACT_APP_BASE_API=http://localhost:8080' > .env.development.local
```
