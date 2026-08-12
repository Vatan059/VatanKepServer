// Kullanim: node win-service-install.js --name <ServisAdi> --script <js-dosyasi-tam-yol> [--desc <aciklama>] [--root <proje-koku>]
const { Service } = require("node-windows");

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
}

const name = arg("name");
const description = arg("desc") || name;
const script = arg("script");
const workingDirectory = arg("root");

if (!name || !script) {
  console.error("Kullanim: node win-service-install.js --name <ad> --script <yol> [--desc <aciklama>] [--root <klasor>]");
  process.exit(1);
}

const svc = new Service({ name, description, script, workingDirectory });

svc.on("alreadyinstalled", () => {
  console.log(`${name} zaten kurulu.`);
  svc.start();
});
svc.on("install", () => {
  console.log(`${name} kuruldu, baslatiliyor...`);
  svc.start();
});
svc.on("start", () => console.log(`${name} baslatildi.`));
svc.on("error", (err) => {
  console.error(`${name} kurulum hatasi:`, err);
  process.exit(1);
});

svc.install();
