# NYU Sports Live

Live streaming platform for NYU sports events built on top of [Amazon IVS Broadcast Web Demo](https://github.com/aws-samples/amazon-ivs-broadcast-web-demo)

## Features

- **Authentication**: User authentication with AWS Cognito
- **Role-based Access**: Separate views for broadcasters and viewers
- **Live Streaming**: Broadcast live sports events using Amazon IVS
- **Viewer Dashboard**: Browse and watch live streams

## Prerequisites

- Node.js and Yarn installed
- AWS Account with:
  - Amazon IVS configured
  - AWS Cognito User Pool created
  - DynamoDB table for channels (IVSChannels)

## AWS Cognito Setup

1. **Create a Cognito User Pool:**
   - Go to AWS Cognito Console
   - Create a new User Pool
   - Enable email as a username or allow email sign-in
   - Set password policy (minimum 8 characters recommended)

2. **Create a Custom Attribute:**
   - In your User Pool settings, go to "Attributes"
   - Add a custom attribute named `userType`
   - Type: String
   - Mutable: Yes
   - Required: No

3. **Create a User Pool App Client:**
   - In your User Pool, go to "App integration" → "App clients"
   - Create a new app client
   - Enable username/password authentication
   - Note down the Client ID

4. **Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_COGNITO_USER_POOL_ID=your-user-pool-id
   NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=your-client-id
   ```

## Installation & Running

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Set up environment variables (see AWS Cognito Setup above)

3. Run the development server:
   ```bash
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## User Roles

- **Viewer**: Can browse and watch live streams
- **Broadcaster**: Can create and broadcast live streams

## Project Structure

- `/pages` - Next.js pages (landing, dashboard, broadcast, stream)
- `/components` - React components including Auth components
- `/providers` - Context providers (Auth, Broadcast, etc.)
- `/lib` - Utility files and Amplify configuration
- `/api` - API routes for channel management

## Notes

- Make sure your DynamoDB table `IVSChannels` exists and has the correct schema
- The custom attribute `userType` must be created in Cognito before users can register
- Users will be redirected based on their role after login:
  - Broadcasters → `/broadcast`
  - Viewers → `/dashboard`

