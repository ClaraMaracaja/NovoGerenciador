let tasks = [];

function renderTasks(filter = 'todas') {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = ''; 

  let filteredTasks = tasks;
  if (filter === 'concluídas') {
    filteredTasks = tasks.filter(task => task.status);
  } else if (filter === 'pendentes') {
    filteredTasks = tasks.filter(task => !task.status);
  }

  filteredTasks.sort((a, b) => {
    const priorityOrder = { alta: 1, média: 2, baixa: 3 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(a.date) - new Date(b.date); 
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    
    if (task.status) {
      li.classList.add('completed');
    }

    if (task.isUrgent) {
      li.classList.add('urgent');
    }

    li.innerHTML = `
      <span>${task.name} - ${task.date} - Prioridade: ${task.priority}</span>
      <input type="checkbox" ${task.status ? 'checked' : ''} onchange="toggleCompletion(${index})">
      <button class="edit" onclick="editTask(${index})">Editar</button>
      <button class="delete" onclick="deleteTask(${index})">Excluir</button>
    `;
    taskList.appendChild(li);
  });
}

document.getElementById('task-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('task-name').value;
  const date = document.getElementById('task-date').value;
  const priority = document.getElementById('task-priority').value;

  if (name && date && priority) {
    const task = {
      name,
      date,
      priority,
      status: false, 
      isUrgent: new Date(date) <= new Date() 
    };

    tasks.push(task);
    renderTasks(); 
    this.reset(); 
  } else {
    alert('Por favor, preencha todos os campos!');
  }
});

function toggleCompletion(index) {
  tasks[index].status = !tasks[index].status;
  renderTasks(); 
}

function editTask(index) {
  const task = tasks[index];
  const newName = prompt("Novo nome da tarefa", task.name);
  const newDate = prompt("Nova data de conclusão", task.date);
  const newPriority = prompt("Nova prioridade (alta, média, baixa)", task.priority);

  if (newName && newDate && newPriority) {
    task.name = newName;
    task.date = newDate;
    task.priority = newPriority;
    task.isUrgent = new Date(newDate) <= new Date(); 
    renderTasks(); 
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks(); 
}

document.getElementById('filter-btn').addEventListener('click', function () {
  const filterBtn = this;
  if (filterBtn.innerText === 'Mostrar Todas') {
    filterBtn.innerText = 'Mostrar Pendentes';
    renderTasks('todas');
  } else if (filterBtn.innerText === 'Mostrar Pendentes') {
    filterBtn.innerText = 'Mostrar Concluídas';
    renderTasks('pendentes');
  } else {
    filterBtn.innerText = 'Mostrar Todas';
    renderTasks('concluídas');
  }
});

renderTasks();
