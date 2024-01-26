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
    // Check for the presence of the authorization code in the URL
    const code = new URLSearchParams(window.location.search).get('code')
    if (code) {
      handleAuthenticationCallback(code)
    }
  },
  methods: {
    signIn() {
      authenticate()
    }
  }
}
</script>
