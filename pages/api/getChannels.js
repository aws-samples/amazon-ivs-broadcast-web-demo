import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { IvsClient, GetStreamCommand } from "@aws-sdk/client-ivs";
import { awsConfig } from "./aws-config";

// Helper function to check if a stream is live
async function isStreamLive(channelArn, ivsClient) {
    try {
        const command = new GetStreamCommand({ channelArn });
        const response = await ivsClient.send(command);
        return response.stream?.state === 'LIVE';
    } catch (error) {
        // Stream doesn't exist or is offline
        if (error.name === 'ResourceNotFoundException' || error.name === 'StreamNotAvailable') {
            return false;
        }
        // For other errors, assume not live
        console.error(`Error checking stream status for ${channelArn}:`, error.message);
        return false;
    }
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const ddbClient = new DynamoDBClient(awsConfig);
        const docClient = DynamoDBDocumentClient.from(ddbClient);
        const ivsClient = new IvsClient(awsConfig);

        const command = new ScanCommand({
            TableName: "IVSChannels"
        });

        const response = await docClient.send(command);
        const items = response.Items || [];

        // Check stream status for each channel in parallel and filter out ended streams
        const streamStatusChecks = items
            .filter(channel => channel.arn)
            .map(async (channel) => {
                const isLive = await isStreamLive(channel.arn, ivsClient);
                return { channel, isLive };
            });

        const results = await Promise.all(streamStatusChecks);
        const liveChannels = results
            .filter(({ isLive }) => isLive)
            .map(({ channel }) => ({
                ...channel,
                isLive: true
            }));

        // Sort by creation date descending (newest first)
        liveChannels.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        res.status(200).json({
            success: true,
            channels: liveChannels
        });

    } catch (error) {
        console.error("Error fetching channels:", error);
        res.status(500).json({ message: 'Error fetching channels', error: error.message });
    }
}
