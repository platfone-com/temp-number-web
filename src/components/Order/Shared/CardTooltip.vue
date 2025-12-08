<template>
  <div
    class="tn:bg-primary-900 tn:absolute tn:top-41.25 tn:z-[9999] tn:hidden tn:transform tn:items-center tn:rounded-lg tn:px-2.5 tn:pt-1 tn:pb-1.5 tn:text-center tn:leading-4.5 tn:font-medium tn:whitespace-nowrap tn:text-white tn:lg:flex tn:ltr:left-full tn:ltr:ml-2.5 tn:rtl:right-full tn:rtl:mr-2.5"
  >
    <div
      class="tooltip-arrow tn:border-primary-900 tn:absolute tn:top-1/2 tn:-translate-y-1/2 tn:transform tn:ltr:right-full tn:ltr:border-r-8 tn:rtl:left-full tn:rtl:border-l-8"
    />
    <slot />
  </div>
</template>

<style scoped>
  .tooltip-arrow {
    width: 0;
    height: 0;
    border-top-width: 6px;
    border-bottom-width: 6px;
    border-top-color: transparent;
    border-bottom-color: transparent;
  }
</style>
