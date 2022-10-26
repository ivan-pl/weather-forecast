export default function template(
  tpl: string,
  data: { [key: string]: any }
): string {
  const result = tpl.replace(/\{\{(\w+)\}\}/g, (match, propName) => {
    if (propName in data) {
      return data[propName];
    }
    return "";
  });
  return result;
}
