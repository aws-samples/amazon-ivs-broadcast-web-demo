// Shared AWS configuration for API routes
// WARNING: These credentials should be moved to environment variables for production

export const awsConfig = {
    region: "us-east-1",
    credentials: {
        accessKeyId: "", // TODO: Add your AWS Access Key ID
        secretAccessKey: "" // TODO: Add your AWS Secret Access Key
    }
};
