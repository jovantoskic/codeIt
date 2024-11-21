<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

import { storeToRefs } from 'pinia'
import { useRestaurantStore } from '../stores/restaurantStore'

import { type CriteriaType } from '../types'

import { transformDateToFormat } from '../utils/dateUtils'
import { transformTimeToFormat } from '../utils/timeUtils'

import InputText from 'primevue/inputtext'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'

const criteria = ref<CriteriaType>({
  size: '',
  date: new Date(),
  time: new Date(),
})

const { loginAnonymously, createSearchToken, fetchRestaurants, loadMoreResults } =
  useRestaurantStore()
const { loading, results, loadingMore, loadMoreMessage } = storeToRefs(useRestaurantStore())

const formatedCriteria = (criteria: CriteriaType) => {
  return {
    size: criteria.size,
    date: transformDateToFormat(criteria.date),
    time: transformTimeToFormat(criteria.time),
  }
}

const onSearch = async () => {
  await loginAnonymously()
  await createSearchToken(formatedCriteria(criteria.value))
  await fetchRestaurants()
}

const handleLoadMoreResults = async () => {
  if (loadMoreMessage.value) return

  loadingMore.value = true
  await loadMoreResults()
  loadingMore.value = false
}

const handleScroll = async () => {
  const scrollPosition = window.scrollY + window.innerHeight
  const documentHeight = document.documentElement.scrollHeight

  if (scrollPosition >= documentHeight - 100 && !loading.value) {
    await handleLoadMoreResults()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="search-container">
    <h1>Restaurant Search</h1>
    <div class="filter-container">
      <InputText
        v-model="criteria.size"
        class="filter-input"
        type="number"
        placeholder="Number of guests"
      />
      <DatePicker
        v-model="criteria.date"
        class="filter-input"
        type="date"
        placeholder="Choose Date"
      />
      <DatePicker
        v-model="criteria.time"
        class="filter-input"
        timeOnly
        type="time"
        placeholder="Choose Time"
      />
      <Button @click="onSearch">Search</Button>

      <div class="search-results" v-for="restaurant in results" :key="restaurant.post.slug">
        <h3>{{ restaurant.post.venue_name }}</h3>
        <p>{{ restaurant.availability.formattedRequest.date }}</p>
        <p>{{ restaurant.availability.formattedRequest.time }}</p>
        <p>{{ restaurant.post.availability_search }} seats available</p>
      </div>
    </div>
    <div v-if="loading" class="loading-container">
      <i class="pi pi-spin pi-spinner" />
    </div>

    <div v-if="loadingMore" class="loading-container">
      <i class="pi pi-spin pi-spinner" />
    </div>

    <h3 v-if="loadMoreMessage">{{ loadMoreMessage }}</h3>
  </div>
</template>

<style scoped lang="scss">
.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  .filter-container {
    .filter-input {
      margin-right: 0.5rem;
    }
    .search-results {
      background: #fff;
      padding: 1rem;
      margin-block: 1rem;
      box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    }
  }
  .loading-container {
    margin-top: 1.5rem;
    font-size: 2rem;
  }
}
</style>
