const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const awsConfig = require("./aws-config");

async function scanTable() {
    const client = new DynamoDBClient(awsConfig);
    const docClient = DynamoDBDocumentClient.from(client);

    try {
        console.log("Scanning table 'IVSChannels'...");
        const response = await docClient.send(new ScanCommand({
            TableName: "IVSChannels"
        }));

        console.log(`\n✅ Found ${response.Count} items:`);
        console.log("--------------------------------------------------");
        response.Items.forEach(item => {
            console.log(`ID: ${item.id}`);
            console.log(`Ingest: ${item.ingestEndpoint}`);
            console.log(`Created: ${item.createdAt}`);
            console.log("---");
        });
        console.log("--------------------------------------------------\n");

    } catch (error) {
        console.error("❌ Error scanning table:", error);
    }
}

scanTable();
