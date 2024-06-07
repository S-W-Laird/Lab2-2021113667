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

    // 这里是新增的部分，用于显示文字在图标右侧
    var iconText = document.createElement('span');
    iconText.textContent = "Selected"; // 举例文字
    iconText.classList.add('icon-text');
    var selectedIcon = document.querySelector('.icon.selected'); // 假设你有一个被选中的图标
    selectedIcon.appendChild(iconText);
}

function addTodo() {
    const input = document.getElementById('todo-input');
    const ddlInput = document.getElementById('todo-ddl');
    const task = input.value.trim();
    const ddl = ddlInput.value;

    if (task && ddl) {  // 确保任务和日期都不为空
        const todoList = document.getElementById('todo-list');

        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');

        const taskSpan = document.createElement('span');
        taskSpan.textContent = task;

        const ddlInputElement = document.createElement('input');
        ddlInputElement.type = 'date';
        ddlInputElement.value = ddl;
        ddlInputElement.classList.add('todo-ddl');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Done';
        deleteButton.onclick = () => {
            todoList.removeChild(todoItem);
        };

        todoItem.appendChild(taskSpan);
        todoItem.appendChild(ddlInputElement);
        todoItem.appendChild(deleteButton);
        todoList.appendChild(todoItem);

        input.value = '';
        ddlInput.value = '';
    }
}

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