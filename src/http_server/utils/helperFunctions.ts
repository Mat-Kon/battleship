import crypto from 'crypto';

function parseJSONRecursion<T>(jsonString: string): T {
  try {
    const outerObject = JSON.parse(jsonString);

    const parseNestedObjects = (obj: any) => {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          try {
            obj[key] = JSON.parse(obj[key]);
          } catch (error) {
            console.log('parse end');
          }
        } else if (typeof obj[key] === 'object') {
          parseNestedObjects(obj[key]);
        }
      }
    };

    parseNestedObjects(outerObject);

    return outerObject;
  } catch (error) {
    throw new Error(`error parse JSON: ${error}`);
  }
};

const hashPassword = (password: string) => {
  const hash = crypto.createHash('SHA256');
  hash.update(password);
  const hashPassword = hash.digest('hex');
  return hashPassword;
};

export { parseJSONRecursion, hashPassword }