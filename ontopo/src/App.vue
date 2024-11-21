<script setup lang="ts">
import { onMounted } from 'vue'

import { RouterView, useRouter } from 'vue-router'
import { useRestaurantStore } from './stores/restaurantStore'

import 'primeicons/primeicons.css'

const { jwtToken } = useRestaurantStore()

const router = useRouter()

onMounted(() => {
  //token se gubi kada radim refresh, vidi sta ces sa ovim i kako...
  // if (!jwtToken.value) {
  //   router.push('/')
  // }
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
