const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const STORAGE_KEY = "routinecraft_data_v1";

const tableBody = document.getElementById("table-body");
const planTitle = document.getElementById("plan-title");
const saveStatus = document.getElementById("save-status");
const presetBtn = document.getElementById("preset-btn");
const clearBtn = document.getElementById("clear-btn");
const printBtn = document.getElementById("print-btn");
const exportBtn = document.getElementById("export-btn");

// Örnek Hazır Şablon (Tek tıkla tabloyu doldurmak için)
const SAMPLE_PRESET = {
  title: "Haftalık Fit Beslenme & Antrenman Rutini",
  schedule: [
    ["2 Haşlanmış Yumurta, Lor Peyniri, Yeşillik", "Izgara Tavuk Göğsü, Bulgur Pilavı, Yoğurt", "Zeytinyağlı Sebze Yemeği, Kefir", "1 Avuç Çiğ Badem + Üst Vücut Antrenmanı"],
    ["Yulaf Ezmesi, Yoğurt, Tarçın, Ceviz", "Izgara Köfte, Mevsim Salata, Ayran", "Fırında Somon veya Balık, Roka Salatası", "1 Porsiyon Meyve + 45 dk Tempolu Yürüyüş"],
    ["Menemen (Az yağlı), Tam Buğday Ekmeği", "Yeşil Mercimek Yemeği, Bulgur, Cacık", "Izgara Hindi veya Tavuk, Buharda Sebze", "Kefir + Alt Vücut & Core Antrenmanı"],
    ["2 Yumurta Omlet, Beyaz Peynir, Zeytin", "Ton Balıklı Büyük Salata", "Kıymalı Kabak Yemeği, Süzme Yoğurt", "Çiğ Fındık + Dinlenme / Esneme"],
    ["Haşlanmış Yumurta, Avokado, Tam Buğday", "Izgara Et, Fırınlanmış Tatlı Patates, Yoğurt", "Sebze Çorbası, Izgara Hellim Salata", "1 Elma + Full Body Antrenman"],
    ["Serpme Kahvaltı (Peynir, Yumurta, Domates)", "Ev Yapımı Burger veya Izgara Tavuk, Salata", "Hafif Sebze Yemeği, Kefir", "Açık Hava Yürüyüş / Kardiyo"],
    ["Yulaflı Muzlu Pankek, Şekersiz Fıstık Ezmesi", "Fırında Tavuk & Sebze Tepsisi, Yoğurt", "Mercimek Çorbası, Mevsim Salata", "Haftalık Hazırlık (Meal Prep) & Dinlenme"]
  ]
};

// Boş veri şablonu oluştur
function getEmptyData() {
  return {
    title: "Haftalık Beslenme & Antrenman Programı",
    schedule: DAYS.map(() => ["", "", "", ""])
  };
}

// Veriyi LocalStorage'dan çek
function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : SAMPLE_PRESET;
}

// Veriyi LocalStorage'a kaydet
function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  saveStatus.textContent = "⏳ Kaydediliyor...";
  setTimeout(() => {
    saveStatus.textContent = "✓ Otomatik kaydedildi";
  }, 400);
}

// Tabloyu Ekrana Çiz
function renderTable(data) {
  planTitle.value = data.title;
  tableBody.innerHTML = "";

  DAYS.forEach((day, dayIndex) => {
    const tr = document.createElement("tr");

    const dayTd = document.createElement("td");
    dayTd.className = "day-cell";
    dayTd.textContent = day;
    tr.appendChild(dayTd);

    for (let colIndex = 0; colIndex < 4; colIndex++) {
      const td = document.createElement("td");
      td.className = "editable-cell";
      td.contentEditable = "true";
      td.textContent = data.schedule[dayIndex][colIndex] || "";

      // Hücre içi değiştikçe kaydet
      td.addEventListener("input", () => {
        currentData.schedule[dayIndex][colIndex] = td.textContent.trim();
        saveData(currentData);
      });

      tr.appendChild(td);
    }

    tableBody.appendChild(tr);
  });
}

let currentData = loadData();
renderTable(currentData);

// Başlık değiştikçe kaydet
planTitle.addEventListener("input", (e) => {
  currentData.title = e.target.value;
  saveData(currentData);
});

// Örnek Şablon Yükle
presetBtn.addEventListener("click", () => {
  currentData = JSON.parse(JSON.stringify(SAMPLE_PRESET));
  saveData(currentData);
  renderTable(currentData);
});

// Tabloyu Sıfırla
clearBtn.addEventListener("click", () => {
  if (confirm("Tüm tabloyu temizlemek istediğinize emin misiniz?")) {
    currentData = getEmptyData();
    saveData(currentData);
    renderTable(currentData);
  }
});

// A4 PDF Olarak Yazdır
printBtn.addEventListener("click", () => {
  window.print();
});

// JSON Olarak Dışa Aktar
exportBtn.addEventListener("click", () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentData, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "haftalik-program.json");
  downloadAnchor.click();
});