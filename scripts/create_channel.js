const { IvsClient, CreateChannelCommand } = require("@aws-sdk/client-ivs");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const awsConfig = require("./aws-config");

async function createChannel() {
    // Initialize Clients
    const ivsClient = new IvsClient(awsConfig);
    const ddbClient = new DynamoDBClient(awsConfig);
    const docClient = DynamoDBDocumentClient.from(ddbClient);

    const command = new CreateChannelCommand({
        name: "nyu-cc-final-" + Date.now(),
        tags: {
            "Project": "NYU_CC_Final",
            "CreatedBy": "Script"
        },
        latencyMode: "LOW",
        type: "STANDARD"
    });

    try {
        console.log("Creating IVS Channel...");
        const response = await ivsClient.send(command);
        const { channel, streamKey } = response;

        console.log("\n✅ Channel Created Successfully!");
        console.log("--------------------------------------------------");
        console.log("Name:           ", channel.name);
        console.log("ARN:            ", channel.arn);
        console.log("Ingest Endpoint:", "rtmps://" + channel.ingestEndpoint + ":443/app/");
        console.log("Stream Key:     ", streamKey.value);
        console.log("Playback URL:   ", channel.playbackUrl);
        console.log("--------------------------------------------------\n");

        // Save to DynamoDB
        const item = {
            id: channel.name,
            arn: channel.arn,
            ingestEndpoint: "rtmps://" + channel.ingestEndpoint + ":443/app/",
            streamKey: streamKey.value,
            playbackUrl: channel.playbackUrl,
            createdAt: new Date().toISOString()
        };

        console.log("Saving to DynamoDB...");
        await docClient.send(new PutCommand({
            TableName: "IVSChannels",
            Item: item
        }));
        console.log("✅ Channel saved to DynamoDB table 'IVSChannels'");

    } catch (error) {
        console.error("\n❌ Error:", error);
    }
}

createChannel();
