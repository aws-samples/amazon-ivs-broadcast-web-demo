# Amazon IVS Broadcast Web Demo

Repo built on top of [Amazon IVS Broadcast Web Demo](https://github.com/aws-samples/amazon-ivs-broadcast-web-demo)

## Running the demo

Follow these instructions to run the demo:
[In UserSettings.js add INGEST_ENDPOINT and STREAM_KEY and in StreamApp.js add PLAYBACK_URL]
1. Run: `yarn install`
2. Run: `yarn run dev`

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


