/**
 * Exercitii:
 *
 * Basic
 * 1. adaugati css sa formatati mai bine formularul
 * 2. schimbati locatia in document a formularului
 * 3. stergeti formularul si evenimentele asociate dupa ce adaugam task-ul
 *  HINT: refactor the submit handler
 *
 * Advanced
 * 3. creati un modal simplu pentru form, cu sau fara backdrop
 * 4. adaugati posibilitatea de schimbare a coloanei unde va fi adaugat taskul
 * 5. creati un array de task-uri si actualizati scriptul sa afiseze task-uri din acel array
 */

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
      <i class="fa fa-arrow-up"></i>
    </div>
  </div>
</div>
</div>`;

const backlog = document.querySelector(".board section:first-child .tasks");
const addTaskButton = document.getElementById("addTask");

function compileToNode(domString) {
  const div = document.createElement("div");
  div.innerHTML = domString;

  return div.firstElementChild;
}

function compileTaskTemplate(title, tag, type, template) {
  const compiledTemplate = template
    .replace("{title}", title)
    .replace("{tag}", tag)
    .replace("{taskType}", getTaskTypeIcon(type));
  return compileToNode(compiledTemplate);
}

function addTask(title, tag, type) {
  const task = compileTaskTemplate(title, tag, type, taskTemplate);
  backlog.appendChild(task);

  // addTaskButton.removeEventListener("click", addTask);
}

addTaskButton.addEventListener("click", showForm);

function showForm() {
  const h1 = Array.from(document.getElementsByTagName('h1')).shift();
  let form = document.getElementById("addTaskForm");
  if(typeof(form) != 'undefined' && form!=null){
    alert('Form exists !');
  }else{
      form = h1.insertAdjacentElement("afterend", showAddForm());

    const formModal = document.getElementById('formModal');
    formModal.style.display = "block";

    const modalClose = document.getElementsByClassName("close")[0];
    modalClose.onclick = ()=>{
      formModal.style.display = "none";
      formModal.parentNode.removeChild(formModal);
    } 

    window.onclick = (event)=>{
      if(event.target == formModal){
        formModal.style.display = "none";
        formModal.parentNode.removeChild(formModal);
      }
    }

    form.addEventListener('submit', function submitEventListener(event){
    event.preventDefault();
    const { target }  = event;

    const title = target.querySelector('[name="title"]');
    const tag = target.querySelector('[name="tag"]');
    const type = target.querySelector('[name="type"]')

    // todo validate data!!
    addTask(title.value, tag.value, title.type);
    form.removeEventListener("submit", submitEventListener);
    form.parentNode.removeChild(form);
    });
    //addTaskButton.removeEventListener("click", showForm);
  }
}


function showAddForm() {
  const formString = `
  <div id="formModal" class="modal">
    <div class="modal-content">
    <span class="close">&times;</span>
      <form id="addTaskForm" action="" method="POST">
        <label for="title">Title</label>
        <input type="text" name="title" id="title">

        <label for="type">Type</label>
        <select name="type" id="type" required>
          <option disabled selected value></option>
          <option value="task">Task</option>
          <option value="improvement">Improvement</option>
          <option value="bug">Bug</option>
        </select>

        <label for="tag">Tag</label>
        <select name="tag" id="tag">
          <option disabled selected value></option>
          <option value="low">LOW</option>
          <option value="medium">MEDIUM</option>
          <option value="high">HIGH</option>
          <option value="urgent">URGENT</option>
        </select>
        <button name="submit" type="submit">Add task</button>
      </form>
    </div>
  </div>
  `.trim();

    return compileToNode(formString);
}

const getTaskTypeIcon = taskType =>{
  const iconKeyValuePair = Object.entries(taskTypeIcons)
                      .find(([key, value]) => {
                        console.log(key, value);
                        return key === taskType;
                      });
    return iconKeyValuePair[1];
}