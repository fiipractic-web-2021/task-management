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

class HTMLDoc {
  constructor() {
    this.backlog = document.querySelector(".board section:first-child .tasks");
    this.addTaskBtn = document.getElementById("addTask").addEventListener("click", this.showForm.bind(this));
    this.taskTemplate = `
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
  }

  compileToNode(domString) {
    const div = document.createElement("div");
    div.innerHTML = domString;

    return div.firstElementChild;
  }

  showForm() {
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

    const form = document.body.appendChild(this.compileToNode(formString));
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
      const newTask = new Task(title, type, priority);
      board.addTask(newTask);
      closeAddTaskForm();
    }

    closeButton.addEventListener('click', closeAddTaskForm);
    form.addEventListener('submit', submitTask);
  }

  compileTaskTemplate = (title, tag, taskType, priority, template) => {
    const compiledTemplate = template
      .replace("{title}", title)
      .replace("{tag}", `${taskType.toString().toUpperCase()}-${tag}`)
      .replace("{taskType}", getTaskTypeIcon(taskType))
      .replace("{priority}", getPriorityIcon(priority));
    return this.compileToNode(compiledTemplate);
  }

  addTask(newTask) {
    console.log('this', this)
    const task = this.compileTaskTemplate(newTask.title, newTask.tag, newTask.type, newTask.priority, this.taskTemplate);
    this.backlog.appendChild(task);
  }
}


class Board {
  columns = ['backlog', 'selected', 'inProgress', 'done'];
  constructor() {
    this.columns.forEach(column => {
      this[column] = [];
    });
  }

  addTask(task) {
    this.backlog.push(task);
    htmlDoc.addTask(task);
  }

  get nextTaskId() {
    return this.backlog.length + this.selected.length + this.inProgress.length + this.done.length + 1;
  }
}



class Task {
  constructor(title, type, priority, tag) {
    this.title = title;
    this.type = type;
    this.priority = priority;
    this.tag = board.nextTaskId;
  }
}

const htmlDoc = new HTMLDoc();
const board = new Board();

const getTaskTypeIcon = taskType => {
  console.log('file: app.js ~ line 142 ~ taskType', taskType);
  const iconKeyValuePair = Object.entries(taskTypeIcons).find(([key, value]) => {
    console.log('file: app.js ~ line 144 ~ iconKeyValuePair ~ key, value', key, value);
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