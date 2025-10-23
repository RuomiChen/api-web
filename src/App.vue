<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Header -->
    <div v-if="isFetching">fetching...</div>
    <div v-else-if="error">{{ error }}</div>
    <template v-else>
      <header class="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold text-slate-900">MiChen API 开放平台</h1>
              <p class="text-sm text-slate-600 mt-1">强大的数据接口服务</p>
            </div>
            <div v-if="!isLoggedIn" class="flex gap-3">
              <button @click="showLoginModal = true"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                登录
              </button>
            </div>
            <div v-else class="flex items-center gap-4">
              <div class="text-right">
                <p class="text-sm text-slate-600">欢迎回来</p>
                <p class="font-semibold text-slate-900">{{ user.email }}</p>
              </div>
              <button @click="logout" class="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors">
                退出
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- 未登录列表概览 -->
        <div v-if="!isLoggedIn" class="space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 class="text-xl font-bold text-slate-900 mb-3">平台介绍</h2>
            <p class="text-slate-600 leading-relaxed">
              我们提供稳定、高效的 API 接口服务，帮助开发者快速集成各类功能。登录后即可获取 API Token 并查看详细文档。
            </p>
          </div>

          <!-- API 接口列表 -->
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-slate-900">开放接口列表</h2>
              <span class="text-sm text-slate-500">共 {{ data.length }} 个接口</span>
            </div>

            <div class="grid gap-4">
              <ApiCard v-for="api in pagedApiList" :key="api.id" :api="api" :isLoggedIn="isLoggedIn"
                @login="showLoginModal = true" />
            </div>

            <!-- 分页控件 -->
            <div class="flex justify-center items-center gap-2 mt-4">
              <button class="px-3 py-1 border rounded disabled:opacity-50" :disabled="currentPage === 1"
                @click="currentPage--">上一页</button>
              <span>第 {{ currentPage }} / {{ totalPages }} 页</span>
              <button class="px-3 py-1 border rounded disabled:opacity-50" :disabled="currentPage === totalPages"
                @click="currentPage++">下一页</button>
            </div>
          </div>

          <!-- 登录提示 -->
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <Lock class="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 class="text-lg font-semibold text-slate-900 mb-2">登录获取更多权限</h3>
            <p class="text-slate-600 mb-4">登录后可查看完整 API 文档、获取 Token 并开始调用接口</p>
            <button @click="showLoginModal = true"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              立即登录
            </button>
          </div>
        </div>

        <!-- 登录后完整文档 -->
        <div v-else class="space-y-6">
          <!-- Token 卡片 -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h2 class="text-lg font-semibold mb-2">您的 API Token</h2>
                <p class="text-blue-100 text-sm mb-4">请妥善保管，不要泄露给他人</p>
                <div class="bg-white/10 backdrop-blur rounded-lg p-4 font-mono text-sm break-all ">
                  {{ user.token }}
                </div>
              </div>
              <button @click="copyToken"
                class="ml-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2">
                <Copy class="w-4 h-4" />
                {{ copied ? '已复制' : '复制' }}
              </button>
            </div>
          </div>

          <!-- 使用指南 -->
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 class="text-xl font-bold text-slate-900 mb-4">使用指南</h2>
            <div class="space-y-3 text-slate-600">
              <div class="flex items-start gap-3">
                <div
                  class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  1</div>
                <p>在请求头中添加 <code class="bg-slate-100 px-2 py-1 rounded text-sm">Authorization: Bearer YOUR_TOKEN</code>
                </p>
              </div>
              <div class="flex items-start gap-3">
                <div
                  class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  2</div>
                <p>所有请求和响应均使用 JSON 格式</p>
              </div>
              <div class="flex items-start gap-3">
                <div
                  class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  3</div>
                <p>API 调用频率限制：1000 次/小时</p>
              </div>
            </div>
          </div>

          <!-- API 文档列表 -->
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 class="text-xl font-bold text-slate-900 mb-6">API 接口文档</h2>

            <div class="space-y-6">
              <div v-for="api in pagedApiList" :key="api.id"
                class="border border-slate-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                <div class="flex items-center gap-3 mb-4">
                  <component :is="api.icon" class="w-6 h-6 text-blue-600" />
                  <h3 class="text-lg font-semibold text-slate-900">{{ api.name }}</h3>
                  <span class="px-3 py-1 text-sm font-medium rounded" :class="getMethodClass(api.method)">{{ api.method
                    }}</span>
                </div>

                <p class="text-slate-600 mb-4">{{ api.description }}</p>

                <div class="space-y-3">
                  <div>
                    <span class="text-sm font-medium text-slate-700">请求地址：</span>
                    <code class="ml-2 bg-slate-100 text-slate-800 px-3 py-1 rounded text-sm">{{ api.endpoint }}</code>
                  </div>

                  <div>
                    <span class="text-sm font-medium text-slate-700 block mb-2">请求参数：</span>
                    <div class="bg-slate-50 rounded-lg p-4 space-y-2">
                      <div v-for="param in api.params" :key="param.name" class="flex items-start gap-3 text-sm">
                        <code class="text-blue-600 font-medium">{{ param.name }}</code>
                        <span class="text-slate-500">{{ param.type }}</span>
                        <span class="px-2 py-0.5 rounded text-xs"
                          :class="param.required ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'">
                          {{ param.required == 'true' ? '必填' : '可选' }}
                        </span>
                        <span class="text-slate-600">{{ param.description }}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span class="text-sm font-medium text-slate-700 block mb-2">请求示例：</span>
                    <pre
                      class="bg-slate-900 text-slate-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{{ api.example }}</code></pre>
                  </div>
                </div>
              </div>
            </div>

            <!-- 分页控件 -->
            <div class="flex justify-center items-center gap-2 mt-4">
              <button class="px-3 py-1 border rounded disabled:opacity-50" :disabled="currentPage === 1"
                @click="currentPage--">上一页</button>
              <span>第 {{ currentPage }} / {{ totalPages }} 页</span>
              <button class="px-3 py-1 border rounded disabled:opacity-50" :disabled="currentPage === totalPages"
                @click="currentPage++">下一页</button>
            </div>
          </div>
        </div>
      </main>
      <!-- Footer -->
      <footer class="bg-slate-50 border-t border-slate-200 mt-12">
        <div
          class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-slate-500">© 2025 MiChen API 开放平台. 保留所有权利。</p>

          <div class="flex flex-wrap gap-4">
            <a href="https://bz.rmcyyds.top" target="_blank" class="text-blue-600 hover:underline text-sm">迷尘壁纸</a>
          </div>
        </div>
      </footer>

      <!-- 登录弹窗 (保持原来的) -->
      <!-- 登录/注册弹窗 -->
      <div v-if="showLoginModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <h2 class="text-2xl font-bold text-slate-900 mb-6 text-center">
            {{ isRegisterMode ? '注册账号' : '登录账号' }}
          </h2>

          <form @submit.prevent="isRegisterMode ? register() : login()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">邮箱</label>
              <input v-model="loginForm.email" type="text" required
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="请输入邮箱" />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">密码</label>
              <input v-model="loginForm.password" type="password" required
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="请输入密码" />
            </div>

            <!-- 注册模式下显示确认密码 -->
            <div v-if="isRegisterMode">
              <label class="block text-sm font-medium text-slate-700 mb-2">确认密码</label>
              <input v-model="loginForm.confirmPassword" type="password" required
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="请再次输入密码" />
            </div>



            <div class="flex gap-3 pt-2">
              <button type="button" @click="showLoginModal = false"
                class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                取消
              </button>
              <button type="submit"
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                {{ isRegisterMode ? '注册' : '登录' }}
              </button>
            </div>

            <!-- 切换按钮 -->
            <div class="text-center text-sm text-slate-600 mt-4">
              <span>{{ isRegisterMode ? '已有账号？' : '还没有账号？' }}</span>
              <button type="button" class="text-blue-600 hover:underline ml-1" @click="toggleMode">
                {{ isRegisterMode ? '去登录' : '去注册' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </template>

  </div>
</template>

<script setup lang="ts">
import { useMutation, useQuery } from '@tanstack/vue-query';
import { Copy, Lock } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';
import ApiCard from './components/ApiCard.vue';
import { loginApi, registerApi } from './service/AuthService';
import { getIntroData } from './service/IntroService';

interface ApiParam { name: string; type: string; required: boolean; description: string }
interface ApiInfo { id: number; name: string; method: string; endpoint: string; description: string; icon: any; params: ApiParam[]; example: string }

const user = ref(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null)

const isLoggedIn = computed(() => !!user.value)
const showLoginModal = ref(false)
const email = ref('')
const apiToken = ref('')
const copied = ref(false)
const loginForm = ref({ email: '', password: '', confirmPassword: '' })


// 分页状态
const currentPage = ref(1)
const pageSize = ref(3)
const totalPages = ref(1)

const { isPending, isError, isFetching, data, error, refetch } = useQuery({
  queryKey: ['intro'],
  queryFn: getIntroData,
})



// 计算分页列表
const pagedApiList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return data.value.slice(start, end)
})

// 总页数计算
watch(data, (list) => {
  totalPages.value = Math.ceil(list.length / pageSize.value)
})


// ✅ 登录 Mutation（异步请求）
const { mutate: loginMutate, isPending: isLoggingIn, error: loginError } = useMutation({
  mutationFn: loginApi,
  onSuccess({ user: data }) {
    // 假设后端返回 { token, email }
    console.log(data);

    user.value = data
    localStorage.setItem('user', JSON.stringify(data))
    email.value = data.email
    apiToken.value = data.token
    showLoginModal.value = false
    loginForm.value = { email: '', password: '', confirmPassword: '' }
  },
  onError(err: any) {
    alert(err.message || '登录失败')
  },
})
// ✅ 登录方法（触发 useMutation）
const login = () => {
  const { email, password } = loginForm.value
  if (!email || !password) {
    alert('请填写邮箱和密码')
    return
  }

  loginMutate({ email, password })
}
const { mutate: registerMutate, } = useMutation({
  mutationFn: registerApi,
  onSuccess(data) {
    isRegisterMode.value = false
    loginForm.value = { email: '', password: '', confirmPassword: '' }
    const { email, password } = loginForm.value
    if (!email || !password) {
      alert('请填写邮箱和密码')
      return
    }
  },
  onError(err: any) {
    alert(err.message || '注册失败')
  },
})
// ✅ 登录方法（触发 useMutation）

const isRegisterMode = ref(false) // 登录/注册切换
const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value
  loginForm.value = { email: '', password: '', confirmPassword: '' }
}

const register = () => {
  const { email, password, confirmPassword } = loginForm.value
  if (!email || !password) return alert('请填写完整信息')
  if (password !== confirmPassword) return alert('两次输入密码不一致')
  // 实际场景中此处应调用后端注册接口

  registerMutate({ email, password })
}
const logout = () => { user.value = null; localStorage.removeItem('user'); email.value = ''; apiToken.value = '' }
const copyToken = async () => { try { await navigator.clipboard.writeText(apiToken.value); copied.value = true; setTimeout(() => copied.value = false, 2000) } catch { alert('复制失败，请手动复制') } }

const getMethodClass = (method: string) => {
  const classes = { GET: 'bg-green-100 text-green-700', POST: 'bg-blue-100 text-blue-700', PUT: 'bg-yellow-100 text-yellow-700', DELETE: 'bg-red-100 text-red-700' }
  return classes[method as keyof typeof classes] || 'bg-slate-100 text-slate-700'
}
</script>
