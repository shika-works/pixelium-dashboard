<script setup lang="ts">
import { computed, defineComponent, h, ref, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { Dialog, Form, Message, Rate, Textarea } from '@pixelium/web-vue'
import type { ValidContent, ValidVNodeContent } from '@pixelium/web-vue'
import {
  IconCalendarPlus,
  IconFlag,
  IconFolderPlus,
  IconMessage,
  IconSave,
  IconUserPlus,
} from '@pixelium/web-vue/icon-pa/es'

const { t } = useI18n()

const addVisible = ref(false)
const customerRef = shallowRef<InstanceType<typeof Form> | null>(null)
const customer = ref({ name: '', email: '', phone: '', level: 'normal' })
const lastCustomer = ref<Record<string, unknown> | null>(null)

const customerRules = computed(() => ({
  name: { required: true, message: t('common.fillRequired') },
  email: { required: true, email: true, message: t('common.fillRequired') },
  phone: { required: true, message: t('common.fillRequired') },
}))

const levelOptions = computed(() => [
  { label: t('dialogs.addCustomer.levelNormal'), value: 'normal' },
  { label: t('dialogs.addCustomer.levelVip'), value: 'vip' },
  { label: t('dialogs.addCustomer.levelSvip'), value: 'svip' },
])

function levelText(value: unknown) {
  return levelOptions.value.find((o) => o.value === value)?.label ?? String(value)
}

function openAddCustomer() {
  customer.value = { name: '', email: '', phone: '', level: 'normal' }
  addVisible.value = true
}

async function submitCustomer() {
  const res = await customerRef.value?.validate()
  if (!res?.isValid) return false
  lastCustomer.value = { ...customer.value }
  Message.success(t('dialogs.addCustomer.added'))
  return true
}

const meetingVisible = ref(false)
const meetingRef = shallowRef<InstanceType<typeof Form> | null>(null)
const meeting = ref({
  title: '',
  date: null as Date | null,
  time: null as Date | null,
  members: [] as string[],
  remind: true,
  note: '',
})
const lastMeeting = ref<Record<string, unknown> | null>(null)

const meetingRules = computed(() => ({
  title: { required: true, message: t('common.fillRequired') },
  date: { required: true, message: t('common.fillRequired') },
  time: { required: true, message: t('common.fillRequired') },
  members: { required: true, message: t('common.fillRequired') },
}))

const memberOptions = [
  { label: 'Emma Wilson', value: 'emma' },
  { label: 'James Chen', value: 'james' },
  { label: 'Olivia Brown', value: 'olivia' },
  { label: 'Michael Garcia', value: 'michael' },
]

function memberText(value: unknown) {
  return memberOptions.find((o) => o.value === value)?.label ?? String(value)
}

function openBookMeeting() {
  meeting.value = { title: '', date: null, time: null, members: [], remind: true, note: '' }
  meetingVisible.value = true
}

async function submitMeeting() {
  const res = await meetingRef.value?.validate()
  if (!res?.isValid) return false
  lastMeeting.value = {
    title: meeting.value.title,
    date: meeting.value.date?.toLocaleDateString() ?? '-',
    time: meeting.value.time?.toTimeString().slice(0, 5) ?? '-',
    members: meeting.value.members.map(memberText).join(', '),
    remind: meeting.value.remind,
    note: meeting.value.note || '-',
  }
  Message.success(t('dialogs.meeting.booked'))
  return true
}

const noticeVisible = ref(false)
const noticeRef = shallowRef<InstanceType<typeof Form> | null>(null)
const notice = ref({ title: '', content: '', pinned: false })
const lastNotice = ref<Record<string, unknown> | null>(null)
const publishing = ref(false)

const noticeRules = computed(() => ({
  title: { required: true, message: t('common.fillRequired') },
  content: { required: true, message: t('common.fillRequired') },
}))

function openNotice() {
  notice.value = { title: '', content: '', pinned: false }
  noticeVisible.value = true
}

async function publishNotice() {
  const res = await noticeRef.value?.validate()
  if (!res?.isValid) return
  publishing.value = true
  await new Promise((resolve) => setTimeout(resolve, 1200))
  publishing.value = false
  lastNotice.value = { ...notice.value }
  noticeVisible.value = false
  Message.success(t('dialogs.notice.published'))
}

const projectVisible = ref(false)
const projectRef = shallowRef<InstanceType<typeof Form> | null>(null)
const project = ref({
  name: '',
  owner: '',
  priority: 'medium',
  tags: [] as string[],
  progress: 40,
  description: '',
})
const lastProject = ref<Record<string, unknown> | null>(null)
const saving = ref(false)

const projectRules = computed(() => ({
  name: { required: true, message: t('common.fillRequired') },
  owner: { required: true, message: t('common.fillRequired') },
}))

const ownerOptions = [
  { label: 'Emma Wilson', value: 'emma' },
  { label: 'James Chen', value: 'james' },
  { label: 'Olivia Brown', value: 'olivia' },
]

const priorityOptions = computed(() => [
  { label: t('dialogs.project.low'), value: 'low' },
  { label: t('dialogs.project.medium'), value: 'medium' },
  { label: t('dialogs.project.high'), value: 'high' },
])

const tagOptions = computed(() => [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Node', value: 'node' },
  { label: 'Design', value: 'design' },
])

function priorityText(value: unknown) {
  return priorityOptions.value.find((o) => o.value === value)?.label ?? String(value)
}

function openProject() {
  project.value = {
    name: '',
    owner: '',
    priority: 'medium',
    tags: [],
    progress: 40,
    description: '',
  }
  projectVisible.value = true
}

async function submitProject() {
  const res = await projectRef.value?.validate()
  if (!res?.isValid) return
  saving.value = true
  await new Promise((resolve) => setTimeout(resolve, 1000))
  saving.value = false
  lastProject.value = {
    name: project.value.name,
    owner: ownerOptions.find((o) => o.value === project.value.owner)?.label ?? '-',
    priority: priorityText(project.value.priority),
    tags: project.value.tags.join(', ') || '-',
    progress: `${project.value.progress}%`,
  }
  projectVisible.value = false
  Message.success(t('dialogs.project.created'))
}

const feedbackRating = ref(5)
const feedbackText = ref('')
const lastFeedback = ref<{ rating: number; text: string } | null>(null)

const FeedbackForm = defineComponent({
  name: 'FeedbackForm',
  setup() {
    return () =>
      h('div', { class: 'feedback-form' }, [
        h('div', { class: 'feedback-form__label' }, t('dialogs.feedback.rating')),
        h(Rate, {
          pollSizeChange: true,
          modelValue: feedbackRating.value,
          'onUpdate:modelValue': (value: number) => (feedbackRating.value = value),
        }),
        h('div', { class: 'feedback-form__label' }, t('dialogs.feedback.text')),
        h(Textarea, {
          pollSizeChange: true,
          modelValue: feedbackText.value,
          'onUpdate:modelValue': (value: string) => (feedbackText.value = value),
          placeholder: t('dialogs.feedback.placeholder'),
          rows: 3,
        }),
      ])
  },
})

function openFeedback() {
  feedbackRating.value = 5
  feedbackText.value = ''
  Dialog.confirm({
    title: t('dialogs.feedback.title'),
    icon: (() => h(IconMessage)) as unknown as ValidVNodeContent,
    content: (() => h(FeedbackForm)) as unknown as ValidContent,
    okText: t('common.confirm'),
    cancelText: t('common.cancel'),
  }).then((confirmed) => {
    if (confirmed) {
      lastFeedback.value = { rating: feedbackRating.value, text: feedbackText.value }
      Message.success(t('dialogs.feedback.sent'))
    }
  })
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2 class="page-header__title">{{ t('dialogs.title') }}</h2>
        <p class="page-header__subtitle">{{ t('dialogs.subtitle') }}</p>
      </div>
    </div>

    <div class="dialogs-grid">
      <px-card>
        <template #header>
          <span class="card-title">{{ t('dialogs.addCustomer.title') }}</span>
        </template>
        <p class="demo-desc">{{ t('dialogs.addCustomer.desc') }}</p>
        <px-button theme="primary" @click="openAddCustomer">
          <template #icon><IconUserPlus /></template>
          {{ t('dialogs.addCustomer.title') }}
        </px-button>
        <div v-if="lastCustomer" class="demo-preview">
          <div class="demo-preview__title">{{ t('dialogs.submitted') }}</div>
          <div class="demo-preview__row">
            <span>{{ t('dialogs.addCustomer.name') }}</span>
            <b>{{ lastCustomer.name }}</b>
          </div>
          <div class="demo-preview__row">
            <span>{{ t('dialogs.addCustomer.email') }}</span>
            <b>{{ lastCustomer.email }}</b>
          </div>
          <div class="demo-preview__row">
            <span>{{ t('dialogs.addCustomer.levelLabel') }}</span>
            <b>{{ levelText(lastCustomer.level) }}</b>
          </div>
        </div>
      </px-card>

      <px-card>
        <template #header>
          <span class="card-title">{{ t('dialogs.meeting.title') }}</span>
        </template>
        <p class="demo-desc">{{ t('dialogs.meeting.desc') }}</p>
        <px-button theme="notice" @click="openBookMeeting">
          <template #icon><IconCalendarPlus /></template>
          {{ t('dialogs.meeting.title') }}
        </px-button>
        <div v-if="lastMeeting" class="demo-preview">
          <div class="demo-preview__title">{{ t('dialogs.submitted') }}</div>
          <div class="demo-preview__row">
            <span>{{ t('dialogs.meeting.titleLabel') }}</span>
            <b>{{ lastMeeting.title }}</b>
          </div>
          <div class="demo-preview__row">
            <span>{{ t('dialogs.meeting.date') }} / {{ t('dialogs.meeting.time') }}</span>
            <b>{{ lastMeeting.date }} {{ lastMeeting.time }}</b>
          </div>
          <div class="demo-preview__row">
            <span>{{ t('dialogs.meeting.members') }}</span>
            <b>{{ lastMeeting.members }}</b>
          </div>
        </div>
      </px-card>

      <px-card>
        <template #header>
          <span class="card-title">{{ t('dialogs.notice.title') }}</span>
        </template>
        <p class="demo-desc">{{ t('dialogs.notice.desc') }}</p>
        <px-button theme="warning" @click="openNotice">
          <template #icon><IconFlag /></template>
          {{ t('dialogs.notice.title') }}
        </px-button>
        <div v-if="lastNotice" class="demo-preview">
          <div class="demo-preview__title">{{ t('dialogs.submitted') }}</div>
          <div class="demo-preview__row">
            <span>{{ t('dialogs.notice.titleLabel') }}</span>
            <b>{{ lastNotice.title }}</b>
          </div>
          <div class="demo-preview__row">
            <span>{{ t('dialogs.notice.pinned') }}</span>
            <b>{{ lastNotice.pinned ? 'ON' : 'OFF' }}</b>
          </div>
        </div>
      </px-card>

      <px-card>
        <template #header>
          <span class="card-title">{{ t('dialogs.project.title') }}</span>
        </template>
        <p class="demo-desc">{{ t('dialogs.project.desc') }}</p>
        <px-button theme="sakura" @click="openProject">
          <template #icon><IconFolderPlus /></template>
          {{ t('dialogs.project.title') }}
        </px-button>
        <div v-if="lastProject" class="demo-preview">
          <div class="demo-preview__title">{{ t('dialogs.submitted') }}</div>
          <div class="demo-preview__row">
            <span>{{ t('dialogs.project.name') }}</span>
            <b>{{ lastProject.name }}</b>
          </div>
          <div class="demo-preview__row">
            <span>{{ t('dialogs.project.owner') }} / {{ t('dialogs.project.priority') }}</span>
            <b>{{ lastProject.owner }} · {{ lastProject.priority }}</b>
          </div>
          <div class="demo-preview__row">
            <span>{{ t('dialogs.project.progress') }}</span>
            <b>{{ lastProject.progress }}</b>
          </div>
        </div>
      </px-card>

      <px-card class="span-2">
        <template #header>
          <span class="card-title">{{ t('dialogs.feedback.title') }}</span>
        </template>
        <p class="demo-desc">{{ t('dialogs.feedback.desc') }}</p>
        <px-button theme="primary" variant="outline" @click="openFeedback">
          <template #icon><IconMessage /></template>
          {{ t('dialogs.feedback.title') }}
        </px-button>
        <div v-if="lastFeedback" class="demo-preview">
          <div class="demo-preview__title">{{ t('dialogs.submitted') }}</div>
          <div class="demo-preview__row">
            <span>{{ t('dialogs.feedback.rating') }}</span>
            <b>{{ lastFeedback.rating }} / 5</b>
          </div>
          <div class="demo-preview__row">
            <span>{{ t('dialogs.feedback.text') }}</span>
            <b>{{ lastFeedback.text || '-' }}</b>
          </div>
        </div>
      </px-card>
    </div>

    <px-dialog
      v-model:visible="addVisible"
      :title="t('dialogs.addCustomer.title')"
      :ok-text="t('common.confirm')"
      :cancel-text="t('common.cancel')"
      style="width: 440px"
      @before-ok="submitCustomer"
    >
      <px-form :model="customer" :rules="customerRules" ref="customerRef" poll-size-change>
        <px-form-item :label="t('dialogs.addCustomer.name')" field="name">
          <px-input v-model="customer.name" :placeholder="t('dialogs.addCustomer.namePlaceholder')" />
        </px-form-item>
        <px-form-item :label="t('dialogs.addCustomer.email')" field="email">
          <px-input v-model="customer.email" :placeholder="t('dialogs.addCustomer.emailPlaceholder')" />
        </px-form-item>
        <px-form-item :label="t('dialogs.addCustomer.phone')" field="phone">
          <px-input v-model="customer.phone" :placeholder="t('dialogs.addCustomer.phonePlaceholder')" />
        </px-form-item>
        <px-form-item :label="t('dialogs.addCustomer.levelLabel')" field="level">
          <px-select v-model="customer.level" :options="levelOptions" />
        </px-form-item>
      </px-form>
    </px-dialog>

    <px-dialog
      v-model:visible="meetingVisible"
      :title="t('dialogs.meeting.title')"
      :ok-text="t('common.confirm')"
      :cancel-text="t('common.cancel')"
      style="width: 460px"
      @before-ok="submitMeeting"
    >
      <px-form :model="meeting" :rules="meetingRules" ref="meetingRef" poll-size-change>
        <px-form-item :label="t('dialogs.meeting.titleLabel')" field="title">
          <px-input v-model="meeting.title" :placeholder="t('dialogs.meeting.titlePlaceholder')" />
        </px-form-item>
        <px-form-item :label="t('dialogs.meeting.date')" field="date">
          <px-date-picker v-model="meeting.date" mode="date" />
        </px-form-item>
        <px-form-item :label="t('dialogs.meeting.time')" field="time">
          <px-time-picker v-model="meeting.time" mode="time" />
        </px-form-item>
        <px-form-item :label="t('dialogs.meeting.members')" field="members">
          <px-select v-model="meeting.members" :options="memberOptions" multiple />
        </px-form-item>
        <px-form-item :label="t('dialogs.meeting.remind')" field="remind">
          <div class="flex-between">
            <span class="text-muted">{{ meeting.remind ? 'ON' : 'OFF' }}</span>
            <px-switch v-model="meeting.remind" />
          </div>
        </px-form-item>
        <px-form-item :label="t('dialogs.meeting.note')" field="note">
          <px-textarea v-model="meeting.note" :rows="2" :placeholder="t('dialogs.meeting.notePlaceholder')" />
        </px-form-item>
      </px-form>
    </px-dialog>

    <px-dialog
      v-model:visible="noticeVisible"
      :title="t('dialogs.notice.title')"
      style="width: 460px"
    >
      <px-form :model="notice" :rules="noticeRules" ref="noticeRef" poll-size-change>
        <px-form-item :label="t('dialogs.notice.titleLabel')" field="title">
          <px-input v-model="notice.title" :placeholder="t('dialogs.notice.titlePlaceholder')" />
        </px-form-item>
        <px-form-item :label="t('dialogs.notice.content')" field="content">
          <px-textarea
            v-model="notice.content"
            :rows="4"
            :placeholder="t('dialogs.notice.contentPlaceholder')"
          />
        </px-form-item>
        <px-form-item :label="t('dialogs.notice.pinned')" field="pinned">
          <div class="flex-between">
            <span class="text-muted">{{ notice.pinned ? 'ON' : 'OFF' }}</span>
            <px-switch v-model="notice.pinned" />
          </div>
        </px-form-item>
      </px-form>
      <template #footer>
        <px-button variant="text" theme="info" @click="noticeVisible = false">
          {{ t('common.cancel') }}
        </px-button>
        <px-button theme="primary" :loading="publishing" poll-size-change @click="publishNotice">
          <template #icon><IconSave /></template>
          {{ t('dialogs.notice.publish') }}
        </px-button>
      </template>
    </px-dialog>

    <px-drawer
      v-model:visible="projectVisible"
      :title="t('dialogs.project.title')"
      placement="right"
      show-footer
      style="width: 520px"
    >
      <px-form :model="project" :rules="projectRules" ref="projectRef">
        <px-form-item :label="t('dialogs.project.name')" field="name">
          <px-input v-model="project.name" :placeholder="t('dialogs.project.namePlaceholder')" />
        </px-form-item>
        <px-form-item :label="t('dialogs.project.owner')" field="owner">
          <px-select v-model="project.owner" :options="ownerOptions" />
        </px-form-item>
        <px-form-item :label="t('dialogs.project.priority')" field="priority">
          <px-radio-group v-model="project.priority" :options="priorityOptions" variant="retro" />
        </px-form-item>
        <px-form-item :label="t('dialogs.project.tags')" field="tags">
          <px-checkbox-group v-model="project.tags" :options="tagOptions" />
        </px-form-item>
        <px-form-item :label="t('dialogs.project.progress')" field="progress">
          <div class="progress-row">
            <px-slider v-model="project.progress" class="progress-slider" />
            <span class="text-muted">{{ project.progress }}%</span>
          </div>
        </px-form-item>
        <px-form-item :label="t('dialogs.project.description')" field="description">
          <px-textarea
            v-model="project.description"
            :rows="3"
            :placeholder="t('dialogs.project.descriptionPlaceholder')"
          />
        </px-form-item>
      </px-form>
      <template #footer>
        <px-button variant="text" theme="info" @click="projectVisible = false">
          {{ t('common.cancel') }}
        </px-button>
        <px-button theme="primary" :loading="saving" @click="submitProject">
          <template #icon><IconFolderPlus /></template>
          {{ t('dialogs.project.save') }}
        </px-button>
      </template>
    </px-drawer>
  </div>
</template>

<style scoped>
.card-title {
  font-size: 15px;
  font-weight: 700;
}

.dialogs-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.dialogs-grid > .span-2 {
  grid-column: span 2;
}

.demo-desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--px-neutral-8);
  margin-bottom: 4px;
}

.demo-preview {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 2px solid var(--px-neutral-3);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.demo-preview__title {
  font-size: 12px;
  color: var(--px-neutral-8);
}

.demo-preview__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  font-size: 13px;
}

.demo-preview__row span {
  flex-shrink: 0;
  color: var(--px-neutral-8);
}

.demo-preview__row b {
  font-weight: 700;
  text-align: right;
  word-break: break-all;
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%
}

.progress-slider {
  flex: 1;
}

@media (max-width: 1100px) {
  .dialogs-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .dialogs-grid > .span-2 {
    grid-column: span 1;
  }
}
</style>

<style>
.feedback-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feedback-form__label {
  font-size: 13px;
  color: var(--px-neutral-8);
}
</style>

