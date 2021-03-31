const taskTemplate = `
  <div class="task">
    <div class="taskHeader">
      <i class="delete-task fa fa-trash icon-red"></i>
      <p class="task-title">{title}</p>
    </div>
    <div class="task-details">
      <div class="task-info">
        <div class="avatar"></div>
        <p class="task-code">
          {tag}
        </p>
      </div>
      <div class="task-status">
        <div class="task-type">
          <i class="fa {taskType}"></i>
        </div>
        <div class="task-priority">
          <i class="fa fa-arrow-up {priority}"></i>
        </div>
      </div>
    </div>
  </div>`;

const taskTypeIcons = {
  'task': 'fa-bookmark icon-blue',
  'improvement': 'fa-chart-line icon-teal',
  'bug': 'fa-bug icon-red'
};

const priorityIcons = {
  'low': 'icon-green',
  'medium': 'icon-yellow',
  'high': 'icon-orange',
  'urgent': 'icon-red',
};

const tasks = [];


const getTaskTypeIcon = taskType => {
  const iconKeyValuePair = Object.entries(taskTypeIcons).find(([key, value]) => {
    return key === taskType; // since it's a one-liner there's no need for {} and 'return' keyword
  });
  return iconKeyValuePair[1]; // index 0 is the key, index 1 is the value in which we are interested
}

const getPriorityIcon = priority => {
  const iconKeyValuePair = Object.entries(priorityIcons).find(([key, value]) => {
    return key === priority; // since it's a one-liner there's no need for {} and 'return' keyword
  });
  return iconKeyValuePair[1]; // index 0 is the key, index 1 is the value in which we are interested
}

// adding all static tasks to populate sections
/*tasks.forEach((task) => {
    addTask(...Object.values(task))
});*/

// adding delete task option for static tasks
document.querySelectorAll(".delete-task").forEach(deleteTaskButton => {
  deleteTaskButton.addEventListener("click", deleteTask);
});

const getDataFromAPI = () => {
  fetch("https://60638dd76bc4d60017fab46a.mockapi.io/task")
    .then(response => response.json())
    .then(data => data.forEach(task => {
      addTask(task.title, task.type, task.priority, task.status);
    }));
}
getDataFromAPI();

const backlog = document.querySelector(".board section:first-child .tasks");
const addTaskButton = document.getElementById("addTask").addEventListener("click", showForm);

function compileToNode(domString) {
  const div = document.createElement("div");
  div.innerHTML = domString;

  return div.firstElementChild;
}

function compileTaskTemplate(title, tag, taskType, priority, template) {
  const compiledTemplate = template
    .replace("{title}", title)
    .replace("{tag}", tag)
    .replace("{taskType}", getTaskTypeIcon(taskType))
    .replace("{priority}", getPriorityIcon(priority));
  return compileToNode(compiledTemplate);
}

function addTask(title, taskType, priority, columnName, owner, description) {
  const newTask = {
    title: title,
    taskType: taskType,
    priority: priority,
    tag: getId(taskType),
    createdAt: new Date().toLocaleString(),
    owner: owner,
    description: description
  }
  //console.log(newTask);
  tasks.push(newTask);
  //console.log(tasks);
  const column = document.getElementById(columnName);
  const tasksInColumn = column.querySelector(".tasks");
  //console.log(column);
  const task = compileTaskTemplate(newTask.title, newTask.tag, newTask.taskType, newTask.priority, taskTemplate);

  tasksInColumn.appendChild(task);

  const deleteTaskButton = task.querySelector(".delete-task");
  deleteTaskButton.addEventListener("click", deleteTask);
}

function deleteTask(event) {
  event.stopPropagation();
  const task = event.currentTarget.parentElement.parentElement;
  event.currentTarget.removeEventListener("click", deleteTask);
  const remove = () => { task.parentNode.removeChild(task) };
  task.animate([
    { opacity: 1 },
    { opacity: 0 }
  ], 500).onfinish = remove;
};



function showForm() {
  const form = document.body.appendChild(showAddForm());
  form.classList.add('show');
  form.animate([
    { opacity: 0 },
    { opacity: 1 }
  ], 500);
  const closeButton = form.querySelector(".close");

  const closeAddTaskForm = () => {
    form.removeEventListener('submit', submitTask);
    closeButton.removeEventListener('click', closeAddTaskForm);
    form.classList.remove('show');
  }

  const submitTask = (event) => {
    event.preventDefault();

    const { target } = event;

    const title = target.querySelector('[name="title"]').value;
    const type = target.querySelector('[name="type"]').value;
    const priority = target.querySelector('[name="priority"]').value;
    const column = target.querySelector('[name="status"]').value;
    const owner = target.querySelector('[name="owner"]').value;
    const description = target.querySelector('[name="description"]').value;
    const creationDate = new Date().toLocaleString();
    //addTask(title, type, priority, column);

    const addTaskForm = document.getElementById('addTaskForm');
    let formData = new FormData();

    formData.append('createdAt', creationDate);
    formData.append('owner', owner);
    formData.append('type', type);
    formData.append('priority', priority);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('status', column);

    const formDataObject = {};
    formData.forEach((value, key) => formDataObject[key] = value);
    console.log(JSON.stringify(formDataObject));

    const columns = document.getElementsByClassName("tasks");
    const removeTasksFromColumns = () => {
      for (let column of columns) {
        while (column.firstChild) {
          console.log(column.lastChild);
          column.removeChild(column.lastChild);
        }
      }
    }

    const postDataToAPI = () =>{
    fetch("https://60638dd76bc4d60017fab46a.mockapi.io/task",
      {
        body: JSON.stringify(formDataObject),
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      })
      .then(response => response.json())
      .then(result => {
        console.log('Success:', result);
        removeTasksFromColumns();
      })
      .then(() => getDataFromAPI())
      .catch(error => {
        console.error('Error:', error);
      });
    };
    postDataToAPI();
    closeAddTaskForm();

    
  }

  closeButton.addEventListener('click', closeAddTaskForm);
  form.addEventListener('submit', submitTask);
}

function getId(taskType) {
  const allTasks = tasks.length;
  // subtracting the number of statically typed tasks, which is currently 4
  //const taskNumber = allTasks + 1 -4;
  const taskNumber = allTasks + 1;

  switch (taskType) {
    case 'task':
      return 'TASK-' + taskNumber;
    case 'improvement':
      return `IMPROVEMENT-${taskNumber}`;
    default:
      return 'BUG' + '-' + taskNumber;
  }
}


function showAddForm() {
  const formString = `
    <div class="backdrop hide">
      <div class="modal">
        <h2 class="title">Add a new task</h2>
        <i class="close fas fa-times fa-2x"></i>
        <form id="addTaskForm" action="" method="POST">
          <label for="title">Title</label>
          <input type="text" name="title" id="title" required>

          <label for="owner">Owner</label>
          <input type="text" name="owner" id="owner" required>

          <label for="description">Description</label>
          <input type="text" name="description" id="description" required>

          <label for="type">Type</label>
          <select name="type" id="type" required>
            <option disabled selected value></option>
            <option value="task">Task</option>
            <option value="improvement">Improvement</option>
            <option value="bug">Bug</option>
          </select>


          <label for="priority">Priority</label>
          <select name="priority" id="priority" required>
            <option disabled selected value></option>
            <option value="low">LOW</option>
            <option value="medium">MEDIUM</option>
            <option value="high">HIGH</option>
            <option value="urgent">URGENT</option>
          </select>

          <label for="status">Column</label>
          <select name ="status" id="status" required>
            <option disabled selected value></option>
            <option value="backlog">Backlog</option>
            <option value="selected">Selected for development</option>
            <option value="inprogress">In progress</option>
            <option value="done">Done</option>
          </select>

          <button class="btn-add" name="submit" type="submit">Add task</button>
        </form>
      </div>
    </div>
    `.trim();

  return compileToNode(formString);
}