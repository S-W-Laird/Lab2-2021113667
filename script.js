// 侧边栏功能
const sidebar = document.getElementById('sidebar');

sidebar.addEventListener('mouseenter', () => {
    sidebar.classList.add('expanded');
});

sidebar.addEventListener('mouseleave', () => {
    sidebar.classList.remove('expanded');
});

function showContent(sectionId) {
    var sections = document.getElementsByClassName('content-section');
    for (var i = 0; i < sections.length; i++) {
        sections[i].style.display = 'none';
    }
    document.getElementById(sectionId).style.display = 'block';

    // 移除所有工具栏项的active类
    var sidebarItems = document.getElementsByClassName('sidebar-item');
    for (var i = 0; i < sidebarItems.length; i++) {
        sidebarItems[i].classList.remove('active');
    }

    // 添加active类到当前内容页对应的工具栏项
    var currentSidebarItem = document.querySelector(`.sidebar-item[data-section="${sectionId}"]`);
    if (currentSidebarItem) {
        currentSidebarItem.classList.add('active');
    }

    if (sectionId === 'calendar') {
        generateCalendar();
    }
}

// To-Do列表功能
function addTodo() {
    const input = document.getElementById('todo-input');
    const ddlInput = document.getElementById('todo-ddl');
    const task = input.value.trim();
    const ddl = ddlInput.value;

    if (task && ddl) {  // 确保任务和日期都不为空
        let todos = getStoredTodos();
        todos.push({ task, ddl });
        localStorage.setItem('todos', JSON.stringify(todos));

        renderTodoList();
        input.value = '';
        ddlInput.value = '';
    } else {
        alert('Please enter both task and deadline.');
    }
}

function getStoredTodos() {
    return localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
}

function loadTodos() {
    renderTodoList();
}

function renderTodoList() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    const todos = getStoredTodos();
    todos.forEach((todo, index) => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');

        const taskSpan = document.createElement('span');
        taskSpan.textContent = todo.task;

        const ddlInputElement = document.createElement('input');
        ddlInputElement.type = 'date';
        ddlInputElement.value = todo.ddl;
        ddlInputElement.classList.add('todo-ddl');
        
        const deleteButton = document.createElement('img');
        deleteButton.src = 'img/Done.png'; // 设置你的图片的URL
        deleteButton.style.backgroundColor = 'transparent';
        deleteButton.classList.add('done-button'); // 添加CSS类
        deleteButton.style.border = 'none';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.width = '24px';
        deleteButton.style.height = '24px';
        deleteButton.onclick = () => {
            deleteTodo(index);
        };

        todoItem.appendChild(taskSpan);
        todoItem.appendChild(ddlInputElement);
        todoItem.appendChild(deleteButton);
        todoList.appendChild(todoItem);
    });
}

function deleteTodo(index) {
    let todos = getStoredTodos();
    todos.splice(index, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodoList();
}

// 聊天功能
function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (message) {
        const chatMessages = document.querySelector('.chat-messages');

        // Create user message bubble
        const userMessageElement = document.createElement('div');
        userMessageElement.classList.add('message', 'user');
        userMessageElement.textContent = message;
        chatMessages.appendChild(userMessageElement);

        // Simulate bot response for demonstration
        const botResponse = "This is a simulated response from ChatGPT.";
        const botMessageElement = document.createElement('div');
        botMessageElement.classList.add('message', 'bot');
        botMessageElement.textContent = botResponse;
        chatMessages.appendChild(botMessageElement);

        // Scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Clear input
        input.value = '';
    }
}

// 日历功能
document.addEventListener('DOMContentLoaded', () => {
    initializeSidebar();
    initializeCalendar();
    loadTodos();  // 加载To-Do列表
});

function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.addEventListener('mouseenter', () => sidebar.classList.add('expanded'));
    sidebar.addEventListener('mouseleave', () => sidebar.classList.remove('expanded'));
}

function initializeCalendar() {
    let currentDate = new Date();
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
}

function changeMonth(offset) {
    let currentDate = new Date(document.getElementById('current-month').dataset.date);
    currentDate.setMonth(currentDate.getMonth() + offset);
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
}

function renderCalendar(year, month) {
    const calendar = document.getElementById('calendar-grid');
    calendar.innerHTML = '';

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDayIndex = new Date(year, month, daysInMonth).getDay();
    const prevDays = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const nextDays = lastDayIndex === 0 ? 0 : 7 - lastDayIndex;

    renderWeekDays(calendar);
    renderEmptyDays(calendar, prevDays);
    renderMonthDays(calendar, year, month, daysInMonth);
    renderEmptyDays(calendar, nextDays);

    const currentMonthSpan = document.getElementById('current-month');
    currentMonthSpan.textContent = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    currentMonthSpan.dataset.date = new Date(year, month).toISOString();

    loadEvents();
}

function renderWeekDays(calendar) {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekDays.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-header');
        dayElement.textContent = day;
        calendar.appendChild(dayElement);
    });
}

function renderEmptyDays(calendar, count) {
    for (let i = 0; i < count; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day', 'empty');
        calendar.appendChild(dayElement);
    }
}

function renderMonthDays(calendar, year, month, daysInMonth) {
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        dayElement.textContent = day;
        dayElement.setAttribute('data-date', `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
        dayElement.onclick = () => openModal(dayElement.getAttribute('data-date'));
        calendar.appendChild(dayElement);
    }
}

function addEvent() {
    const title = document.getElementById('event-title').value;
    const date = document.getElementById('event-date').value;

    if (title && date) {
        let events = getStoredEvents();
        events.push({ title, date });
        localStorage.setItem('events', JSON.stringify(events));
        clearEventForm();
        renderCalendar(new Date(date).getFullYear(), new Date(date).getMonth());
    } else {
        alert('Please enter both title and date.');
    }
}

function clearEventForm() {
    document.getElementById('event-title').value = '';
    document.getElementById('event-date').value = '';
}

function getStoredEvents() {
    return localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];
}

function loadEvents() {
    const events = getStoredEvents();
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

    const events = getStoredEvents();
    const dayEvents = events.filter(event => event.date === date);

    dayEvents.forEach((event, index) => {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event');
        eventElement.textContent = event.title;

        const deleteButton = document.createElement('img');
        deleteButton.src = 'img/Done.png'; // 设置你的图片的URL
        deleteButton.style.backgroundColor = 'transparent';
        deleteButton.classList.add('done-button'); // 添加CSS类
        deleteButton.style.border = 'none';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.width = '24px';
        deleteButton.style.height = '24px';
        deleteButton.onclick = () => deleteEvent(date, index);
        eventElement.appendChild(deleteButton);

        modalEvents.appendChild(eventElement);
    });
}

function deleteEvent(date, eventIndex) {
    let events = getStoredEvents();
    const dayEvents = events.filter(event => event.date === date);
    const eventToRemove = dayEvents[eventIndex];

    events = events.filter(event => !(event.date === eventToRemove.date && event.title === eventToRemove.title));
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
    renderCalendar(new Date(date).getFullYear(), new Date(date).getMonth());
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

let meetings = []; // 全局变量，用于存储所有会议

// 读取剪贴板内容并识别会议信息
async function readClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        if (text) {
            parseMeetingInfo(text);
        } else {
            alert('Clipboard is empty');
        }
    } catch (err) {
        alert('Failed to read clipboard contents: ' + err);
    }
}

function parseMeetingInfo(text) {
    // 假设剪贴板内容包含会议的日期、时间、名称和ID，格式为：YYYY-MM-DD HH:mm - Meeting Name - Meeting ID
    const lines = text.split('\n');
    if (lines.length > 0) {
        const parts = lines[0].split(' - ');
        newMeeting = {
            datetime: new Date(parts[0]),  // 日期时间
            name: parts[1],  // 会议名称
            id: parts[2]     // 会议ID
        };
        showModal(newMeeting);
    }
}

function showModal(meeting) {
    document.getElementById('modal-date').value = meeting.datetime.toISOString().substring(0, 16);
    document.getElementById('modal-name').value = meeting.name;
    document.getElementById('modal-id').value = meeting.id;
    document.getElementById('confirmation-modal').style.display = 'block';
}

function closeMeetingModal() {
    document.getElementById('confirmation-modal').style.display = 'none';
}

function confirmMeeting() {
    const datetime = document.getElementById('modal-date').value;
    const name = document.getElementById('modal-name').value;
    const id = document.getElementById('modal-id').value;

    const newMeeting = {
        datetime: new Date(datetime),
        name: name,
        id: id
    };

    meetings.push(newMeeting);
    renderMeetingList(meetings);
    closeMeetingModal();
}

function showAddMeetingModal() {
    document.getElementById('add-meeting-modal').style.display = 'block';
}

function closeAddMeetingModal() {
    document.getElementById('add-meeting-modal').style.display = 'none';
}

function addMeeting() {
    const datetime = document.getElementById('add-modal-date').value;
    const name = document.getElementById('add-modal-name').value;
    const id = document.getElementById('add-modal-id').value;

    const newMeeting = {
        datetime: new Date(datetime),
        name: name,
        id: id
    };

    meetings.push(newMeeting);
    renderMeetingList(meetings);
    closeAddMeetingModal();
}

function renderMeetingList(meetings) {
    const upcomingMeetingsList = document.getElementById('upcoming-meetings');
    const pastMeetingsList = document.getElementById('past-meetings');
    upcomingMeetingsList.innerHTML = ''; // 清空当前会议列表
    pastMeetingsList.innerHTML = ''; // 清空当前会议列表

    const now = new Date();

    meetings.forEach((meeting, index) => {
        const daysUntilMeeting = Math.abs(Math.ceil((meeting.datetime - now) / (1000 * 60 * 60 * 24)));
        const cardColor = getCardColor(daysUntilMeeting);

        const card = document.createElement('div');
        card.classList.add('meeting-card');
        card.style.backgroundColor = cardColor;

        const doneButton = document.createElement('img');
        doneButton.src = 'img/Done.png'; // 设置你的图片的URL
        doneButton.style.backgroundColor = 'transparent';
        doneButton.classList.add('done-button'); // 添加CSS类
        doneButton.style.border = 'none';
        doneButton.style.cursor = 'pointer';
        doneButton.style.width = '24px';
        doneButton.style.height = '24px';
        doneButton.onclick = () => deleteMeeting(index);

        card.appendChild(doneButton); // 将完成图标添加到卡片中

        const time = document.createElement('div');
        time.classList.add('meeting-time');
        time.textContent = meeting.datetime.toLocaleString();

        const info = document.createElement('div');
        info.classList.add('meeting-info');
        info.textContent = `Meeting with ${meeting.name}`;

        const id = document.createElement('div');
        id.classList.add('meeting-id');
        id.textContent = `ID: ${meeting.id}`;

        card.appendChild(time);
        card.appendChild(info);
        card.appendChild(id);

        if (meeting.datetime >= now) {
            upcomingMeetingsList.appendChild(card);
        } else {
            const viewButton = document.createElement('img'); // 创建查看图标按钮
            viewButton.src = 'img/View.png'; // 设置你的图片的URL
            viewButton.style.backgroundColor = 'transparent';
            viewButton.classList.add('view-button'); // 添加CSS类
            viewButton.style.border = 'none';
            viewButton.style.cursor = 'pointer';
            viewButton.style.marginRight = '36px';
            viewButton.style.width = '24px';
            viewButton.style.height = '24px';
            viewButton.onclick = () => viewMeeting(index);

            card.appendChild(viewButton); // 将查看图标添加到卡片中
            pastMeetingsList.appendChild(card);
        }
    });
}

function deleteMeeting(index) {
    meetings.splice(index, 1);
    renderMeetingList(meetings);
}

function getCardColor(daysUntilMeeting) {
    const maxDays = 30; // 最大时间范围（例如30天）
    const percentage = Math.min(daysUntilMeeting / maxDays, 1);
    const r = Math.floor(255 - 6 * (1 - percentage));
    const g = Math.floor(255 - 52 * (1 - percentage));
    const b = Math.floor(255 - 116 * (1 - percentage));
    return `rgb(${r}, ${g}, ${b})`;
}

// 在DOM加载完成后初始化会议列表
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-meeting-btn').onclick = showAddMeetingModal;
});
