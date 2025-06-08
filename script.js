document.getElementById('coffeeForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const entry = {
        date: new Date().toLocaleString(),
        grind: `${document.getElementById('grindCoarse').value}.${document.getElementById('grindFine').value}`,
        name: document.getElementById('coffeeName').value,
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
            <div><strong>${entry.date}</strong> – Настройка: ${entry.grind}</div>
            <div>Кафе: ${entry.name} (${entry.method})</div>
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

renderHistory();
