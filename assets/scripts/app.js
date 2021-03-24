const taskTemplate = `
  <div class="task">
    <p class="task-title">{title}</p>
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

const tasks = {
  backlog: [],
  selected: [],
  inProgress: [],
  done: []
};

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

function addTask(title, taskType, priority) {
  const newTask = {
    title: title,
    taskType: taskType,
    priority: priority,
    tag: getId(taskType)
  }
  tasks.backlog.push(newTask);
  const task = compileTaskTemplate(newTask.title, newTask.tag, newTask.taskType, newTask.priority, taskTemplate);
  backlog.appendChild(task);
}


function showForm() {
  const form = document.body.appendChild(showAddForm());
  form.classList.add('show');
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
    addTask(title, type, priority);
    closeAddTaskForm();
  }

  closeButton.addEventListener('click', closeAddTaskForm);
  form.addEventListener('submit', submitTask);
}

function getId(taskType) {
  const allTasks = Object.keys(tasks).reduce((accumulator, currentValue) => {
    return accumulator += tasks[currentValue].length;
  }, 0);
  // the id for a new task will be based on the number of total tasks in the board
  // with reduce, we get the total number of tasks
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


function showAddForm() {
  const formString = `
    <div class="backdrop hide">
      <div class="modal">
        <h2 class="title">Add a new task</h2>
        <i class="close fas fa-times fa-2x"></i>
        <form id="addTaskForm" action="" method="POST">
          <label for="title">Title</label>
          <input type="text" name="title" id="title" required>

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
          <button class="btn-add" name="submit" type="submit">Add task</button>
        </form>
      </div>
    </div>
    `.trim();

  return compileToNode(formString);
}