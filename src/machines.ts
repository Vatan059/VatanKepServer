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

// Grup yapisi TREX veritabanindan (PWORKCENTER + PWORKSTATION tablolari,
// 192.168.5.19\TREX) alindi - D365'teki eski liste yerine bu esas alindi.
// Her grup icin KEPServerEX'teki (tags.txt) gercek kanal adlariyla karsilastirildi;
// TREX'te tanimli olup KEPServerEX'te kanali olmayan is istasyonlari gruba eklenmedi.

const zirhlama: Machine[] = [
  {
    id: "ST8-Makine",
    tags: [
      { label: "Cap", nodeId: "ns=2;s=ST8-Makine.ST8.mak_Cap" },
      { label: "Metre", nodeId: "ns=2;s=ST8-Makine.ST8.METRE SAy" },
    ],
  },
  { id: "ST10-Makine", tags: [{ label: "Metre", nodeId: "ns=2;s=ST10-Makine.ST10.ST10-Metre" }] },
  { id: "ST11-Makine", tags: [{ label: "Cap", nodeId: "ns=2;s=ST11-Makine.ST11.KABLO_CAP" }] },
  { id: "ST12-Makine", tags: [] }, // sadece "Test" tag'i var, gercek uretim tag'i yok
  { id: "ST13-Makine", tags: [{ label: "Metre", nodeId: "ns=2;s=ST13-Makine.ST13.Metre" }] },
  { id: "ST15-Makine", tags: [] }, // sadece "Test" tag'i var
  { id: "ST18-Makine", tags: [{ label: "Metre", nodeId: "ns=2;s=ST18-Makine.ST18.ToplamMetre" }] },
];
// TREX'te var ama KEPServerEX'te kanali yok: MT01, MT02, ST09, ST25

const kangal: Machine[] = [
  {
    id: "CM1",
    tags: [
      { label: "HatHizi", nodeId: "ns=2;s=CM1.CM1.SIMOTION.unit/.variable_.hmi_.normal_hat_hizi" },
      { label: "Metre", nodeId: "ns=2;s=CM1.CM1.SIMOTION.unit/.variable_.yapilan_metraj" },
      { label: "KangalSayisi", nodeId: "ns=2;s=CM1.CM1.SIMOTION.unit/.variable_.hmi_.sarilan_kangal_sayisi" },
    ],
  },
  {
    id: "CM2",
    tags: [
      { label: "HatHizi", nodeId: "ns=2;s=CM2.CM2.SIMOTION.unit/.variable_.hmi_.hat_hizi" },
      { label: "Cap", nodeId: "ns=2;s=CM2.CM2.SIMOTION.unit/.variable_.hmi_.kablo_capi" },
      { label: "Metre", nodeId: "ns=2;s=CM2.CM2.SIMOTION.unit/.variable_.hmi_.kablo_uzunlugu" },
      { label: "KangalSayisi", nodeId: "ns=2;s=CM2.CM2.SIMOTION.unit/.variable_.hmi_.sarilan_kangal_sayisi" },
    ],
  },
  {
    id: "CM3-Makine",
    tags: [
      { label: "HatHizi", nodeId: "ns=2;s=CM3-Makine.CM3.enkoder_hathizi" },
      { label: "Metre", nodeId: "ns=2;s=CM3-Makine.CM3.CM3-Metre" },
    ],
  },
  {
    id: "CM4",
    tags: [
      { label: "Metre", nodeId: "ns=2;s=CM4.CM4AnaEkran.CM4Metre" },
      { label: "Cap", nodeId: "ns=2;s=CM4.CM4AnaEkran.kablokalinligi" },
      { label: "KangalSayisi", nodeId: "ns=2;s=CM4.CM4AnaEkran.sarilan_kangal_sayisi" },
    ],
  },
];
// TREX'te var ama KEPServerEX'te kanali yok: CM05

// AK1/AK2'nin tum tag'leri (VERICI_DB.REAL_59 gibi) etiketsiz genel isimler -
// hangisinin "metre/hiz" oldugu isimden anlasilmiyor, ayrica KEPServerEX Quick
// Client'ta Quality=Bad gorunuyordu (canli veri gelmiyor). Teyit gerekiyor.
const aktarma = noTags(["AK1-Makine", "AK2-Makine"]);
// TREX'te var ama KEPServerEX'te kanali yok: AK03

const telCekme: Machine[] = [
  { id: "RB1-Makine", tags: [{ label: "Metre", nodeId: "ns=2;s=RB1-Makine.RB1.Metre" }] },
  {
    id: "RB2-Makine",
    tags: [
      { label: "HatHizi", nodeId: "ns=2;s=RB2-Makine.RB2.HatHızı" },
      { label: "Cap", nodeId: "ns=2;s=RB2-Makine.RB2.RB2-CAP" },
      { label: "Metre", nodeId: "ns=2;s=RB2-Makine.RB2.SEPET1-METRE" },
    ],
  },
  { id: "RB3-DoubleSpooler", tags: [{ label: "Metre", nodeId: "ns=2;s=RB3-DoubleSpooler.RB3-DS.RB3-DoubleSpooler-Metre" }] },
  { id: "RB3-Makine", tags: [{ label: "Metre", nodeId: "ns=2;s=RB3-Makine.RB3.Rb3MetreMakara" }] },
  {
    id: "RB4-Makine",
    tags: [
      { label: "HatHizi", nodeId: "ns=2;s=RB4-Makine.RB4.TAKE_UP_GVL.GENERAL.LINE SPEED M MIN" },
      { label: "Metre", nodeId: "ns=2;s=RB4-Makine.RB4.TAKE_UP_GVL.GENERAL.PRODUCT METER ACTUAL" },
      { label: "Cap", nodeId: "ns=2;s=RB4-Makine.RB4.TAKE_UP_GVL.RIGHT.SPOOLER DIAMETER" },
    ],
  },
  {
    id: "RB5-Makine",
    tags: [
      { label: "HatHizi", nodeId: "ns=2;s=RB5-Makine.RB5.CONTROL.ACTUAL LINE SPEED m/dk" },
      { label: "Metre", nodeId: "ns=2;s=RB5-Makine.RB5.ACTUAL PRODUCTION METER m" },
      { label: "Cap", nodeId: "ns=2;s=RB5-Makine.RB5.CONTROL.WHEEL DIAMETER m" },
    ],
  },
  { id: "RB6-Makine", tags: [{ label: "Metre", nodeId: "ns=2;s=RB6-Makine.RB6.Coiler1-Metre" }] },
  {
    id: "MW1-Makine",
    tags: [
      { label: "HatHizi", nodeId: "ns=2;s=MW1-Makine.MW1.MW1-Hız" },
      { label: "Metre", nodeId: "ns=2;s=MW1-Makine.MW1.MW1-ASarıcı-Metre" },
    ],
  },
  {
    id: "MW2-Makine",
    tags: [
      { label: "HatHizi", nodeId: "ns=2;s=MW2-Makine.MW2.MW2-Hız" },
      { label: "Metre", nodeId: "ns=2;s=MW2-Makine.MW2.MW2-Metre" },
    ],
  },
  {
    // Cok telli (35+ tel) tel cekme makinesi - sadece 1. sarici/tel temsili olarak eklendi.
    id: "MW3-Codesys",
    tags: [
      { label: "Metre", nodeId: "ns=2;s=MW3-Codesys.MW3.GLOBAL.metre_real" },
      { label: "HatHizi", nodeId: "ns=2;s=MW3-Codesys.MW3.GLOBAL.reel_hiz" },
      { label: "Cap", nodeId: "ns=2;s=MW3-Codesys.MW3.GLOBAL.sarici1_tel_capi" },
    ],
  },
  {
    id: "MW4-Makine",
    tags: [
      { label: "Metre", nodeId: "ns=2;s=MW4-Makine.MW4.GLOBAL.metre_real" },
      { label: "HatHizi", nodeId: "ns=2;s=MW4-Makine.MW4.GLOBAL.reel_hiz" },
      { label: "Cap", nodeId: "ns=2;s=MW4-Makine.MW4.GLOBAL.sarici1_tel_capi" },
    ],
  },
];
// Tum TREX is istasyonlari (MW01-04, RB01-06) KEPServerEX'te karsiligini buldu.

const iletkenBukum: Machine[] = [
  {
    id: "BM4-Makine",
    tags: [
      { label: "Metre", nodeId: "ns=2;s=BM4-Makine.BM4.BM4-Metre" },
      { label: "HatHizi", nodeId: "ns=2;s=BM4-Makine.BM4.ekran.travers  hizi mdk" },
      { label: "KabloYaricapi", nodeId: "ns=2;s=BM4-Makine.BM4.ekran.kablo yaricapi" },
    ],
  },
  {
    id: "BM5-Makine",
    tags: [{ label: "Metre", nodeId: "ns=2;s=BM5-Makine.BM5.BM5-Metre" }],
  },
  {
    id: "BM6-Makine",
    tags: [
      { label: "Metre", nodeId: "ns=2;s=BM6-Makine.BM6.BM6-Metre" },
      { label: "HatHizi", nodeId: "ns=2;s=BM6-Makine.BM6.ekran.travers  hizi mdk" },
      { label: "KabloYaricapi", nodeId: "ns=2;s=BM6-Makine.BM6.ekran.kablo yaricapi" },
    ],
  },
  {
    id: "BM7-Makine",
    tags: [{ label: "Metre", nodeId: "ns=2;s=BM7-Makine.BM7.BM7-Metre" }],
  },
  {
    id: "BM8-Makine",
    tags: [
      { label: "Metre", nodeId: "ns=2;s=BM8-Makine.BM8.DB6_HMI.METRE TOPLAM" },
      { label: "HatHizi", nodeId: "ns=2;s=BM8-Makine.BM8.DB6_HMI.M/DK" },
      { label: "HatveMM", nodeId: "ns=2;s=BM8-Makine.BM8.DB6_HMI.HATVE MM" },
    ],
  },
];

const iletkenBukumDiger: Machine[] = [
  {
    // DIKKAT: bu makine "ST1" degil "Device1" adiyla kayitli KEPServerEX'te.
    id: "ST1-Makine",
    tags: [
      { label: "Metre", nodeId: "ns=2;s=ST1-Makine.Device1.metre sayici_1" },
      { label: "Cap", nodeId: "ns=2;s=ST1-Makine.Device1.topla mak cap gercek" },
    ],
  },
  { id: "ST2-Makine", tags: [{ label: "Metre", nodeId: "ns=2;s=ST2-Makine.ST2.Metre" }] },
  { id: "ST4-Makine", tags: [] }, // binlerce etiketsiz VD kaydi (VD0, VD1...) - harici dokumantasyon olmadan tag eslenemez
  { id: "ST16-Makine", tags: [{ label: "Metre", nodeId: "ns=2;s=ST16-Makine.ST16.ST16_Metre" }] },
  {
    id: "ST17-Makine",
    tags: [
      { label: "Metre", nodeId: "ns=2;s=ST17-Makine.ST17.METRE" },
      { label: "HatHizi", nodeId: "ns=2;s=ST17-Makine.ST17.Drive_ReelSpeedFbk" },
    ],
  },
  { id: "ST19-Makine", tags: [{ label: "Metre", nodeId: "ns=2;s=ST19-Makine.ST19.TOPLAM_METRE" }] },
  { id: "ST20-Makine", tags: [{ label: "Metre", nodeId: "ns=2;s=ST20-Makine.ST20.ANLIK ÜRETİM METRESİ" }] },
  { id: "ST21-Makine", tags: [{ label: "Metre", nodeId: "ns=2;s=ST21-Makine.ST21.ANLIK ÜRETİM METRESİ" }] },
  { id: "ST22-Makine", tags: [{ label: "Metre", nodeId: "ns=2;s=ST22-Makine.ST22.ST22-Metre" }] },
];
// TREX'te var ama KEPServerEX'te kanali yok: BM01, BM02, BM03 (KEPServerEX'te sadece BM4-8 var,
// TREX'teki BM01-08 numaralamasiyla birebir eslesmiyor - hangi fiziksel makinenin hangisi
// oldugu teyit edilmeli), ST03, ST24

const damarBukum: Machine[] = [
  { id: "ST5-Makine", tags: [{ label: "Metre", nodeId: "ns=2;s=ST5-Makine.ST5.Metre" }] },
  { id: "ST6-Makine", tags: [{ label: "Metre", nodeId: "ns=2;s=ST6-Makine.ST6.ST6-Metre" }] },
  { id: "ST7-Makine", tags: [] }, // sadece kurulum/hesaplama parametreleri var, canli olcum tag'i bulunamadi
];
// TREX'te var ama KEPServerEX'te kanali yok: ST14

// Su gruplarin TREX'te tanimli is istasyonlari var ama KEPServerEX'te hic kanali yok -
// henuz OPC UA uzerinden izlenmiyor. Ileride baglanti kurulursa buraya eklenecek.
// - PLASTIKHANE: GEX01-04 (DIKKAT: daha once KEPServerEX'teki GR1-Makine/GR3-Makine'nin
//   bunlarin karsiligi olabilecegi varsayilmisti, TREX verisiyle bu teyit EDILEMEDI -
//   GR1/GR3'un TREX'te hic kaydi yok, ayri/eski bir hat olabilir, GRUPLARA DAHIL EDILMEDI.
// - UPCAST: NR01, NR02
// - ZAYIF AKIM: BRD16-1..4, BRD24-1/2, ZEX01, ZST01-05 (D365 listesinde "Zirhlama" sanilmisti,
//   TREX'e gore ayri bir grup)
// - AL DOKUM: AL CCRLINE, Aluminyum Dokum
// - KALITE KONTROL: KK
// - MAKARA URETIM: ARABA, Cakim
// - PLANLAMA, CV (CV01-03 KEPServerEX'te var ama ayri ele alinacak - asagida)

const cv: Machine[] = [
  {
    id: "CV01",
    tags: [
      { label: "Metre", nodeId: "ns=2;s=CV01.CV01.METRE" },
      { label: "HatHizi", nodeId: "ns=2;s=CV01.CV01.DB_SAR_CAP_HSB.Sar1GercekKabloHizi" },
      { label: "Cap", nodeId: "ns=2;s=CV01.CV01.DB_SAR_CAP_HSB.Sar1OrtalamaCap" },
    ],
  },
  { id: "CV02", tags: [{ label: "Metre", nodeId: "ns=2;s=CV02.CV02.METRE" }] },
  { id: "CV03", tags: [] }, // KEPServerEX'te bu kanalin altinda hic tag yok
];
// TREX'te var ama KEPServerEX'te kanali yok: CV04, CV05, YG

export const groups: MachineGroup[] = [
  { id: "ekstruder", label: "Ekstruder Hatti", machines: ekstruder },
  { id: "dozaj", label: "Dozaj", machines: dozaj },
  { id: "zirhlama", label: "Zirhlama", machines: zirhlama },
  { id: "kangal", label: "Kangal", machines: kangal },
  { id: "aktarma", label: "Aktarma", machines: aktarma },
  { id: "tel-cekme", label: "Tel Cekme", machines: telCekme },
  { id: "iletken-bukum", label: "Iletken Bukum", machines: [...iletkenBukum, ...iletkenBukumDiger] },
  { id: "damar-bukum", label: "Damar Bukum", machines: damarBukum },
  { id: "cv", label: "CV Hatti", machines: cv },
  // Asagidaki gruplarin TREX'te is istasyonu kaydi var ama KEPServerEX'te
  // hic kanali bulunamadi - henuz izlenmiyor.
  { id: "plastikhane", label: "Plastikhane", machines: [] },
  { id: "upcast", label: "Upcast", machines: [] },
  { id: "zayif-akim", label: "Zayif Akim", machines: [] },
  { id: "al-dokum", label: "Al Dokum", machines: [] },
  { id: "kalite-kontrol", label: "Kalite Kontrol", machines: [] },
  { id: "makara-uretim", label: "Makara Uretim", machines: [] },
];

// Toplama servisi (index.ts) icin duz liste.
export const machines: Machine[] = groups.flatMap((g) => g.machines);
