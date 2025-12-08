<script lang="ts" setup>
  import Logo from '@/components/Layout/Header/Logo.vue'
  import Sidebar from '@/components/Layout/Sidebar/Index.vue'
  import Balance from '@/components/Layout/Header/Balance.vue'
</script>

<template>
  <header
    class="wide-container tn:bg-tn-bg tn:sticky tn:top-0 tn:z-[10000] tn:flex tn:justify-between tn:pt-3.75 tn:pb-2 tn:sm:py-5.5"
  >
    <Logo />
    <div class="tn:flex tn:items-center tn:gap-5 tn:sm:gap-8">
      <Balance />
      <Sidebar />
    </div>
  </header>
</template>
