// tags.txt taramasindan cikarilan gercek uretim tag'leri.
// nodeId'ler KEPServerEX'teki "ns=2;s=..." adreslemesiyle birebir eslesiyor.
//
// Yapi: gruplar (hat tipi) -> makineler -> tag'ler. Dashboard bu gruplari
// acilir/kapanir "dugum" olarak gosteriyor. Yeni bir hat tipi eklemek icin
// asagiya yeni bir MachineGroup eklemek yeterli.

export interface MachineTag {
  label: string;
  nodeId: string;
}

export interface Machine {
  id: string;
  tags: MachineTag[];
}

export interface MachineGroup {
  id: string;
  label: string;
  machines: Machine[];
}

const ekstruder: Machine[] = [
  {
    id: "Ex1",
    tags: [
      { label: "Cap", nodeId: "ns=2;s=Ex1-Makine.Ex1.EX1-Cap" },
      { label: "Metre", nodeId: "ns=2;s=Ex1-Makine.Ex1.Ex1-Metre" },
      { label: "HatHizi", nodeId: "ns=2;s=Ex1-Makine.Ex1.HatHizi" },
    ],
  },
  {
    id: "Ex2",
    tags: [
      { label: "Cap", nodeId: "ns=2;s=Ex2-Makine.Ex2.EX2-Cap" },
      { label: "Metre", nodeId: "ns=2;s=Ex2-Makine.Ex2.Ex2-Metre" },
    ],
  },
  {
    id: "Ex3",
    tags: [
      { label: "Cap", nodeId: "ns=2;s=Ex3-Makine.Ex3.EX3-Cap" },
      { label: "Metre", nodeId: "ns=2;s=Ex3-Makine.Ex3.Ex3Metre" },
    ],
  },
  {
    id: "Ex4",
    tags: [
      { label: "Cap", nodeId: "ns=2;s=Ex4-Makine.Ex4.EX4-Cap" },
      { label: "Metre", nodeId: "ns=2;s=Ex4-Makine.Ex4.Ex4Metre" },
      { label: "HatHizi", nodeId: "ns=2;s=Ex4-Makine.Ex4.ana hiz bilgisi" },
    ],
  },
  {
    id: "Ex5",
    tags: [
      { label: "Cap", nodeId: "ns=2;s=Ex5-Makine.Ex5.EX5-Cap" },
      { label: "Metre", nodeId: "ns=2;s=Ex5-Makine.Ex5.Ex5-Metre" },
    ],
  },
  {
    id: "Ex6",
    tags: [
      { label: "Cap", nodeId: "ns=2;s=Ex6-Makine.Ex6.EX6-Cap" },
      { label: "Metre", nodeId: "ns=2;s=Ex6-Makine.Ex6.Ex6-Metre" },
    ],
  },
  {
    id: "Ex7",
    tags: [
      { label: "Cap", nodeId: "ns=2;s=Ex7-Makine.Ex7.EX7-Cap" },
      { label: "HatHizi", nodeId: "ns=2;s=Ex7-Makine.Ex7.EX7-HatHizi" },
      { label: "Metre", nodeId: "ns=2;s=Ex7-Makine.Ex7.Metre1" },
    ],
  },
  {
    id: "Ex8",
    tags: [
      { label: "Cap", nodeId: "ns=2;s=Ex8-Makine.Ex8.Cap" },
      { label: "Metre", nodeId: "ns=2;s=Ex8-Makine.Ex8.Metre" },
    ],
  },
  {
    id: "Ex9",
    tags: [
      { label: "Cap", nodeId: "ns=2;s=Ex9-Makine.Ex9.EX9-Cap" },
      { label: "Metre", nodeId: "ns=2;s=Ex9-Makine.Ex9.Ex9-Metre" },
    ],
  },
  {
    id: "Ex10",
    tags: [
      { label: "Cap", nodeId: "ns=2;s=Ex10-Makine.Ex10.EX10-Cap" },
      { label: "Metre", nodeId: "ns=2;s=Ex10-Makine.Ex10.Ex10-Metre" },
    ],
  },
  {
    id: "Ex12",
    tags: [
      // Cap tag'i bulunamadi, teyit gerekiyor
      { label: "Metre", nodeId: "ns=2;s=Ex12-Makine.Ex12.Metre" },
      { label: "HatHizi", nodeId: "ns=2;s=Ex12-Makine.Ex12.hat hizi bilgisi" },
    ],
  },
  {
    id: "Ex13",
    tags: [
      { label: "Cap", nodeId: "ns=2;s=Ex13-Makine.Ex13.EX13-Cap" },
      { label: "Metre", nodeId: "ns=2;s=Ex13-Makine.Ex13.Ex13-Metre" },
    ],
  },
  {
    id: "Ex14",
    tags: [
      { label: "Cap", nodeId: "ns=2;s=Ex14-Makine.Ex14.EX14-Cap" },
      { label: "Metre", nodeId: "ns=2;s=Ex14-Makine.Ex14.Ex14Metre" },
    ],
  },
  {
    id: "Ex15",
    tags: [
      // Cap tag'i bulunamadi, teyit gerekiyor
      { label: "Metre", nodeId: "ns=2;s=Ex15-Makine.Ex15.Ex15-Metre" },
    ],
  },
];

// Dozaj (dozajlama/renklendirme) kanallari - Boya1/Boya2/Hammadde/Katalizor dozaj
// oranlari. SiparisNo tag'leri (aktif siparis no) muhtemelen metin (string) oldugu
// icin simdilik disarida birakildi - mevcut SQLite semasi sadece sayisal (REAL)
// deger tutuyor. Bu tag'lerin canli degerleri henuz Cap/Metre gibi teyit edilmedi.
const dozaj: Machine[] = [
  {
    id: "Ex1-Dozaj",
    tags: [
      { label: "AnaTuketim", nodeId: "ns=2;s=Ex1-Dozaj.Ex1-Hammadde.AnaTüketim" },
      { label: "Boya1", nodeId: "ns=2;s=Ex1-Dozaj.Ex1-Hammadde.Boya1" },
      { label: "Boya2", nodeId: "ns=2;s=Ex1-Dozaj.Ex1-Hammadde.Boya2" },
      { label: "Katalizor", nodeId: "ns=2;s=Ex1-Dozaj.Ex1-Hammadde.Katalizör" },
    ],
  },
  {
    id: "Ex2-Dozaj",
    tags: [
      { label: "AnaHammadde", nodeId: "ns=2;s=Ex2-Dozaj.Ex2.Ex2-AnaHammadde" },
      { label: "Boya1", nodeId: "ns=2;s=Ex2-Dozaj.Ex2.Ex2-Boya1" },
      { label: "Boya2", nodeId: "ns=2;s=Ex2-Dozaj.Ex2.Ex2-Boya2" },
      { label: "Katalizor", nodeId: "ns=2;s=Ex2-Dozaj.Ex2.Ex2-Katalizör" },
    ],
  },
  {
    id: "Ex2-Cizgi",
    tags: [
      { label: "AnaHammadde", nodeId: "ns=2;s=Ex2-Cizgi-Dozaj.Ex2-Cizgi.Ex2-Cizgi-AnaHammadde" },
      { label: "Boya1", nodeId: "ns=2;s=Ex2-Cizgi-Dozaj.Ex2-Cizgi.Ex2-Cizgi-Boya1" },
      { label: "Boya2", nodeId: "ns=2;s=Ex2-Cizgi-Dozaj.Ex2-Cizgi.Ex2-Cizgi-Boya2" },
      { label: "Katalizor", nodeId: "ns=2;s=Ex2-Cizgi-Dozaj.Ex2-Cizgi.Ex2-Cizgi-Katalizör" },
    ],
  },
  {
    id: "Ex3-Dozaj",
    tags: [
      { label: "AnaHammadde", nodeId: "ns=2;s=Ex3-Dozaj.Ex3-Hammadde.Ex3-AnaHammadde" },
      { label: "Boya1", nodeId: "ns=2;s=Ex3-Dozaj.Ex3-Hammadde.Ex3-Boya1" },
      { label: "Boya2", nodeId: "ns=2;s=Ex3-Dozaj.Ex3-Hammadde.Ex3-Boya2" },
      { label: "Katalizor", nodeId: "ns=2;s=Ex3-Dozaj.Ex3-Hammadde.Ex3-Katalizör" },
    ],
  },
  {
    id: "Ex4-Dozaj",
    tags: [
      { label: "Boya1", nodeId: "ns=2;s=Ex4-Dozaj.Ex4-Hammadde.Ex4-Boya1" },
      { label: "Boya2", nodeId: "ns=2;s=Ex4-Dozaj.Ex4-Hammadde.Ex4-Boya2" },
      { label: "Boya3", nodeId: "ns=2;s=Ex4-Dozaj.Ex4-Hammadde.Ex4-Boya3" },
      { label: "Hammadde", nodeId: "ns=2;s=Ex4-Dozaj.Ex4-Hammadde.Ex4-Hammadde" },
      { label: "Katalizor", nodeId: "ns=2;s=Ex4-Dozaj.Ex4-Hammadde.Ex4-Katalizör" },
    ],
  },
  {
    id: "Ex5-Dıs-Dozaj",
    tags: [
      { label: "Boya1", nodeId: "ns=2;s=Ex5-Dıs-Dozaj.Ex5-Dıs.Ex5-Boya1" },
      { label: "Boya2", nodeId: "ns=2;s=Ex5-Dıs-Dozaj.Ex5-Dıs.Ex5-Boya2" },
      { label: "EkMalzeme", nodeId: "ns=2;s=Ex5-Dıs-Dozaj.Ex5-Dıs.Ex5-EkMalzeme" },
      { label: "Hammadde", nodeId: "ns=2;s=Ex5-Dıs-Dozaj.Ex5-Dıs.Ex5-Hammadde" },
    ],
  },
  {
    id: "Ex5-Dolgu-Dozaj",
    tags: [
      { label: "Boya1", nodeId: "ns=2;s=Ex5-Dolgu-Dozaj.Ex5-Dolgu-Dozaj.Ex5-Boya1" },
      { label: "EkMalzeme", nodeId: "ns=2;s=Ex5-Dolgu-Dozaj.Ex5-Dolgu-Dozaj.Ex5-EkMalzeme" },
      { label: "Hammadde", nodeId: "ns=2;s=Ex5-Dolgu-Dozaj.Ex5-Dolgu-Dozaj.Ex5-Hammadde" },
    ],
  },
  {
    id: "Ex6-Ana-Dozaj",
    tags: [
      { label: "Boya1", nodeId: "ns=2;s=Ex6-Ana-Dozaj.Ex6-Ana-Hammadde.Ex6-Boya1" },
      { label: "Boya2", nodeId: "ns=2;s=Ex6-Ana-Dozaj.Ex6-Ana-Hammadde.Ex6-Boya2" },
      { label: "Hammadde", nodeId: "ns=2;s=Ex6-Ana-Dozaj.Ex6-Ana-Hammadde.Ex6-Hammadde" },
    ],
  },
  {
    id: "Ex6-Renk1-Dozaj",
    tags: [
      { label: "AnaHammadde", nodeId: "ns=2;s=Ex6-Renk1-Dozaj.Ex6-Renk1.Ex6-Renk1-AnaHammadde" },
      { label: "Gri", nodeId: "ns=2;s=Ex6-Renk1-Dozaj.Ex6-Renk1.Ex6-Renk1-Gri" },
      { label: "Mavi", nodeId: "ns=2;s=Ex6-Renk1-Dozaj.Ex6-Renk1.Ex6-Renk1-Mavi" },
    ],
  },
  {
    id: "Ex6-Renk2-Dozaj",
    tags: [
      { label: "AnaHammadde", nodeId: "ns=2;s=Ex6-Renk2-Dozaj.Ex6-Renk2.Ex6-Renk2-AnaHammadde" },
      { label: "Kahve", nodeId: "ns=2;s=Ex6-Renk2-Dozaj.Ex6-Renk2.Ex6-Renk2-Kahve" },
      { label: "Siyah", nodeId: "ns=2;s=Ex6-Renk2-Dozaj.Ex6-Renk2.Ex6-Renk2-Siyah" },
    ],
  },
  {
    id: "Ex7-Dozaj",
    tags: [
      { label: "Boya1", nodeId: "ns=2;s=Ex7-Dozaj.Ex7-Dozaj.Ex7-Boya1" },
      { label: "Boya2", nodeId: "ns=2;s=Ex7-Dozaj.Ex7-Dozaj.Ex7-Boya2" },
      { label: "Hammadde", nodeId: "ns=2;s=Ex7-Dozaj.Ex7-Dozaj.Ex7-Hammadde" },
      { label: "Katalizor", nodeId: "ns=2;s=Ex7-Dozaj.Ex7-Dozaj.Ex7-Katalizör" },
    ],
  },
  {
    id: "Ex9-Dıs-Dozaj",
    tags: [
      { label: "Boya1", nodeId: "ns=2;s=Ex9-Dıs-Dozaj.Ex9-Dıs.Ex9-Boya1" },
      { label: "Boya2", nodeId: "ns=2;s=Ex9-Dıs-Dozaj.Ex9-Dıs.Ex9-Boya2" },
      { label: "Hammadde", nodeId: "ns=2;s=Ex9-Dıs-Dozaj.Ex9-Dıs.Ex9-Dıs-Hammadde" },
    ],
  },
  {
    id: "Ex9-Kaplama-Dozaj",
    tags: [
      { label: "Boya1", nodeId: "ns=2;s=Ex9-Kaplama-Dozaj.Ex9-Kaplama.Ex9-Boya1" },
      { label: "Boya2", nodeId: "ns=2;s=Ex9-Kaplama-Dozaj.Ex9-Kaplama.Ex9-Boya2" },
      { label: "Hammadde", nodeId: "ns=2;s=Ex9-Kaplama-Dozaj.Ex9-Kaplama.Ex9-Kaplama-Hammadde" },
    ],
  },
  {
    id: "Ex10-Dozaj",
    tags: [
      { label: "Boya1", nodeId: "ns=2;s=Ex10-Dozaj.Ex10-Dozaj.Ex10-Boya1" },
      { label: "Boya2", nodeId: "ns=2;s=Ex10-Dozaj.Ex10-Dozaj.Ex10-Boya2" },
      { label: "EkMalzeme", nodeId: "ns=2;s=Ex10-Dozaj.Ex10-Dozaj.Ex10-EkMalzeme" },
      { label: "Hammadde", nodeId: "ns=2;s=Ex10-Dozaj.Ex10-Dozaj.Ex10-Hammadde" },
    ],
  },
  {
    id: "Ex12-Dozaj",
    tags: [
      { label: "AnaHammadde", nodeId: "ns=2;s=Ex12-Dozaj.Ex12-Hammadde.Ex12-AnaHammadde" },
      { label: "Boya1", nodeId: "ns=2;s=Ex12-Dozaj.Ex12-Hammadde.Ex12-Boya1" },
      { label: "Boya2", nodeId: "ns=2;s=Ex12-Dozaj.Ex12-Hammadde.Ex12-Boya2" },
    ],
  },
  {
    id: "Ex13-Dıs-Dozaj",
    tags: [
      { label: "Boya1", nodeId: "ns=2;s=Ex13-Dıs-Dozaj.Ex13-Dıs.Ex13-Dıs-Boya1" },
      { label: "EkMalzeme", nodeId: "ns=2;s=Ex13-Dıs-Dozaj.Ex13-Dıs.Ex13-Dıs-EkMalzeme" },
      { label: "Hammadde", nodeId: "ns=2;s=Ex13-Dıs-Dozaj.Ex13-Dıs.Ex13-Dıs-Hammadde" },
    ],
  },
  {
    id: "Ex13-Dolgu-Dozaj",
    tags: [
      { label: "Boya1", nodeId: "ns=2;s=Ex13-Dolgu-Dozaj.Ex13-Dolgu.Ex13-Boya1" },
      { label: "Hammadde", nodeId: "ns=2;s=Ex13-Dolgu-Dozaj.Ex13-Dolgu.Ex13-Dolgu-Hammadde" },
    ],
  },
  {
    id: "Ex14-Dıs-Dozaj",
    tags: [
      { label: "Boya1", nodeId: "ns=2;s=Ex14-Dıs-Dozaj.Ex14-Dıs.Ex14-Boya1" },
      { label: "Boya2", nodeId: "ns=2;s=Ex14-Dıs-Dozaj.Ex14-Dıs.Ex14-Boya2" },
      { label: "EkMalzeme", nodeId: "ns=2;s=Ex14-Dıs-Dozaj.Ex14-Dıs.Ex14-EkMalzeme" },
      { label: "Hammadde", nodeId: "ns=2;s=Ex14-Dıs-Dozaj.Ex14-Dıs.Ex14-Hammadde" },
    ],
  },
  {
    id: "Ex14-Dolgu-Dozaj",
    tags: [
      { label: "Boya1", nodeId: "ns=2;s=Ex14-Dolgu-Dozaj.Ex14-Dolgu_Dozaj.Ex14-Boya1" },
      { label: "EkMalzeme", nodeId: "ns=2;s=Ex14-Dolgu-Dozaj.Ex14-Dolgu_Dozaj.Ex14-EkMalzeme" },
      { label: "Hammadde", nodeId: "ns=2;s=Ex14-Dolgu-Dozaj.Ex14-Dolgu_Dozaj.Ex14-Hammadde" },
    ],
  },
  {
    id: "Ex15-Dıs-Dozaj",
    tags: [
      { label: "Boya1", nodeId: "ns=2;s=Ex15-Dıs-Dozaj.Ex15-Dıs-Dozaj.Ex15-Dıs-Boya1" },
      { label: "Boya2", nodeId: "ns=2;s=Ex15-Dıs-Dozaj.Ex15-Dıs-Dozaj.Ex15-Dıs-Boya2" },
      { label: "EkMalzeme", nodeId: "ns=2;s=Ex15-Dıs-Dozaj.Ex15-Dıs-Dozaj.Ex15-Dıs-EkMalzeme" },
      { label: "Hammadde", nodeId: "ns=2;s=Ex15-Dıs-Dozaj.Ex15-Dıs-Dozaj.Ex15-Dıs-Hammadde" },
    ],
  },
  {
    id: "Ex15-Dolgu-Dozaj",
    tags: [
      { label: "Boya1", nodeId: "ns=2;s=Ex15-Dolgu-Dozaj.Ex15-Dolgu.Ex15-Dolgu-Boya1" },
      { label: "Boya2", nodeId: "ns=2;s=Ex15-Dolgu-Dozaj.Ex15-Dolgu.Ex15-Dolgu-Boya2" },
      { label: "EkMalzeme", nodeId: "ns=2;s=Ex15-Dolgu-Dozaj.Ex15-Dolgu.Ex15-Dolgu-EkMalzeme" },
      { label: "Hammadde", nodeId: "ns=2;s=Ex15-Dolgu-Dozaj.Ex15-Dolgu.Ex15-Dolgu-Hammadde" },
    ],
  },
];

// Henuz hangi tag'in hangi degeri tuttugu teyit edilmemis kanallar icin -
// makine KEPServerEX'te var, tag esleme (Cap/Metre gibi) sonraki asamada yapilacak.
const noTags = (ids: string[]): Machine[] => ids.map((id) => ({ id, tags: [] }));

// Is merkezi (WrkCtrId) -> Grup listesinden cikarilan yapi. KEPServerEX'teki
// gercek kanal adlariyla karsilastirildi - bazi is merkezlerinin KEPServerEX'te
// hic karsiligi yok (asagida grup yorumlarinda belirtildi), o yuzden gruba
// eklenmediler.
const zirhlama = noTags(["ST8-Makine", "ST10-Makine", "ST11-Makine", "ST12-Makine", "ST13-Makine", "ST15-Makine"]);
// Eksik/KEPServerEX'te karsiligi olmayan is merkezleri: BRD16-1..4, BRD24-1/2, ST25, MT01, MT02, ST09

const kangal = noTags(["CM1", "CM2", "CM3-Makine", "CM4"]);

const aktarma = noTags(["AK1-Makine", "AK2-Makine"]);
// AK03 KEPServerEX'te bulunamadi

const telCekme = noTags([
  "RB1-Makine",
  "RB2-Makine",
  "RB3-Makine",
  "RB4-Makine",
  "RB5-Makine",
  "RB6-Makine",
  "MW1-Makine",
  "MW2-Makine",
  "MW3-Codesys",
  "MW4-Makine",
]);
// NR01 KEPServerEX'te bulunamadi. RB4-6/MW3-4 listede yoktu ama ayni onek oldugu icin eklendi - teyit edilmeli.

const iletkenBukum = noTags(["BM4-Makine", "BM5-Makine", "BM6-Makine", "BM7-Makine", "BM8-Makine", "ST2-Makine", "ST4-Makine", "ST16-Makine"]);
// DIKKAT: ERP'deki BM01-04 numaralari ile KEPServerEX'teki BM4-BM8 numaralari uyusmuyor.
// Hangi fiziksel makinenin hangi KEPServerEX kanaligina karsilik geldigi teyit edilmeli. ST3 KEPServerEX'te yok.

const damarBukum = noTags(["ST6-Makine", "ST7-Makine"]);
// ST14 KEPServerEX'te bulunamadi

const plastikhane = noTags(["GR1-Makine", "GR3-Makine"]);
// GEX01/02/03 iş merkezi kodlari KEPServerEX'te yok - GR1/GR3 kanallarinin
// bunlarin karsiligi olma ihtimali var (Plastikhane baglami uyusuyor) ama
// TEYIT EDILMEDI, varsayim olarak isaretlendi.

export const groups: MachineGroup[] = [
  { id: "ekstruder", label: "Ekstruder Hatti", machines: ekstruder },
  { id: "dozaj", label: "Dozaj", machines: dozaj },
  { id: "zirhlama", label: "Zirhlama", machines: zirhlama },
  { id: "kangal", label: "Kangal", machines: kangal },
  { id: "aktarma", label: "Aktarma", machines: aktarma },
  { id: "tel-cekme", label: "Tel Cekme", machines: telCekme },
  { id: "iletken-bukum", label: "Iletken Bukum", machines: iletkenBukum },
  { id: "damar-bukum", label: "Damar Bukum", machines: damarBukum },
  { id: "plastikhane", label: "Plastikhane (teyit gerekiyor)", machines: plastikhane },
  // Bu 3 is merkezi grubunun KEPServerEX'te hic karsiligi bulunamadi -
  // henuz izlenmiyor, ileride baglanti kurulunca makineler eklenecek.
  { id: "og-hatti", label: "OG Hatti", machines: [] },
  { id: "yg-hatti", label: "YG Hatti", machines: [] },
  { id: "makara-uretim", label: "Makara Uretim", machines: [] },
];

// Toplama servisi (index.ts) icin duz liste.
export const machines: Machine[] = groups.flatMap((g) => g.machines);
