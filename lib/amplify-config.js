// lib/amplify-config.js
import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
    },
  },
};

// Configure Amplify (safe to call multiple times)
try {
  Amplify.configure(amplifyConfig);
} catch (error) {
  console.warn('Amplify configuration error:', error);
}

export default amplifyConfig;
