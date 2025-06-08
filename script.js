function formatClicksToText(clicks) {
  const rotation = Math.floor(clicks / 60);
  const number = Math.floor((clicks % 60) / 10);
  const subClick = clicks % 10;
  return `${rotation}.${number}.${subClick}`;
}

function updateGrindDisplay(val) {
  document.getElementById("grindValue").textContent = formatClicksToText(val);
  document.getElementById("grindClicks").textContent = val;
}

document.addEventListener('DOMContentLoaded', () => {
  $("#grindKnob").roundSlider({
    radius: 100,
    width: 16,
    handleSize: "+16",
    sliderType: "min-range",
    value: 180,
    min: 0,
    max: 359,
    step: 1,
    circleShape: "full",
    startAngle: 315,
    drag: function (e) { updateGrindDisplay(e.value); },
    change: function (e) { updateGrindDisplay(e.value); }
  });

  updateGrindDisplay(180);

  document.getElementById('coffeeForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const clicks = $("#grindKnob").data("roundSlider").getValue();

    const entry = {
      date: new Date().toLocaleString(),
      grindClicks: clicks,
      grindText: formatClicksToText(clicks),
      name: document.getElementById('coffeeName').value,
      origin: document.getElementById('coffeeOrigin').value,
      process: document.getElementById('coffeeProcess').value,
      roaster: document.getElementById('coffeeRoaster').value,
      method: document.getElementById('brewMethod').value,
      dose: document.getElementById('dose').value,
      water: document.getElementById('water').value,
      time: document.getElementById('brewTime').value,
      taste: document.getElementById('taste').value,
      notes: document.getElementById('notes').value
    };

    const history = JSON.parse(localStorage.getItem('coffeeHistory') || '[]');
    history.unshift(entry);
    localStorage.setItem('coffeeHistory', JSON.stringify(history));
    this.reset();
    $("#grindKnob").roundSlider("setValue", 180);
    updateGrindDisplay(180);
    renderHistory();
  });

  renderHistory();
});

function renderHistory() {
  const history = JSON.parse(localStorage.getItem('coffeeHistory') || '[]');
  const container = document.getElementById('history');
  container.innerHTML = '';

  history.forEach((entry, index) => {
    const div = document.createElement('div');
    div.className = 'bg-white p-4 rounded shadow';

    div.innerHTML = `
      <div><strong>${entry.date}</strong> – Настройка: ${entry.grindText} (${entry.grindClicks} клика)</div>
      <div><strong>${entry.name}</strong> (${entry.method})</div>
      <div>Произход: ${entry.origin} | Процес: ${entry.process} | Ростер: ${entry.roaster}</div>
      <div>Доза: ${entry.dose}г | Вода: ${entry.water}г | Време: ${entry.time}</div>
      <div>Оценка: ${entry.taste}</div>
      <div>Бележки: ${entry.notes}</div>
      <button onclick="deleteEntry(${index})" class="text-red-500 mt-2">Изтрий</button>
    `;
    container.appendChild(div);
  });
}

function deleteEntry(index) {
  const history = JSON.parse(localStorage.getItem('coffeeHistory') || '[]');
  history.splice(index, 1);
  localStorage.setItem('coffeeHistory', JSON.stringify(history));
  renderHistory();
}

function exportToCSV() {
  const history = JSON.parse(localStorage.getItem('coffeeHistory') || '[]');
  if (history.length === 0) {
    alert("Няма записи за експортиране.");
    return;
  }

  const header = Object.keys(history[0]);
  const rows = history.map(entry =>
    header.map(key => `"${(entry[key] || "").replace(/"/g, '""')}"`)
  );
  const csvContent = [header.join(","), ...rows.map(r => r.join(","))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "coffee_journal.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
