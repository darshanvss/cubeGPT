import axios from 'axios'
import router from '@/router'

const OAuthConfig = {
  // Replace these values with your OAuth provider's configuration
  clientId: import.meta.env.VITE_OAUTH_CLIENT_ID,
  clientSecret: import.meta.env.VITE_OAUTH_CLIENT_SECRET,
  redirectUri: import.meta.env.VITE_OAUTH_REDIRECT_URI,
  authorizationEndpoint: 'https://www.worldcubeassociation.org/oauth/authorize',
  tokenEndpoint: 'https://www.worldcubeassociation.org/oauth/token',
  userProfileEndPoint: 'https://www.worldcubeassociation.org/api/v0/me',
  statsEndpoint: 'https://statistics-api.worldcubeassociation.org/database/query'
}

export const authenticate = async () => {
  try {
    // Construct the authorization URL
    const authorizationUrl = `${OAuthConfig.authorizationEndpoint}?client_id=${OAuthConfig.clientId}&redirect_uri=${OAuthConfig.redirectUri}&response_type=token`

    // Redirect the user to the authorization URL
    window.location.href = authorizationUrl
  } catch (error) {
    console.error('Authentication error:', error)
  }
}

export const handleAuthenticationCallback = async () => {
  // Retrieve values from local storage
  const accessToken = localStorage.getItem('access_token')
  const tokenType = localStorage.getItem('token_type')
  const expiresIn = localStorage.getItem('expires_in')

  // Log the retrieved values
  console.log('Retrieved Access Token:', accessToken)
  console.log('Retrieved Token Type:', tokenType)
  console.log('Retrieved Expires In:', expiresIn)

  // Make an Axios call to the user profile endpoint using the access token
  axios
    .get(OAuthConfig.userProfileEndPoint, {
      headers: {
        Authorization: `${tokenType} ${accessToken}`
      }
    })
    .then((response) => {
      // Log the response from the user profile endpoint
      console.log('User Profile Response:', response.data)
      router.push({ name: 'chat' })
    })
    .catch((error) => {
      console.error('Error fetching user profile:', error)
    })
}
