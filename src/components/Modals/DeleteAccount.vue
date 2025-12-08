<script lang="ts" setup>
  import { ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useModalStore } from '@/stores/modal'
  import { useUser } from '@/composables/api/useUser'
  import useSharedCss from '@/composables/useSharedCss'
  import Modal from '@/components/Shared/Modal.vue'
  import Button from '@/components/Shared/Button.vue'

  const { deleteCustomer } = useUser()
  const { adaptiveModalWrapperClasses, adaptiveModalHeaderClasses, adaptiveModalSubheaderClasses } = useSharedCss()

  const { deleteAccountModal } = storeToRefs(useModalStore())
  const loading = ref(false)

  const emit = defineEmits(['closeSidebar'])

  const deleteAccount = async () => {
    loading.value = true
    await deleteCustomer()
    loading.value = false
    emit('closeSidebar')
  }
</script>

<template>
  <Modal v-model="deleteAccountModal" :persistent="true">
    <div :class="adaptiveModalWrapperClasses()">
      <div>
        <div :class="adaptiveModalHeaderClasses()">{{ $t('notifications_are_you_sure') }}</div>
        <div :class="adaptiveModalSubheaderClasses()">
          {{
            $t('notifications_after_confirmation_all_your_account_data_will_be_permanently_deleted_and_lost_forever')
          }}
        </div>
      </div>

      <div class="tn:flex tn:w-full tn:flex-col tn:gap-2 tn:lg:flex-row">
        <Button
          @click="deleteAccount"
          fill
          block
          :loading="loading"
          class="tn:bg-tn-red-500 tn:hover:bg-tn-red-600 tn:active:bg-tn-red-700 tn:border-tn-red-500 tn:hover:border-tn-red-600 tn:active:border-tn-red-700"
        >
          {{ $t('notifications_delete_account') }}
        </Button>
        <Button @click="deleteAccountModal = false" block :disabled="loading" fill color="secondary">
          {{ $t('notifications_cancel') }}
        </Button>
      </div>
    </div>
  </Modal>
</template>
