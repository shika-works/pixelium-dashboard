<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { Form, Message } from '@pixelium/web-vue'
import { IconSave } from '@pixelium/web-vue/icon-pa/es'

const { t } = useI18n()

const formRef = shallowRef<InstanceType<typeof Form> | null>(null)

const form = ref({
  name: '',
  code: '',
  category: 'digital',
  brand: '',
  tags: [] as string[],
  price: null as number | null,
  originalPrice: null as number | null,
  stock: null as number | null,
  rating: 4,
  color: '#00a891',
  colorOptions: ['black'] as string[],
  featured: 'no',
  listed: true,
  services: ['return'] as string[],
  onShelfDate: null as Date | null,
  publishAt: null as Date | null,
  cutoff: null as Date | null,
  description: '',
})

const rules = computed(() => ({
  name: { required: true, message: t('common.fillRequired') },
  code: { required: true, message: t('common.fillRequired') },
  category: { required: true, message: t('common.fillRequired') },
  price: { required: true, min: 1, message: t('common.fillRequired') },
}))

const categoryOptions = computed(() => [
  { label: t('productForm.categories.digital'), value: 'digital' },
  { label: t('productForm.categories.clothing'), value: 'clothing' },
  { label: t('productForm.categories.food'), value: 'food' },
  { label: t('productForm.categories.home'), value: 'home' },
  { label: t('productForm.categories.beauty'), value: 'beauty' },
])

const brandOptions = ['Apple', 'Samsung', 'Huawei', 'Xiaomi', 'Sony', 'Dell', 'Nike', 'Uniqlo']

const colorOptions = computed(() => [
  { label: t('productForm.colors.black'), value: 'black' },
  { label: t('productForm.colors.white'), value: 'white' },
  { label: t('productForm.colors.red'), value: 'red' },
  { label: t('productForm.colors.blue'), value: 'blue' },
  { label: t('productForm.colors.green'), value: 'green' },
])

const featuredOptions = computed(() => [
  { label: t('productForm.attributes.yes'), value: 'yes' },
  { label: t('productForm.attributes.no'), value: 'no' },
])

const serviceOptions = computed(() => [
  { label: t('productForm.attributes.returnPolicy'), value: 'return' },
  { label: t('productForm.attributes.freeShipping'), value: 'shipping' },
])

async function submit() {
  const res = await formRef.value?.validate()
  if (!res?.isValid) return
  Message.success(t('productForm.saved'))
}

function resetForm() {
  form.value = {
    name: '',
    code: '',
    category: 'digital',
    brand: '',
    tags: [],
    price: null,
    originalPrice: null,
    stock: null,
    rating: 4,
    color: '#00a891',
    colorOptions: ['black'],
    featured: 'no',
    listed: true,
    services: ['return'],
    onShelfDate: null,
    publishAt: null,
    cutoff: null,
    description: '',
  }
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h2 class="page-header__title">{{ t('productForm.title') }}</h2>
        <p class="page-header__subtitle">{{ t('productForm.subtitle') }}</p>
      </div>
      <div class="page-header__actions">
        <px-button theme="info" variant="outline" @click="resetForm">
          {{ t('productForm.reset') }}
        </px-button>
        <px-button theme="primary" @click="submit">
          <template #icon>
            <IconSave />
          </template>
          {{ t('productForm.save') }}
        </px-button>
      </div>
    </div>

    <px-form ref="formRef" :model="form" :rules="rules">
      <div class="form-grid">
        <px-card class="span-2">
          <template #header>
            <span class="card-title">{{ t('productForm.basic.title') }}</span>
          </template>
          <div class="form-fields">
            <px-form-item :label="t('productForm.basic.name')" field="name">
              <px-input v-model="form.name" :placeholder="t('productForm.basic.namePlaceholder')" />
            </px-form-item>
            <px-form-item :label="t('productForm.basic.code')" field="code">
              <px-input v-model="form.code" :placeholder="t('productForm.basic.codePlaceholder')" />
            </px-form-item>
            <px-form-item :label="t('productForm.basic.category')" field="category">
              <px-select v-model="form.category" :options="categoryOptions" />
            </px-form-item>
            <px-form-item :label="t('productForm.basic.brand')" field="brand">
              <px-auto-complete
                v-model="form.brand"
                :options="brandOptions"
                :placeholder="t('productForm.basic.brandPlaceholder')"
              />
            </px-form-item>
            <px-form-item :label="t('productForm.basic.tags')" field="tags" class="span-2">
              <px-input-tag v-model="form.tags" :placeholder="t('productForm.basic.tagsPlaceholder')" />
            </px-form-item>
          </div>
        </px-card>

        <px-card>
          <template #header>
            <span class="card-title">{{ t('productForm.price.title') }}</span>
          </template>
          <div class="form-fields">
            <px-form-item :label="t('productForm.price.price')" field="price">
              <px-input-group>
                <px-input-group-label>￥</px-input-group-label>
                <px-input-number v-model="form.price" :placeholder="t('productForm.price.price')" />
              </px-input-group>
            </px-form-item>
            <px-form-item :label="t('productForm.price.originalPrice')" field="originalPrice">
              <px-input-number
                v-model="form.originalPrice"
                :placeholder="t('productForm.price.originalPrice')"
              />
            </px-form-item>
            <px-form-item :label="t('productForm.price.stock')" field="stock">
              <px-input-number v-model="form.stock" :placeholder="t('productForm.price.stock')" />
            </px-form-item>
            <px-form-item :label="t('productForm.price.recommendation')" field="rating" class="span-2">
              <px-rate v-model="form.rating" />
            </px-form-item>
          </div>
        </px-card>

        <px-card>
          <template #header>
            <span class="card-title">{{ t('productForm.attributes.title') }}</span>
          </template>
          <div class="form-fields">
            <px-form-item :label="t('productForm.attributes.color')" field="color">
              <px-color-picker v-model="form.color" />
            </px-form-item>
            <px-form-item :label="t('productForm.attributes.colors')" field="colorOptions">
              <px-checkbox-group v-model="form.colorOptions" :options="colorOptions" />
            </px-form-item>
            <px-form-item :label="t('productForm.attributes.featured')" field="featured">
              <px-radio-group v-model="form.featured" :options="featuredOptions" variant="retro" />
            </px-form-item>
            <px-form-item :label="t('productForm.attributes.listed')" field="listed">
              <div class="flex-between">
                <span class="text-muted">{{ form.listed ? 'ON' : 'OFF' }}</span>
                <px-switch v-model="form.listed" />
              </div>
            </px-form-item>
            <px-form-item :label="t('productForm.attributes.services')" field="services">
              <px-checkbox-group v-model="form.services" :options="serviceOptions" />
            </px-form-item>
          </div>
        </px-card>

        <px-card class="span-2">
          <template #header>
            <span class="card-title">{{ t('productForm.schedule.title') }}</span>
          </template>
          <div class="form-fields">
            <px-form-item :label="t('productForm.schedule.onShelfDate')" field="onShelfDate">
              <px-date-picker v-model="form.onShelfDate" mode="date" />
            </px-form-item>
            <px-form-item :label="t('productForm.schedule.publishAt')" field="publishAt">
              <px-date-time-picker v-model="form.publishAt" />
            </px-form-item>
            <px-form-item :label="t('productForm.schedule.cutoff')" field="cutoff">
              <px-time-picker v-model="form.cutoff" mode="time" />
              <template #extra>
                {{ t('productForm.schedule.cutoffDesc') }}
              </template>
            </px-form-item>
            <px-form-item :label="t('productForm.schedule.description')" field="description" class="span-2">
              <px-textarea
                v-model="form.description"
                :rows="3"
                :placeholder="t('productForm.schedule.descriptionPlaceholder')"
              />
            </px-form-item>
          </div>
        </px-card>
      </div>
    </px-form>
  </div>
</template>

<style scoped>
.card-title {
  font-size: 15px;
  font-weight: 700;
}

.form-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.span-2 {
  grid-column: span 2;
}

@media (max-width: 1100px) {
  .form-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .span-2 {
    grid-column: span 1;
  }
}

.form-fields {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 2px 16px;
}

.form-fields .span-2 {
  grid-column: span 2;
}

@media (max-width: 700px) {
  .form-fields {
    grid-template-columns: minmax(0, 1fr);
  }

  .form-fields .span-2 {
    grid-column: span 1;
  }
}
</style>

