import axios from 'axios'

const OAuthConfig = {
  // Replace these values with your OAuth provider's configuration
  clientId: import.meta.env.VITE_OAUTH_CLIENT_ID,
  clientSecret: import.meta.env.VITE_OAUTH_CLIENT_SECRET,
  redirectUri: import.meta.env.VITE_OAUTH_REDIRECT_URI,
  authorizationEndpoint: 'https://www.worldcubeassociation.org/oauth/authorize',
  tokenEndpoint: 'https://www.worldcubeassociation.org/oauth/token'
}

export const authenticate = async () => {
  try {
    // Construct the authorization URL
    const authorizationUrl = `${OAuthConfig.authorizationEndpoint}?client_id=${OAuthConfig.clientId}&redirect_uri=${OAuthConfig.redirectUri}&response_type=code`

    // Redirect the user to the authorization URL
    window.location.href = authorizationUrl
  } catch (error) {
    console.error('Authentication error:', error)
  }
}

export const handleAuthenticationCallback = async (code) => {
  try {
    // Exchange the authorization code for an access token
    const response = await axios.post(
      OAuthConfig.tokenEndpoint,
      {
        client_id: OAuthConfig.clientId,
        client_secret: OAuthConfig.clientSecret,
        redirect_uri: OAuthConfig.redirectUri,
        code,
        grant_type: 'authorization_code'
      },
      {
        // Add the mode: 'cors' option to handle CORS
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

    const accessToken = response.data.access_token

    // Use the access token as needed (e.g., store it in Vuex, make API requests)
    if (accessToken) {
      console.log('Access token:', accessToken)
      // You may want to store the token in a global state (e.g., Vuex) or use it for API requests
    } else {
      console.error('Authentication failed')
    }
  } catch (error) {
    console.error('Authentication callback error:', error)
  }
}
