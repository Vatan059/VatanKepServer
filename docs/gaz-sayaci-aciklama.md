# Doğal Gaz Sayacı değeri neden sürekli değişiyor?

Rejen ekranındaki "Doğal Gaz Sayacı" göstergesi zaman zaman ~60-130 m³
ile ~7000-7500 m³ arasında ani sıçramalar yapıyor gibi görünüyor. Bu bir
ölçüm/veri hatası değil.

**Bu gösterge kümülatif bir sayaç değil, anlık gaz akış değeri.**
Değer, ana brülör alevi (AnaAlev) YANIK olduğunda gerçek gaz akışını
(~7000-7500 birim), SÖNÜK/bekleme (pilot) durumundayken ise çok düşük
akışı (~60-130 birim) gösteriyor. Brülör devreye girip çıktıkça bu değer
de onunla birlikte anında sıçrıyor - bu, fırının normal ateşleme
döngüsünün beklenen bir sonucu.

Bunu 2026-08-21'de brülör ana alev sinyaliyle saniye hassasiyetinde
karşılaştırarak doğruladık: alev yandığı anda gösterge yüksek banda,
alev söndüğü anda düşük banda geçiyor, defalarca tekrarlanan bir
örüntüyle. Bu korelasyon özellikle **2. brülörün** ana alev sinyali
(`2B_AnaAlev`) için geçerli - 1. brülörün sinyali (`1B_AnaAlev`)
gözlem süresince hep "1" kaldığı için (muhtemelen ayrı bir hazır/
permissive sinyali, ateşleme durumu değil) korelasyona dahil edilmedi.

Bu yüzden dashboard'a artık göstergenin yanına 2. brülörün o anki
durumunu (🔥 Alevli / Boşta) da ekledik - değerin neden değiştiğini
aynı anda görebilirsiniz.

Kısacası: gösterge "bozuk" değil, fırın öyle çalışıyor.
