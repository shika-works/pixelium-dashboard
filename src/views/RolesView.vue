<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { Form, Message } from '@pixelium/web-vue'
import { IconSave, IconUserPlus } from '@pixelium/web-vue/icon-pa/es'

interface Role {
  key: number
  name: string
  code: string
  description: string
  users: number
  status: 'active' | 'disabled'
  permissions: string[]
}

const { t } = useI18n()

const ALL_PERMISSIONS = [
  'dashboard:view',
  'analytics:view',
  'users:view',
  'users:create',
  'users:edit',
  'users:delete',
  'orders:view',
  'orders:export',
  'settings:view',
  'settings:edit',
]

const customRoles = ref<Role[]>([])
const removedKeys = ref<number[]>([])

const roles = computed<Role[]>(() => {
  const presets: Role[] = [
    {
      key: 1,
      name: t('roles.roleNames.admin'),
      code: 'admin',
      description: t('roles.roleDescs.admin'),
      users: 3,
      status: 'active',
      permissions: [...ALL_PERMISSIONS],
    },
    {
      key: 2,
      name: t('roles.roleNames.editor'),
      code: 'editor',
      description: t('roles.roleDescs.editor'),
      users: 12,
      status: 'active',
      permissions: [
        'dashboard:view',
        'analytics:view',
        'users:view',
        'users:create',
        'users:edit',
        'orders:view',
        'orders:export',
      ],
    },
    {
      key: 3,
      name: t('roles.roleNames.viewer'),
      code: 'viewer',
      description: t('roles.roleDescs.viewer'),
      users: 56,
      status: 'active',
      permissions: ['dashboard:view', 'analytics:view', 'users:view', 'orders:view'],
    },
    {
      key: 4,
      name: t('roles.roleNames.support'),
      code: 'support',
      description: t('roles.roleDescs.support'),
      users: 8,
      status: 'disabled',
      permissions: ['dashboard:view', 'orders:view', 'orders:export'],
    },
  ]
  return [...customRoles.value, ...presets.filter((r) => !removedKeys.value.includes(r.key))]
})

const selectedKeys = ref<(string | number | symbol)[]>([1])
const selectedRoleKey = ref<number>(1)
const selectedPermissions = ref<string[]>([])

const selectedRole = computed(
  () => roles.value.find((r) => r.key === selectedRoleKey.value) ?? roles.value[0],
)

watch(
  selectedKeys,
  (keys) => {
    const key = keys[0]
    if (key == null) return
    const role = roles.value.find((r) => r.key === key)
    if (role) {
      selectedRoleKey.value = role.key
      selectedPermissions.value = [...role.permissions]
    }
  },
  { immediate: true },
)

function selectRole(role: Role) {
  selectedKeys.value = [role.key]
}

const permissionGroups = computed(() => [
  {
    module: 'dashboard',
    label: t('nav.dashboard'),
    options: [{ value: 'dashboard:view', label: t('roles.permission.view') }],
  },
  {
    module: 'analytics',
    label: t('nav.analytics'),
    options: [{ value: 'analytics:view', label: t('roles.permission.view') }],
  },
  {
    module: 'users',
    label: t('nav.users'),
    options: [
      { value: 'users:view', label: t('roles.permission.view') },
      { value: 'users:create', label: t('roles.permission.create') },
      { value: 'users:edit', label: t('roles.permission.edit') },
      { value: 'users:delete', label: t('roles.permission.delete') },
    ],
  },
  {
    module: 'orders',
    label: t('nav.orders'),
    options: [
      { value: 'orders:view', label: t('roles.permission.view') },
      { value: 'orders:export', label: t('roles.permission.export') },
    ],
  },
  {
    module: 'settings',
    label: t('nav.settings'),
    options: [
      { value: 'settings:view', label: t('roles.permission.view') },
      { value: 'settings:edit', label: t('roles.permission.edit') },
    ],
  },
])

const totalPermissionCount = computed(() =>
  permissionGroups.value.reduce((sum, g) => sum + g.options.length, 0),
)

const openPermissionGroups = ref<number[]>([0, 1, 2, 3, 4])

function savePermissions() {
  const role = roles.value.find((r) => r.key === selectedRoleKey.value)
  if (role) {
    role.permissions = [...selectedPermissions.value]
    Message.success(t('roles.saved'))
  }
}

const roleColumns = computed(() => [
  { key: 'name', label: t('roles.columns.role'), slotName: 'name', minWidth: 220 },
  { key: 'code', label: t('roles.columns.code'), field: 'code', width: 110 },
  { key: 'users', label: t('roles.columns.users'), field: 'users', width: 90, align: 'center' },
  { key: 'status', label: t('roles.columns.status'), slotName: 'status', width: 100 },
  { key: 'actions', label: t('roles.columns.actions'), slotName: 'actions', width: 150, align: 'center' },
])

function deleteRole(role: Role) {
  if (role.key > 1000) {
    customRoles.value = customRoles.value.filter((r) => r.key !== role.key)
  } else {
    removedKeys.value.push(role.key)
  }
  if (selectedRoleKey.value === role.key) {
    const next = roles.value[0]
    if (next) {
      selectedRoleKey.value = next.key
      selectedPermissions.value = [...next.permissions]
      selectedKeys.value = [next.key]
    }
  }
  Message.success(t('roles.deleted'))
}

const addVisible = ref(false)
const addFormRef = shallowRef<InstanceType<typeof Form> | null>(null)
const newRole = ref({ name: '', code: '', description: '' })

const addRules = computed(() => ({
  name: { required: true, message: t('common.fillRequired') },
  code: { required: true, message: t('common.fillRequired') },
}))

function openAddDialog() {
  newRole.value = { name: '', code: '', description: '' }
  addVisible.value = true
}

async function submitAddRole() {
  const res = await addFormRef.value?.validate()
  if (!res?.isValid) return false
  const role: Role = {
    key: Date.now(),
    name: newRole.value.name,
    code: newRole.value.code,
    description: newRole.value.description || '-',
    users: 0,
    status: 'active',
    permissions: ['dashboard:view', 'analytics:view'],
  }
  customRoles.value.unshift(role)
  selectedRoleKey.value = role.key
  selectedPermissions.value = [...role.permissions]
  selectedKeys.value = [role.key]
  Message.success(t('roles.addRole'))
  return true
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2 class="page-header__title">{{ t('roles.title') }}</h2>
        <p class="page-header__subtitle">{{ t('roles.subtitle') }}</p>
      </div>
      <div class="page-header__actions">
        <px-button theme="primary" @click="openAddDialog">
          <template #icon>
            <IconUserPlus />
          </template>
          {{ t('roles.addRole') }}
        </px-button>
      </div>
    </div>

    <div class="roles-grid">
      <px-card>
        <template #header>
          <span class="card-title">{{ t('roles.roleList') }}</span>
        </template>
        <px-table
          :data="roles"
          :columns="roleColumns"
          row-key="key"
          :selection="{ multiple: false, showSelectAll: false }"
          v-model:selected-keys="selectedKeys"
          variant="striped"
        >
          <template #name="{ record }">
            <div class="role-cell">
              <span class="role-cell__name">{{ record.name }}</span>
              <span class="role-cell__desc">{{ record.description }}</span>
            </div>
          </template>
          <template #status="{ record }">
            <px-tag
              :theme="record.status === 'active' ? 'success' : 'info'"
              size="small"
              shape="round"
            >
              {{ t(`roles.status.${record.status}`) }}
            </px-tag>
          </template>
          <template #actions="{ record }">
            <div class="action-cell">
              <px-button size="small" variant="text" theme="primary" @click="selectRole(record)">
                {{ t('users.edit') }}
              </px-button>
              <px-popconfirm
                :content="t('roles.deleteConfirm')"
                :ok-text="t('common.confirm')"
                :cancel-text="t('common.cancel')"
                @ok="deleteRole(record)"
              >
                <px-button size="small" variant="text" theme="danger">{{ t('users.delete') }}</px-button>
              </px-popconfirm>
            </div>
          </template>
        </px-table>
      </px-card>

      <px-card>
        <template #header>
          <div class="flex-between">
            <span class="card-title">{{ t('roles.permissions') }}</span>
            <px-tag v-if="selectedRole" theme="primary" shape="round">
              {{ selectedRole.name }}
            </px-tag>
          </div>
        </template>

        <px-collapse v-model:active="openPermissionGroups" variant="line">
          <px-collapse-item
            v-for="(group, i) in permissionGroups"
            :key="group.module"
            :index="i"
            :title="group.label"
          >
            <px-checkbox-group v-model="selectedPermissions" :options="group.options" />
          </px-collapse-item>
        </px-collapse>

        <div class="flex-between perm-footer">
          <span class="text-muted">
            {{ selectedPermissions.length }} / {{ totalPermissionCount }} {{ t('roles.selectedCount') }}
          </span>
          <px-button theme="primary" @click="savePermissions">
            <template #icon>
              <IconSave />
            </template>
            {{ t('roles.savePermissions') }}
          </px-button>
        </div>
      </px-card>
    </div>

    <px-dialog
      v-model:visible="addVisible"
      :title="t('roles.addRole')"
      style="width: 480px"
      @before-ok="submitAddRole"
    >
      <px-form :model="newRole" :rules="addRules" ref="addFormRef" poll-size-change>
        <px-form-item :label="t('roles.form.name')" field="name">
          <px-input v-model="newRole.name" :placeholder="t('roles.form.namePlaceholder')" />
        </px-form-item>
        <px-form-item :label="t('roles.form.code')" field="code">
          <px-input v-model="newRole.code" :placeholder="t('roles.form.codePlaceholder')" />
        </px-form-item>
        <px-form-item :label="t('roles.form.description')" field="description">
          <px-textarea
            v-model="newRole.description"
            :rows="2"
            :placeholder="t('roles.form.descriptionPlaceholder')"
          />
        </px-form-item>
      </px-form>
    </px-dialog>
  </div>
</template>

<style scoped>
.card-title {
  font-size: 15px;
  font-weight: 700;
}

.roles-grid {
  display: grid;
  grid-template-columns: minmax(0, 6fr) minmax(0, 4fr);
  gap: 16px;
  align-items: start;
}

@media (max-width: 1100px) {
  .roles-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

.role-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.role-cell__name {
  font-weight: 700;
}

.role-cell__desc {
  font-size: 12px;
  color: var(--px-neutral-8);
}

.action-cell {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
}

.perm-footer {
  margin-top: 8px;
  padding-top: 12px;
  border-top: 2px solid var(--px-neutral-3);
}
</style>


