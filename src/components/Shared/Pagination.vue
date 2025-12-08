<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import PaginationIcon from '@/assets/images/icons/pagination.svg'

  interface PaginationProps {
    currentPage: number
    totalPages: number
  }

  const route = useRoute()
  const router = useRouter()

  const arrowClasses =
    'tn:disabled:bg-tn-black-95 tn:disabled:text-tn-black-500 tn:bg-primary-900 tn:flex tn:h-8 tn:w-8 tn:items-center tn:justify-center tn:rounded tn:text-white tn:disabled:opacity-20 tn:disabled:cursor-not-allowed tn:transition-all tn:duration-200'

  const props = defineProps<PaginationProps>()
  const emit = defineEmits(['pageChange'])

  const pageNumbers = computed(() => {
    const delta = 1
    const range: (number | string)[] = []
    const rangeWithDots: (number | string)[] = []
    const leftBound = Math.max(2, props.currentPage - delta)
    const rightBound = Math.min(props.totalPages - 1, props.currentPage + delta)

    for (let i = 1; i <= props.totalPages; i++) {
      if (i === 1 || i === props.totalPages || (i >= leftBound && i <= rightBound)) {
        range.push(i)
      }
    }

    for (let i = 0; i < range.length; i++) {
      if (i > 0 && Number(range[i]) - Number(range[i - 1]) > 1) {
        rangeWithDots.push('...')
      }
      rangeWithDots.push(range[i])
    }

    return rangeWithDots
  })

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= props.totalPages) {
      const query = { ...route.query }
      if (page > 1) {
        query.page = page.toString()
      } else {
        delete query.page
      }

      router.push({ query })
      emit('pageChange', page)
    }
  }
</script>

<template>
  <div v-if="totalPages > 1" class="tn:my-6 tn:flex tn:items-center tn:justify-center tn:space-x-2">
    <button @click="handlePageChange(currentPage - 1)" :disabled="currentPage === 1" :class="arrowClasses">
      <PaginationIcon class="tn:h-6 tn:w-6 tn:fill-current tn:rtl:rotate-180" />
    </button>

    <template v-for="(page, index) in pageNumbers" :key="index">
      <span
        v-if="page === '...'"
        class="tn:border-tn-black-85 tn:flex tn:h-8 tn:w-8 tn:items-center tn:justify-center tn:rounded tn:border"
      >
        ...
      </span>
      <button
        v-else
        @click="handlePageChange(page as number)"
        class="tn:bg-tn-bg tn:flex tn:h-8 tn:w-8 tn:items-center tn:justify-center tn:rounded tn:border tn:transition-all tn:duration-200"
        :class="{
          'tn:border-primary-900': currentPage === page,
          'tn:border-tn-black-85 tn:hover:border-primary-900': currentPage !== page
        }"
      >
        {{ page }}
      </button>
    </template>

    <button @click="handlePageChange(currentPage + 1)" :disabled="currentPage === totalPages" :class="arrowClasses">
      <PaginationIcon class="tn:h-6 tn:w-6 tn:rotate-180 tn:fill-current tn:rtl:rotate-0" />
    </button>
  </div>
</template>
