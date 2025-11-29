import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { awsConfig } from "./aws-config";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const ddbClient = new DynamoDBClient(awsConfig);
        const docClient = DynamoDBDocumentClient.from(ddbClient);

        const command = new ScanCommand({
            TableName: "IVSChannels"
        });

        const response = await docClient.send(command);

        // Sort by creation date descending (newest first)
        const items = response.Items.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        res.status(200).json({
            success: true,
            channels: items
        });

    } catch (error) {
        console.error("Error fetching channels:", error);
        res.status(500).json({ message: 'Error fetching channels', error: error.message });
    }
}
