import { IvsClient, GetStreamCommand } from "@aws-sdk/client-ivs";
import { awsConfig } from "./aws-config";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { channelArn } = req.body;

    if (!channelArn) {
        return res.status(400).json({ message: 'Channel ARN is required' });
    }

    try {
        const ivsClient = new IvsClient(awsConfig);

        const command = new GetStreamCommand({
            channelArn: channelArn,
        });

        const response = await ivsClient.send(command);
        
        // If stream exists and state is LIVE, the stream is active
        const isLive = response.stream?.state === 'LIVE';
        
        res.status(200).json({
            success: true,
            isLive: isLive || false,
            streamState: response.stream?.state || 'OFFLINE',
        });

    } catch (error) {
        // If stream doesn't exist or is offline, GetStream will throw an error
        // This means the stream is not live
        if (error.name === 'ResourceNotFoundException' || error.name === 'StreamNotAvailable') {
            res.status(200).json({
                success: true,
                isLive: false,
                streamState: 'OFFLINE',
            });
        } else {
            console.error("Error checking stream status:", error);
            res.status(500).json({ 
                message: 'Error checking stream status', 
                error: error.message 
            });
        }
    }
}

