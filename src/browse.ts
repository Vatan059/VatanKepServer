import "dotenv/config";
import { OPCUAClient, MessageSecurityMode, SecurityPolicy, NodeClass } from "node-opcua";

const endpointUrl = process.env.OPCUA_ENDPOINT ?? "opc.tcp://192.168.5.95:49320";
const MAX_DEPTH = 4;

async function browseRecursive(session: any, nodeId: string, depth: number, prefix: string) {
  if (depth > MAX_DEPTH) return;

  const browseResult = await session.browse(nodeId);
  for (const ref of browseResult.references ?? []) {
    if (ref.browseName.toString() === "Server") continue; // standart OPC UA diagnostik alt agaci, gurultu

    console.log(`${prefix}${ref.browseName.toString()}  (${ref.nodeId.toString()})`);
    if (ref.nodeClass === NodeClass.Object || ref.nodeClass === NodeClass.Variable) {
      await browseRecursive(session, ref.nodeId, depth + 1, prefix + "  ");
    }
  }
}

async function main() {
  const client = OPCUAClient.create({
    endpointMustExist: false,
    securityMode: MessageSecurityMode.None,
    securityPolicy: SecurityPolicy.None,
    connectionStrategy: { maxRetry: 3 },
  });

  console.log(`Baglaniliyor: ${endpointUrl}`);
  await client.connect(endpointUrl);
  console.log("Baglandi.");

  const session = await client.createSession();
  console.log("Session acildi, tag agaci taraniyor...\n");

  await browseRecursive(session, "RootFolder", 0, "");

  await session.close();
  await client.disconnect();
}

main().catch((err) => {
  console.error("Hata:", err);
  process.exit(1);
});
