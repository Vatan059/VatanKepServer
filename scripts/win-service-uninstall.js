// Kullanim: node win-service-uninstall.js --name <ServisAdi> --script <js-dosyasi-tam-yol>
const { Service } = require("node-windows");

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
}

const name = arg("name");
const script = arg("script");

if (!name || !script) {
  console.error("Kullanim: node win-service-uninstall.js --name <ad> --script <yol>");
  process.exit(1);
}

const svc = new Service({ name, script });
svc.on("uninstall", () => console.log(`${name} kaldirildi.`));
svc.uninstall();
