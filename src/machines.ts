// tags.txt taramasindan cikarilan gercek uretim tag'leri (Ex1-Ex15 ekstruder hatti).
// nodeId'ler KEPServerEX'teki "ns=2;s=..." adreslemesiyle birebir eslesiyor.
// Ex12 ve Ex15'te cap (cap) tag'i bulunamadi - PLC'de yok ya da farkli adlandirilmis, teyit gerekiyor.

export interface MachineTag {
  label: string;
  nodeId: string;
}

export interface Machine {
  id: string;
  tags: MachineTag[];
}

export const machines: Machine[] = [
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
