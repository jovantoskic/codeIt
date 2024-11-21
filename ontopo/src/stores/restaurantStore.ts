import { ref } from 'vue'

import { defineStore } from 'pinia'
import axios from 'axios'

import { type CriteriaType } from '../types'

const jwtToken = ref('')
const searchId = ref('')
const results = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const loadMoreMessage = ref('')
const totalResults = ref(0)

export const useRestaurantStore = defineStore('restaurant', () => {
  const loginAnonymously = async () => {
    try {
      const response = await axios.post('https://site.ontopo.work/api/loginAnonymously')
      jwtToken.value = response.data.jwt_token
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const createSearchToken = async (criteria: CriteriaType) => {
    try {
      const response = await axios.post(
        'https://site.ontopo.work/api/search_token',
        {
          marketplace_id: '15380287',
          criteria,
          locale: 'en',
          geocodes: ['belgrade'],
        },
        {
          headers: {
            token: jwtToken.value,
          },
        },
      )
      searchId.value = response.data.search_id
    } catch (error) {
      console.error('Search token creation failed:', error)
    }
  }

  const fetchRestaurants = async () => {
    try {
      loading.value = true
      const response = await axios.post(
        'https://site.ontopo.work/api/search_request',
        {
          search_id: searchId.value,
        },
        {
          headers: { token: jwtToken.value },
        },
      )
      results.value = response.data.posts
      totalResults.value = response.data.total

      loading.value = false
    } catch (error) {
      console.error('Failed to fetch restaurants:', error)
      loading.value = false
    }
  }

  const loadMoreResults = async () => {
    if (results.value.length >= totalResults.value) {
      loadMoreMessage.value = 'All results have been loaded.'
      return
    }
    try {
      loadingMore.value = true
      const response = await axios.post(
        'https://site.ontopo.work/api/search_request',
        {
          search_id: searchId.value,
        },
        {
          headers: { token: jwtToken.value },
        },
      )
      const newPosts = response.data.posts
      results.value.push(...newPosts)

      totalResults.value = response.data.total
      loadingMore.value = false
    } catch (error) {
      console.error('Failed to load more results:', error)
      loadingMore.value = false
    }
  }

  return {
    loginAnonymously,
    createSearchToken,
    fetchRestaurants,
    loadMoreResults,
    jwtToken,
    searchId,
    results,
    loading,
    loadingMore,
    totalResults,
    loadMoreMessage,
  }
})
