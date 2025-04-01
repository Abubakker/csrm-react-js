function setQueryParameters(paramsObject: { [key: string]: any }) {
  // 获取当前的查询参数
  const currentParams = new URLSearchParams();

  // 遍历传入的对象，设置查询参数
  for (let key in paramsObject) {
    if (paramsObject.hasOwnProperty(key)) {
      const obj = paramsObject[key];

      if (obj === undefined || obj === null || obj === '') {
        continue;
      }

      if (Array.isArray(obj) && obj.length === 0) {
        continue;
      }

      currentParams.set(key, `${paramsObject[key]}`);
    }
  }

  // 构建新的 URL
  const newUrl = window.location.pathname + '?' + currentParams.toString();

  // 使用 history.replaceState 更新 URL
  window.history.replaceState({}, '', newUrl);
}

export default setQueryParameters;
