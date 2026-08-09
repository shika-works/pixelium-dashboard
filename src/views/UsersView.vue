<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { Form, Message } from '@pixelium/web-vue'
import { IconSearch, IconUserPlus } from '@pixelium/web-vue/icon-pa/es'

interface UserRow {
  key: number
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'banned' | 'pending'
  registerDate: string
}

const { t } = useI18n()

const firstNames = [
  'Emma', 'James', 'Sophia', 'Michael', 'Olivia', 'William',
  'Ava', 'Ethan', 'Isabella', 'Lucas', 'Mia', 'Noah',
]
const lastNames = [
  'Johnson', 'Wilson', 'Chen', 'Brown', 'Davis', 'Miller',
  'Garcia', 'Rodriguez', 'Anderson', 'Taylor', 'Thomas', 'Moore',
]

function generateUsers(count: number): UserRow[] {
  const roles: UserRow['role'][] = ['admin', 'editor', 'viewer']
  const statuses: UserRow['status'][] = ['active', 'banned', 'pending']
  return Array.from({ length: count }, (_, i) => {
    const first = firstNames[i % firstNames.length]
    const last = lastNames[i % lastNames.length]
    return {
      key: i + 1,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
      role: roles[i % roles.length],
      status: statuses[i % 7 === 3 ? 1 : i % 5 === 2 ? 2 : 0],
      registerDate: `2026-0${(i % 6) + 1}-1${i % 9}`,
    }
  })
}

const users = ref<UserRow[]>(generateUsers(48))
const keyword = ref('')
const roleFilter = ref('all')
const statusFilter = ref('all')
const page = ref(1)
const pageSize = ref(10)
const selectedKeys = ref<(string | number | symbol)[]>([])

const filteredUsers = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return users.value.filter((u) => {
    const matchKw = !kw || u.name.toLowerCase().includes(kw) || u.email.toLowerCase().includes(kw)
    const matchRole = roleFilter.value === 'all' || u.role === roleFilter.value
    const matchStatus = statusFilter.value === 'all' || u.status === statusFilter.value
    return matchKw && matchRole && matchStatus
  })
})

watch([keyword, roleFilter, statusFilter], () => {
  page.value = 1
})

const roleOptions = computed(() => [
  { label: t('common.all'), value: 'all' },
  { label: t('users.roles.admin'), value: 'admin' },
  { label: t('users.roles.editor'), value: 'editor' },
  { label: t('users.roles.viewer'), value: 'viewer' },
])

const statusOptions = computed(() => [
  { label: t('common.all'), value: 'all' },
  { label: t('users.status.active'), value: 'active' },
  { label: t('users.status.banned'), value: 'banned' },
  { label: t('users.status.pending'), value: 'pending' },
])

const ROLE_THEME: Record<string, 'sakura' | 'notice' | 'info'> = {
  admin: 'sakura',
  editor: 'notice',
  viewer: 'info',
}
const STATUS_THEME: Record<string, 'success' | 'danger' | 'warning' | 'info'> = {
  active: 'success',
  banned: 'danger',
  pending: 'warning',
}

const columns = computed(() => [
  { key: 'name', label: t('users.columns.name'), slotName: 'name', minWidth: 170 },
  { key: 'email', label: t('users.columns.email'), field: 'email', minWidth: 200 },
  { key: 'role', label: t('users.columns.role'), slotName: 'role', width: 120 },
  { key: 'status', label: t('users.columns.status'), slotName: 'status', width: 110 },
  { key: 'registerDate', label: t('users.columns.registerDate'), field: 'registerDate', width: 130 },
  { key: 'actions', label: t('users.columns.actions'), slotName: 'actions', width: 180, align: 'center' },
])

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function removeUser(row: UserRow) {
  users.value = users.value.filter((u) => u.key !== row.key)
  Message.success(t('users.deleted'))
}

function editUser(row: UserRow) {
  Message.info(row.name)
}

const addVisible = ref(false)
const formRef = shallowRef<InstanceType<typeof Form> | null>(null)
const newUser = ref({
  name: '',
  email: '',
  role: 'viewer' as UserRow['role'],
})

function openAddDialog() {
  newUser.value = { name: '', email: '', role: 'viewer' }
  addVisible.value = true
}

const addRules = computed(() => ({
  name: { required: true, message: t('common.fillRequired') },
  email: { required: true, email: true, message: t('common.fillRequired') },
}))

const dialogRoleOptions = computed(() => roleOptions.value.slice(1))

async function submitAddUser() {
  const res = await formRef.value?.validate()
  if (!res?.isValid) return false
  users.value = [
    {
      key: Date.now(),
      name: newUser.value.name,
      email: newUser.value.email,
      role: newUser.value.role,
      status: 'active',
      registerDate: new Date().toISOString().slice(0, 10),
    },
    ...users.value,
  ]
  Message.success(t('users.addUser'))
  return true
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2 class="page-header__title">{{ t('users.title') }}</h2>
        <p class="page-header__subtitle">{{ t('users.subtitle') }}</p>
      </div>
      <div class="page-header__actions">
        <px-tag theme="primary" shape="round">{{ t('users.total') }}: {{ users.length }}</px-tag>
        <px-button theme="primary" @click="openAddDialog">
          <template #icon>
            <IconUserPlus />
          </template>
          {{ t('users.addUser') }}
        </px-button>
      </div>
    </div>

    <px-card>
      <div class="toolbar">
        <px-input
          v-model="keyword"
          class="toolbar-search"
          :placeholder="t('users.searchPlaceholder')"
          clearable
        >
          <template #prefix>
            <IconSearch />
          </template>
        </px-input>
        <px-select v-model="roleFilter" :options="roleOptions" class="toolbar-select" />
        <px-select v-model="statusFilter" :options="statusOptions" class="toolbar-select" />
        <div class="toolbar-spacer" />
        <px-tag v-if="selectedKeys.length" theme="notice" shape="round">
          {{ selectedKeys.length }} selected
        </px-tag>
      </div>

      <px-table
        :data="filteredUsers"
        :columns="columns"
        row-key="key"
        :selection="{ multiple: true, showSelectAll: true }"
        v-model:selected-keys="selectedKeys"
        v-model:page="page"
        v-model:page-size="pageSize"
        :pagination="{ showTotal: true, showJumper: true, showSize: true }"
        variant="striped"
      >
        <template #name="{ record }">
          <div class="user-cell">
            <px-avatar shape="square" size="small">{{ initials(record.name) }}</px-avatar>
            <span>{{ record.name }}</span>
          </div>
        </template>
        <template #role="{ record }">
          <px-tag :theme="ROLE_THEME[record.role] ?? 'info'" size="small">
            {{ t(`users.roles.${record.role}`) }}
          </px-tag>
        </template>
        <template #status="{ record }">
          <px-tag :theme="STATUS_THEME[record.status] ?? 'info'" size="small" shape="round">
            {{ t(`users.status.${record.status}`) }}
          </px-tag>
        </template>
        <template #actions="{ record }">
          <div class="action-cell">
            <px-button size="small" variant="text" theme="primary" @click="editUser(record)">
              {{ t('users.edit') }}
            </px-button>
            <px-popconfirm
              :content="t('users.deleteConfirm')"
              :ok-text="t('common.confirm')"
              :cancel-text="t('common.cancel')"
              @ok="removeUser(record)"
            >
              <px-button size="small" variant="text" theme="danger">{{ t('users.delete') }}</px-button>
            </px-popconfirm>
          </div>
        </template>
      </px-table>
    </px-card>

    <px-dialog
      v-model:visible="addVisible"
      :title="t('users.addUser')"
      style="width: 480px"
      @before-ok="submitAddUser"
    >
      <px-form :model="newUser" :rules="addRules" ref="formRef" poll-size-change>
        <px-form-item :label="t('users.columns.name')" field="name">
          <px-input v-model="newUser.name" :placeholder="t('settings.profile.namePlaceholder')" />
        </px-form-item>
        <px-form-item :label="t('users.columns.email')" field="email">
          <px-input v-model="newUser.email" :placeholder="t('settings.profile.emailPlaceholder')" />
        </px-form-item>
        <px-form-item :label="t('users.columns.role')" field="role">
          <px-select v-model="newUser.role" :options="dialogRoleOptions" />
        </px-form-item>
      </px-form>
    </px-dialog>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.toolbar-search {
  width: 260px;
}

.toolbar-select {
  width: 150px;
}

.toolbar-spacer {
  flex: 1;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-cell {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
}
</style>

