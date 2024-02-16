function parseJSONRecursion(jsonString: string) {
  try {
    const outerObject = JSON.parse(jsonString);

    const parseNestedObjects = (obj: any) => {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          try {
            obj[key] = JSON.parse(obj[key]);
          } catch (error) {
            return;
          }
        } else if (typeof obj[key] === 'object') {
          parseNestedObjects(obj[key]);
        }
      }
    };

    parseNestedObjects(outerObject);

    return outerObject;
  } catch (error) {
    console.error('error parse JSON:', error);
    return null;
  }
};

export { parseJSONRecursion }