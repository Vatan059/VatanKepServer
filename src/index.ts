import "dotenv/config";
import { OPCUAClient, MessageSecurityMode, SecurityPolicy, AttributeIds, TimestampsToReturn, ClientSubscription, ClientMonitoredItem, DataValue } from "node-opcua";
import { machines } from "./machines";

const endpointUrl = process.env.OPCUA_ENDPOINT ?? "opc.tcp://192.168.5.95:49320";

async function main() {
  const client = OPCUAClient.create({
    endpointMustExist: false,
    securityMode: MessageSecurityMode.None,
    securityPolicy: SecurityPolicy.None,
    connectionStrategy: { maxRetry: -1 },
  });

  client.on("connection_lost", () => console.warn("Baglanti koptu, yeniden denenecek..."));
  client.on("connection_reestablished", () => console.log("Baglanti yeniden kuruldu."));

  await client.connect(endpointUrl);
  const session = await client.createSession();
  console.log("KEPServerEX OPC UA session acildi.");

  const subscription = ClientSubscription.create(session, {
    requestedPublishingInterval: 500,
    requestedLifetimeCount: 1000,
    requestedMaxKeepAliveCount: 20,
    maxNotificationsPerPublish: 100,
    publishingEnabled: true,
    priority: 10,
  });

  subscription.on("started", () => console.log(`Subscription basladi (id=${subscription.subscriptionId}).`));
  subscription.on("terminated", () => console.log("Subscription sonlandi."));

  for (const machine of machines) {
    for (const tag of machine.tags) {
      const monitoredItem = ClientMonitoredItem.create(
        subscription,
        { nodeId: tag.nodeId, attributeId: AttributeIds.Value },
        { samplingInterval: 500, discardOldest: true, queueSize: 10 },
        TimestampsToReturn.Both
      );

      monitoredItem.on("changed", (dataValue: DataValue) => {
        console.log(`${new Date().toISOString()}  ${machine.id}.${tag.label} = ${dataValue.value.value}`);
      });

      monitoredItem.on("err", (message: string) => {
        console.error(`${machine.id}.${tag.label} (${tag.nodeId}) HATA: ${message}`);
      });
    }
  }

  process.on("SIGINT", async () => {
    console.log("\nKapatiliyor...");
    await subscription.terminate();
    await session.close();
    await client.disconnect();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error("Hata:", err);
  process.exit(1);
});
