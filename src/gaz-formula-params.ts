// Gaz sayaci "1 Saat / X (Hesap)" debi formulundeki sabit carpanlar icin ortak
// anahtar/varsayilan tanimlari - server.ts (API) ve alccrline.ts (hesap) ayni
// degerleri kullansin diye tek yerde tutuluyor.
export const GAZ_CARPAN1_KEY = "gazDebiCarpan1"; // Fark(m3) ile carpilan sabit
export const GAZ_CARPAN1_DEFAULT = 2.1;
export const GAZ_CARPAN2_KEY = "gazDebiCarpan2"; // Sonuc buna bolunur ("1 Saat / X")
export const GAZ_CARPAN2_DEFAULT = 4;
