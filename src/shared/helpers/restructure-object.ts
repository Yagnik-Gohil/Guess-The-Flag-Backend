const restructureObject = (obj: { [key: string]: any }) => {
  const result = {};

  for (const key in obj) {
    if (key.includes('.')) {
      const keys = key.split('.');
      let tempObj = result;

      for (let i = 0; i < keys.length - 1; i++) {
        tempObj = tempObj[keys[i]] = tempObj[keys[i]] || {};
      }

      tempObj[keys[keys.length - 1]] = obj[key];
    } else {
      result[key] = obj[key];
    }
  }

  return result;
};

export default restructureObject;
