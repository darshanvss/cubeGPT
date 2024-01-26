// LoginView.vue
<template>
  <main>
    <h1 class="">Login Page</h1>
    <button type="button" class="btn btn-outline-primary" @click="signIn">Login</button>
  </main>
</template>

<script>
import { authenticate, handleAuthenticationCallback } from '@/api/auth'

export default {
  name: 'LoginView',
  data() {
    return {
      userName: ''
    }
  },
  mounted() {
    // Check for the presence of the access token in the URL
    const queryParams = new URLSearchParams(window.location.hash.substring(1))

    // Check if access_token exists in the URL
    if (queryParams.has('access_token')) {
      // Extract the necessary data
      const accessToken = queryParams.get('access_token')
      const tokenType = queryParams.get('token_type')
      const expiresIn = queryParams.get('expires_in')

      // Store the data in local storage
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('token_type', tokenType)
      localStorage.setItem('expires_in', expiresIn)

      // Clear the URL to keep it clean
      window.history.replaceState({}, document.title, window.location.pathname)

      // Handle authentication callback or perform any other necessary actions
      handleAuthenticationCallback()
    } else {
      console.log('no params')
    }
  },

  methods: {
    signIn() {
      authenticate()
    }
  }
}
</script>
