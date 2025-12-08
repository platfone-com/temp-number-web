<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRoute } from 'vue-router'

  interface Tab {
    id: string
    label: string
    link?: string
  }

  defineProps<{ tabs: Tab[] }>()
  const route = useRoute()
  const activeTab = ref(route.name)

  watch(
    () => route.name,
    (newName) => {
      activeTab.value = newName
    }
  )
</script>

<template>
  <div class="tn:bg-tn-tab-bg tn:mb-4 tn:flex tn:w-full tn:rounded-xl tn:p-1 tn:lg:mb-6">
    <component
      :is="tab.link ? 'a' : 'router-link'"
      v-for="tab in tabs"
      :key="tab.id"
      :href="tab.link ? tab.link : undefined"
      :to="!tab.link ? { name: tab.id } : undefined"
      class="tn:tracking-tightest tn:flex tn:w-1/2 tn:items-center tn:justify-center tn:px-3 tn:py-2 tn:text-center tn:text-xs tn:leading-[120%] tn:font-medium tn:transition-all tn:duration-200"
      :class="{
        'tn:bg-tn-bg tn:rounded-xl tn:shadow': activeTab === tab.id,
        'tn:cursor-pointer tn:opacity-40 tn:hover:opacity-60': activeTab !== tab.id
      }"
    >
      {{ tab.label }}
    </component>
  </div>
</template>
