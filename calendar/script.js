document.addEventListener('DOMContentLoaded', function() {
    generateCalendar();
});

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function generateCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const lastDayIndex = new Date(currentYear, currentMonth, daysInMonth).getDay();
    const prevDays = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const nextDays = lastDayIndex === 0 ? 0 : 7 - lastDayIndex;

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekDays.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-header');
        dayElement.textContent = day;
        calendar.appendChild(dayElement);
    });

    document.getElementById('current-month').textContent = new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    for (let i = 0; i < prevDays; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day', 'empty');
        calendar.appendChild(dayElement);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        dayElement.textContent = day;
        dayElement.setAttribute('data-date', `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
        dayElement.onclick = () => openModal(dayElement.getAttribute('data-date'));
        calendar.appendChild(dayElement);
    }

    for (let i = 0; i < nextDays; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day', 'empty');
        calendar.appendChild(dayElement);
    }

    loadEvents();
}

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar();
}

function addEvent() {
    const title = document.getElementById('event-title').value;
    const date = document.getElementById('event-date').value;
    if (title && date) {
        let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];
        events.push({ title, date });
        localStorage.setItem('events', JSON.stringify(events));

        // Clear input fields
        document.getElementById('event-title').value = '';
        document.getElementById('event-date').value = '';

        generateCalendar();
    } else {
        alert('Please enter both title and date.');
    }
}

function loadEvents() {
    const events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];
    events.forEach(event => {
        const dayElement = document.querySelector(`.calendar-day[data-date="${event.date}"]`);
        if (dayElement) {
            const eventElement = document.createElement('div');
            eventElement.classList.add('event');
            eventElement.textContent = event.title;
            dayElement.appendChild(eventElement);
        }
    });
}

function openModal(date) {
    const modal = document.getElementById('modal');
    const modalDate = document.getElementById('modal-date');
    const modalEvents = document.getElementById('modal-events');

    modal.style.display = 'block';
    modalDate.textContent = date;
    modalEvents.innerHTML = '';

    const events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];
    const dayEvents = events.filter(event => event.date === date);

    dayEvents.forEach((event, index) => {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event');
        eventElement.textContent = event.title;

        // Add delete button for each event
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteEvent(date, index);
        eventElement.appendChild(deleteButton);

        modalEvents.appendChild(eventElement);
    });
}

function deleteEvent(date, eventIndex) {
    let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];
    const dayEvents = events.filter(event => event.date === date);
    const eventToRemove = dayEvents[eventIndex];

    events = events.filter(event => !(event.date === eventToRemove.date && event.title === eventToRemove.title));
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
    generateCalendar();
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}
