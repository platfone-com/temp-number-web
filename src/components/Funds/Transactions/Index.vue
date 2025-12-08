<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useFunds } from '@/composables/api/useFunds'
  import type { ITransaction } from '@/types/api/funds'
  import OrderSkeleton from '@/components/Shared/Skeletons/OrderSkeleton.vue'
  import Pagination from '@/components/Shared/Pagination.vue'
  import EmptyScreen from '@/components/Funds/Transactions/EmptyScreen.vue'
  import TransactionsData from '@/components/Funds/Transactions/Data.vue'

  const route = useRoute()
  const { getTransactions } = useFunds()

  const loading = ref(true)
  const page = ref(1)
  const pages = ref(1)
  const transactions = ref<ITransaction[]>([])

  const loadTransactions = async () => {
    loading.value = true
    const transactionsData = await getTransactions(page.value)
    loading.value = false
    if (transactionsData) {
      transactions.value = transactionsData.transactions
      pages.value = transactionsData.pages
    }
  }

  const openPage = (newPage: number) => {
    page.value = newPage
    loadTransactions()
  }

  onMounted(() => {
    page.value = Number(route.query.page) || 1
    loadTransactions()
  })
</script>

<template>
  <Transition name="fade" mode="out-in">
    <OrderSkeleton v-if="loading" :with-padding="false" :show-top-block="false" />
    <div v-else class="tn:mx-auto">
      <EmptyScreen v-if="transactions.length === 0" />
      <div v-else>
        <div class="tn:flex tn:flex-col tn:gap-4">
          <TransactionsData :transactions="transactions" />
        </div>
        <Pagination :current-page="page" :total-pages="pages" @pageChange="openPage" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
  @import '@/assets/css/transitions/fade.css';
</style>
