import { IvsClient, CreateChannelCommand } from "@aws-sdk/client-ivs";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { awsConfig } from "./aws-config";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { broadcastName } = req.body;

    if (!broadcastName) {
        return res.status(400).json({ message: 'Broadcast name is required' });
    }

    // Sanitize name: alphanumeric and underscores only
    const sanitizedName = broadcastName.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
    const channelName = `nyu-cc-final-${sanitizedName}-${Date.now()}`;

    try {
        // Initialize Clients
        const ivsClient = new IvsClient(awsConfig);
        const ddbClient = new DynamoDBClient(awsConfig);
        const docClient = DynamoDBDocumentClient.from(ddbClient);

        // 1. Create IVS Channel
        const createCommand = new CreateChannelCommand({
            name: channelName,
            tags: {
                "Project": "NYU_CC_Final",
                "CreatedBy": "WebDemo",
                "BroadcastName": broadcastName
            },
            latencyMode: "LOW",
            type: "STANDARD"
        });

        const ivsResponse = await ivsClient.send(createCommand);
        const { channel, streamKey } = ivsResponse;

        // 2. Save to DynamoDB
        const item = {
            id: channel.name,
            arn: channel.arn,
            ingestEndpoint: "rtmps://" + channel.ingestEndpoint + ":443/app/",
            streamKey: streamKey.value,
            playbackUrl: channel.playbackUrl,
            broadcastName: broadcastName,
            createdAt: new Date().toISOString()
        };

        await docClient.send(new PutCommand({
            TableName: "IVSChannels",
            Item: item
        }));

        // 3. Return details to frontend
        res.status(200).json({
            success: true,
            ingestEndpoint: item.ingestEndpoint,
            streamKey: item.streamKey,
            playbackUrl: item.playbackUrl,
            channelName: channel.name
        });

    } catch (error) {
        console.error("Error creating channel:", error);
        res.status(500).json({ message: 'Error creating channel', error: error.message });
    }
}
