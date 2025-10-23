export async function loginApi(data: { email: string; password: string }) {
    const res = await fetch('https://api-zihao-hk.kooboo.io/api/account/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    const json = await res.json()
    console.log(json);
    
    if (json.code !== 200) {
        throw new Error(json.message || '登录失败')
    }

    return json.data
}
export async function registerApi(data: { email: string; password: string }) {
    const res = await fetch('https://api-zihao-hk.kooboo.io/api/account/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    const json = await res.json()

    if (json.code !== 200) {
        throw new Error(json.message || '登录失败')
    }

    return json.data
}