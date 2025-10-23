export async function getIntroData() {
  const res = await fetch('https://api-zihao-hk.kooboo.io/api/intro')
  const json = await res.json()
console.log(json);

  if (json.code !== 200) {
    throw new Error(json.message || '接口错误')
  }

  return json.data
}