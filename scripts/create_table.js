const { DynamoDBClient, CreateTableCommand } = require("@aws-sdk/client-dynamodb");
const awsConfig = require("./aws-config");

async function createTable() {
    const client = new DynamoDBClient(awsConfig);

    const command = new CreateTableCommand({
        TableName: "IVSChannels",
        KeySchema: [
            { AttributeName: "id", KeyType: "HASH" } // Partition key
        ],
        AttributeDefinitions: [
            { AttributeName: "id", AttributeType: "S" } // String
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    });

    try {
        console.log("Creating DynamoDB Table 'IVSChannels'...");
        const response = await client.send(command);
        console.log("✅ Table creation initiated:", response.TableDescription.TableStatus);
    } catch (error) {
        if (error.name === 'ResourceInUseException') {
            console.log("ℹ️ Table 'IVSChannels' already exists.");
        } else {
            console.error("❌ Error creating table:", error);
        }
    }
}

createTable();
