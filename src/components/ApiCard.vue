<template>
  <div class="border border-slate-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
    <div class="flex items-center gap-3 mb-4">
      <component :is="api.icon" class="w-6 h-6 text-blue-600" />
      <h3 class="text-lg font-semibold text-slate-900">{{ api.name }}</h3>
      <span
        class="px-3 py-1 text-sm font-medium rounded"
        :class="methodClass(api.method)"
      >
        {{ api.method }}
      </span>
    </div>

    <p class="text-slate-600 mb-4">{{ api.description }}</p>

    <div v-if="!isLoggedIn" class="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
      <span>查看详细文档和参数说明</span>
      <button @click="$emit('login')" class="text-blue-600 hover:text-blue-700 flex items-center gap-1">
        <Lock class="w-4 h-4" /> 登录查看
      </button>
    </div>

    <div v-else class="space-y-3">
      <div>
        <span class="text-sm font-medium text-slate-700">请求地址：</span>
        <code class="ml-2 bg-slate-100 text-slate-800 px-3 py-1 rounded text-sm">{{ api.endpoint }}</code>
      </div>

      <div v-if="api.params && api.params.length">
        <span class="text-sm font-medium text-slate-700 block mb-2">请求参数：</span>
        <div class="bg-slate-50 rounded-lg p-4 space-y-2">
          <div v-for="param in api.params" :key="param.name" class="flex items-start gap-3 text-sm">
            <code class="text-blue-600 font-medium">{{ param.name }}</code>
            <span class="text-slate-500">{{ param.type }}</span>
            <span
              class="px-2 py-0.5 rounded text-xs"
              :class="param.required ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'"
            >
              {{ param.required ? '必填' : '可选' }}
            </span>
            <span class="text-slate-600">{{ param.description }}</span>
          </div>
        </div>
      </div>

      <div v-if="api.example">
        <span class="text-sm font-medium text-slate-700 block mb-2">请求示例：</span>
        <pre class="bg-slate-900 text-slate-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{{ api.example }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Lock } from 'lucide-vue-next';
import type { ApiInfo } from '../types';

const props = defineProps<{
  api: ApiInfo,
  isLoggedIn: boolean
}>()

const emits = defineEmits(['login'])

const methodClass = (method: string) => {
  const classes = {
    GET: 'bg-green-100 text-green-700',
    POST: 'bg-blue-100 text-blue-700',
    PUT: 'bg-yellow-100 text-yellow-700',
    DELETE: 'bg-red-100 text-red-700',
  }
  return classes[method as keyof typeof classes] || 'bg-slate-100 text-slate-700'
}
</script>
