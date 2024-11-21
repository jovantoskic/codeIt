<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useRestaurantStore } from '../stores/restaurantStore'

import Button from 'primevue/button'

const router = useRouter()
const loading = ref(false)

const loginAnonymously = async () => {
  loading.value = true
  try {
    const restaurantStore = useRestaurantStore()
    await restaurantStore.loginAnonymously()
    router.push('/search')
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="text-center">Login to Ontopo</h2>
      <div class="field">
        <Button
          id="login-btn"
          label="Login Anonymously"
          icon="pi pi-sign-in"
          class="w-full p-button-primary"
          :loading="loading"
          :disabled="loading"
          @click="loginAnonymously"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f4f4f9;
  .login-card {
    width: 400px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    padding: 30px;
    text-align: center;
    h2 {
      margin-bottom: 20px;
    }
    .field {
      margin-bottom: 15px;
      .w-full {
        width: 100%;
      }
    }
  }
}
</style>
