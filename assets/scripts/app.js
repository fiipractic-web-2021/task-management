const taskTemplate = `
  <div id = "{id}" class="task" draggable="true" >
    <div class="taskHeader">
      <i class="fas fa-cog settings"></i>
      <i class="delete-task fa fa-trash icon-red"></i>
      <i class="far fa-edit editTask"></i>
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

const removeTasksFromColumns = () => {
  const columns = document.getElementsByClassName("tasks");
  for (let column of columns) {
    while (column.firstChild) {
      console.log(column.lastChild);
      column.removeChild(column.lastChild);
    }
  }
}

const displayTaskIcons = () => {
  const settingsButtons = document.getElementsByClassName("settings");
  for (const button of settingsButtons) {
    button.addEventListener("click", () => {
      const parent = button.parentElement;
      const deleteButton = parent.getElementsByClassName("delete-task")[0];
      const editButton = parent.getElementsByClassName("editTask")[0];
      deleteButton.classList.toggle('showIcon');
      deleteButton.animate([
        { opacity: 0 },
        { opacity: 1 }
      ], 500);
      editButton.classList.toggle('showIcon');
      editButton.animate([
        { opacity: 0 },
        { opacity: 1 }
      ], 500);
    })
  }
}

const getDataFromAPI = () => {
  fetch("https://60638dd76bc4d60017fab46a.mockapi.io/task")
    .then(response => response.json())
    .then(data => data.forEach(task => {
      addTask(task.title, task.owner, task.description,
        task.type, task.priority, task.status, task.id);
    }))
    .then(() => {
      var editTaskButtons = document.getElementsByClassName("editTask");
      //console.log(editTaskButton);
      for (const button of editTaskButtons) {
        button.addEventListener("click", editTask);
      }

      const tasks = document.getElementsByClassName("task");
      for (const task of tasks) {
        task.addEventListener("dragstart", dragstart_handler, false);
        task.addEventListener("dragend", dragend_handler, false);

        //task.addEventListener("dragleave", dragLeave);
      }
      displayTaskIcons();
      //dragTaskLogic();
    });
}
getDataFromAPI();

const backlog = document.querySelector(".board section:first-child .tasks");
const addTaskButton = document.getElementById("addTask").addEventListener("click", showForm);

function compileToNode(domString) {
  const div = document.createElement("div");
  div.innerHTML = domString;

  return div.firstElementChild;
}

function compileTaskTemplate(id, title, tag, taskType, priority, template) {
  const compiledTemplate = template
    .replace("{id}", id)
    .replace("{title}", title)
    .replace("{tag}", tag)
    .replace("{taskType}", getTaskTypeIcon(taskType))
    .replace("{priority}", getPriorityIcon(priority));
  return compileToNode(compiledTemplate);
}

function compileFormTemplate(title, owner, description, template) {
  const compiledTemplate = template
    .replace("{title}", title)
    .replace("{owner}", owner)
    .replace("{description}", description);
  return compileToNode(compiledTemplate);
}

function addTask(title, owner, description,
  type, priority, status, id) {
  const newTask = {
    id: id,
    owner: owner,
    createdAt: new Date().toLocaleString(),
    taskType: type,
    priority: priority,
    title: title,
    description: description,
    status: status,
    tag: getId(type)

  }
  //console.log(newTask);
  tasks.push(newTask);
  //console.log(tasks);
  const column = document.getElementById(status);
  const tasksInColumn = column.querySelector(".tasks");
  //console.log(column);
  const task = compileTaskTemplate(newTask.id, newTask.title, newTask.tag, newTask.taskType, newTask.priority, taskTemplate);

  tasksInColumn.appendChild(task);

  const deleteTaskButton = task.querySelector(".delete-task");
  deleteTaskButton.addEventListener("click", deleteTask);
}

function editTask(event) {

  const task = event.currentTarget.parentElement.parentElement;
  const taskCode = task.getElementsByClassName("task-code")[0].innerHTML.toString();
  const numberPattern = /\d+/g;
  //for put request location
  const taskId = parseInt(taskCode.match(numberPattern));

  const taskDetails = tasks[taskId - 1];
  console.log(taskDetails);
  const form = document.body.appendChild(compileFormTemplate(taskDetails.title,
    taskDetails.owner, taskDetails.description, formString));
  form.classList.add('show');
  form.animate([
    { opacity: 0 },
    { opacity: 1 }
  ], 500);
  const closeButton = form.querySelector(".close");

  const closeEditTaskForm = () => {
    form.removeEventListener('submit', submitTask);
    closeButton.removeEventListener('click', closeEditTaskForm);
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

    // addTaskForm = document.getElementById('addTaskForm');
    let formData = new FormData();

    formData.append('id', tasks.length + 1);
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

    const editTaskOnAPI = () => {
      fetch("https://60638dd76bc4d60017fab46a.mockapi.io/task/" + taskId,
        {
          body: JSON.stringify(formDataObject),
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          }
        })
        .then(response => response.json())
        .then(result => {
          console.log('Success:', result);
          removeTasksFromColumns();
          closeEditTaskForm();
          tasks.splice(0, tasks.length);
        })
        .then(() => getDataFromAPI())
        .catch(error => {
          console.error('Error:', error);
        });
    };
    editTaskOnAPI();
  }

  closeButton.addEventListener('click', closeEditTaskForm);
  form.addEventListener('submit', submitTask);
}

function deleteTask(event) {
  const result = confirm("Are you sure you want to delete this task? \n" +
    "Operation is irreversible !");
  if (result) {
    event.stopPropagation();
    const task = event.currentTarget.parentElement.parentElement;
    event.currentTarget.removeEventListener("click", deleteTask);
    const remove = () => { task.parentNode.removeChild(task) };
    task.animate([
      { opacity: 1 },
      { opacity: 0 }
    ], 500).onfinish = remove;

    const deleteTaskOnAPI = () => {
      const taskCode = task.getElementsByClassName("task-code")[0].innerHTML.toString();
      const numberPattern = /\d+/g;
      const taskId = parseInt(taskCode.match(numberPattern));

      fetch("https://60638dd76bc4d60017fab46a.mockapi.io/task/" + taskId,
        {
          method: 'DELETE',
        })
        .then(response => response.json())
        .then(result => {
          console.log('Success:', result);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
    deleteTaskOnAPI();
  }
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

    formData.append('id', tasks.length + 1);
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



    const postDataToAPI = () => {
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
          tasks.splice(0, tasks.length);
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

const formString = `
    <div class="backdrop hide">
      <div class="modal">
        <h2 class="title">Add a new task</h2>
        <i class="close fas fa-times fa-2x"></i>
        <form id="addTaskForm" action="" method="POST">
          <label for="title">Title</label>
          <input type="text" name="title" id="title" value="{title}" required>

          <label for="owner">Owner</label>
          <input type="text" name="owner" id="owner" value="{owner}" required>

          <label for="description">Description</label>
          <textarea id="description" name="description" rows="4" required>
            {description}
          </textarea>
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

function showAddForm() {
  return compileFormTemplate("", "", "", formString);
}

// dragging tasks logic

const dragTaskLogic = () => {

  const tasksColumns = document.getElementsByClassName("tasks");
  for (let column of tasksColumns) {
    column.addEventListener("drop", drop_handler);
    column.addEventListener("dragover", dragover_handler);
    // column.addEventListener("dragenter", dragEnter, false);
    //column.addEventListener("dragleave", dragLeave, false);
    /* column.setAttribute("ondrop", "drop_handler(event)");
     column.setAttribute("ondragover", "dragover_handler(event)");*/
  }
}

function dragstart_handler(ev) {
  // Add the target element's id to the data transfer object
  ev.dataTransfer.setData("text/html", ev.target.id);
  ev.dataTransfer.effectAllowed = "move";
  ev.target.style.opacity = 0.4;
  const tasksColumns = document.querySelectorAll(".tasks");
  for (let tasks of tasksColumns) {
    tasks.style.border = "3px dotted #7a8ca8";
  }

}

function changeSection(ev, movedTask) {
  console.log(movedTask);
  console.log(ev.currentTarget.parentElement.id);
  const taskCode = movedTask.getElementsByClassName("task-code")[0].innerHTML.toString();
  const numberPattern = /\d+/g;
  //for put request location
  const taskId = parseInt(taskCode.match(numberPattern));
  const taskNewStatus = ev.currentTarget.parentElement.id;
  const taskDetails = tasks[taskId - 1];
  console.log(taskDetails);
  let formData = new FormData();
  formData.append('id', taskId + 1);
  formData.append('status', taskNewStatus);

  const formDataObject = {};
  formData.forEach((value, key) => formDataObject[key] = value);
  console.log(JSON.stringify(formDataObject));

  const editTaskStatusOnAPI = () => {
    fetch("https://60638dd76bc4d60017fab46a.mockapi.io/task/" + taskId,
      {
        body: JSON.stringify(formDataObject),
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      })
      .then(response => response.json())
      .then(result => {
        console.log('Success:', result);
        /*
        removeTasksFromColumns();
        tasks.splice(0, tasks.length);*/
      })
      .then()
      .catch(error => {
        console.error('Error:', error);
      });
  };
  editTaskStatusOnAPI();
}

function dragend_handler(ev) {
  ev.target.style.opacity = 1;

}

function dragover_handler(ev) {
  ev.preventDefault();

  ev.dataTransfer.dropEffect = "move"
}
function drop_handler(ev) {
  ev.preventDefault();
  ev.currentTarget.style.border = null;
  //if (ev.target.className == "task") {
  const data = ev.dataTransfer.getData("text/html");
  const movedTask = document.getElementById(data);
  ev.currentTarget.appendChild(movedTask);
  console.log(movedTask);
  const tasksColumns = document.querySelectorAll(".tasks");
  for (let tasks of tasksColumns) {
    tasks.style.border = null;
  }
  changeSection(ev, movedTask);
}

var dragCounter = 0;

function dragEnter(ev) {
  ev.preventDefault();
  ev.stopPropagation();
  dragCounter++;
  if (ev.currentTarget.innerHTML == "")
    ev.currentTarget.style.border = "3px dotted red";
  console.log("enter");
  //this.className += ' hovered';
}

function dragLeave(ev) {
  ev.preventDefault();
  if (dragCounter === 0 && ev.currentTarget.innerHTML != "")
    ev.currentTarget.style.border = null;
  console.log("leave");
  //this.classList.remove('hovered');
}

/*const dragTaskLogic = () => {
  const tasksColumns = document.querySelectorAll(".tasks");
  for (let tasks of tasksColumns) {
    new Sortable(tasks, {
      animation: 350
    });
  }
}*/

dragTaskLogic();

