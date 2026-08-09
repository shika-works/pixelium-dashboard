<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { Form, Message } from '@pixelium/web-vue'
import {
  IconNotification,
  IconSave,
  IconShield,
  IconSliders,
  IconUser,
} from '@pixelium/web-vue/icon-pa/es'

import { useAppTheme } from '@/composables/useAppTheme'

const { t } = useI18n()
const { themeMode, setTheme } = useAppTheme()

const activeTab = ref('profile')

function onThemeChange(value: unknown) {
  if (value === 'light' || value === 'dark') setTheme(value)
}

const profileRef = shallowRef<InstanceType<typeof Form> | null>(null)
const profile = ref({
  name: 'Admin',
  email: 'admin@pixelium.dev',
  bio: '',
})

const profileRules = computed(() => ({
  name: { required: true, message: t('common.fillRequired') },
  email: { required: true, email: true, message: t('common.fillRequired') },
}))

const securityRef = shallowRef<InstanceType<typeof Form> | null>(null)
const security = ref({
  password: '',
  confirm: '',
  twoFactor: true,
})

const securityRules = computed(() => ({
  password: { minLength: 6, message: t('settings.security.password') },
  confirm: {
    validator: (value: string) =>
      value !== security.value.password ? t('settings.security.confirmPassword') : undefined,
  },
}))

const notifications = ref({
  emailNotif: true,
  pushNotif: false,
  weeklyDigest: true,
})

const notificationToggles = computed(() => [
  {
    key: 'emailNotif' as const,
    label: t('settings.notifications.emailNotif'),
    desc: t('settings.notifications.emailNotifDesc'),
  },
  {
    key: 'pushNotif' as const,
    label: t('settings.notifications.pushNotif'),
    desc: t('settings.notifications.pushNotifDesc'),
  },
  {
    key: 'weeklyDigest' as const,
    label: t('settings.notifications.weeklyDigest'),
    desc: t('settings.notifications.weeklyDigestDesc'),
  },
])

const themeOptions = computed(() => [
  { label: t('settings.appearance.light'), value: 'light' },
  { label: t('settings.appearance.dark'), value: 'dark' },
])

async function saveSettings() {
  const mountedForms = [profileRef.value, securityRef.value].filter(
    (r): r is InstanceType<typeof Form> => r != null,
  )
  const results = await Promise.all(mountedForms.map((r) => r.validate()))
  if (!results.every((r) => r.isValid)) return
  Message.success(t('settings.saved'))
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2 class="page-header__title">{{ t('settings.title') }}</h2>
        <p class="page-header__subtitle">{{ t('settings.subtitle') }}</p>
      </div>
      <div class="page-header__actions">
        <px-button theme="primary" @click="saveSettings">
          <template #icon>
            <IconSave />
          </template>
          {{ t('settings.save') }}
        </px-button>
      </div>
    </div>

    <px-tab v-model:active="activeTab">
      <px-tab-panel index="profile" :title="t('settings.profile.title')">
        <template #icon>
          <IconUser />
        </template>
        <px-card>
          <px-form ref="profileRef" :model="profile" :rules="profileRules">
            <px-form-item :label="t('settings.profile.name')" field="name">
              <px-input v-model="profile.name" :placeholder="t('settings.profile.namePlaceholder')" />
            </px-form-item>
            <px-form-item :label="t('settings.profile.email')" field="email">
              <px-input v-model="profile.email" :placeholder="t('settings.profile.emailPlaceholder')" />
            </px-form-item>
            <px-form-item :label="t('settings.profile.bio')" field="bio">
              <px-textarea
                v-model="profile.bio"
                :rows="3"
                :placeholder="t('settings.profile.bioPlaceholder')"
              />
            </px-form-item>
          </px-form>
        </px-card>
      </px-tab-panel>

      <px-tab-panel index="security" :title="t('settings.security.title')">
        <template #icon>
          <IconShield />
        </template>
        <px-card>
          <px-form ref="securityRef" :model="security" :rules="securityRules">
            <px-form-item :label="t('settings.security.password')" field="password">
              <px-input
                v-model="security.password"
                password
                :placeholder="t('settings.security.passwordPlaceholder')"
              />
            </px-form-item>
            <px-form-item :label="t('settings.security.confirmPassword')" field="confirm">
              <px-input
                v-model="security.confirm"
                password
                :placeholder="t('settings.security.confirmPlaceholder')"
              />
            </px-form-item>
            <px-form-item :label="t('settings.security.twoFactor')" field="twoFactor">
              <div class="flex-between toggle-line">
                <span class="text-muted">{{ t('settings.security.twoFactorDesc') }}</span>
                <px-switch v-model="security.twoFactor" />
              </div>
            </px-form-item>
          </px-form>
        </px-card>
      </px-tab-panel>

      <px-tab-panel index="notifications" :title="t('settings.notifications.title')">
        <template #icon>
          <IconNotification />
        </template>
        <px-card>
          <div class="toggle-list">
            <div v-for="item in notificationToggles" :key="item.key" class="toggle-row">
              <div class="toggle-text">
                <div>{{ item.label }}</div>
                <div class="text-muted toggle-desc">{{ item.desc }}</div>
              </div>
              <px-switch v-model="notifications[item.key]" />
            </div>
          </div>
        </px-card>
      </px-tab-panel>

      <px-tab-panel index="appearance" :title="t('settings.appearance.title')">
        <template #icon>
          <IconSliders />
        </template>
        <px-card>
          <div class="appearance-row">
            <span>{{ t('settings.appearance.themeMode') }}</span>
            <px-radio-group
              :model-value="themeMode"
              :options="themeOptions"
              variant="retro"
              @update:model-value="onThemeChange"
            />
          </div>
        </px-card>
      </px-tab-panel>
    </px-tab>
  </div>
</template>

<style scoped>
.toggle-line {
  width: 100%;
}

.toggle-list {
  display: flex;
  flex-direction: column;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px dashed var(--px-neutral-6);
}

.toggle-row:last-child {
  border-bottom: none;
}

.toggle-text {
  min-width: 0;
}

.toggle-desc {
  font-size: 12px;
  margin-top: 2px;
}

.appearance-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
</style>

