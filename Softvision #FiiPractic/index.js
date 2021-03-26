
/**
 * Exercitii:
 *
 * Basic
 * 1. folositi alte metode de a selecta elementele folosite
 * 2. adaugati clasa "rotate" la buton, cand facem click pe el
 * 3. cum putem modifca functia "compileTaskTemplate" pentru a stabili ce iconite de status sa apara?
 * 4. cum adaugam un task in coloana "Selected for development" ?
 * 5. adaugati un event listener pentru a sterge un task
 *
 * Advanced
 * 6. scoateti clasa "rotate" de la buton, dupa 1 secunda
 *  HINT: setTimeout(function() { code to execute after approx 1 second }, 1000) - 1000ms = 1s
 * 7. rescrieti taskTemplate folosind createElement si appendChild,
 *  pentru a obtine aceeasi structura HTML
 * 8. putem folosi un event listener pe document, in locul celui de pe buton,
 *  pentru a adauga un task? Cum?
 * 9. faceti un efect fadeIn/fadeOut la adaugare/stergere task
 */

/*const myTaskTemplate = document.createElement('div');
const paragraph = document.createElement('p');
var classAttr = document.createAttribute('class');
var divTag = document.createElement('div');
classAttr.value = 'task';
myTaskTemplate.setAttributeNode(classAttr);
classAttr.value = 'task-title';
paragraph.setAttributeNode(classAttr);
paragraph.textContent = "{title}";
myTaskTemplate.appendChild(paragraph);

classAttr.value = 'task-details';*/

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
      <i class="{type}"></i>
    </div>
    <div class="task-priority">
      <i class="{priority}"></i>
    </div>
  </div>
</div>
</div>`;

var backlog = document.querySelector(".board section:nth-child(2) .tasks");
const sections = document.querySelectorAll("section");
var taskStack = [];

for (let sec of sections) {
  sec.addEventListener("click", (e) => {
    e.stopPropagation();
    backlog = e.currentTarget.querySelector(".tasks");
    console.log(e.currentTarget);
  });
}
/*document.addEventListener("click", (e) => {
  e.stopPropagation();
  console.log(e.target); // to get the element
});*/
const removeTaskButton = document.getElementById("removeTask");

const addTaskButton = document.getElementById("addTask");

document.querySelectorAll("section").forEach((div) => {
  div.style.cssText = "background-color: rgb(181 175 175); border: 1px solid #000";
});

function compileTaskTemplate(title, tag, type, priority, template) {
  const div = document.createElement("div");
  const compiledTemplate = template
    .replace("{title}", title)
    .replace("{tag}", tag)
    .replace("{type}", type)
    .replace("{priority}", priority);

  div.innerHTML = compiledTemplate;
  return div.firstElementChild;
}

function addTask(event) {
  event.stopPropagation();
  const task = compileTaskTemplate(
    "new task",
    "ugent-1",
    "fab fa-android",
    "fab fa-apple",
    taskTemplate
  );
  task.className += " fade-in";
  let data = [backlog, task];
  taskStack.push(data);
  backlog.appendChild(task);

  //addTaskButton.removeEventListener("click", addTask);
}

addTaskButton.addEventListener("click", addTask);

function removeTask(event) {
  event.stopPropagation();
  let data = taskStack.pop();
  if(data !=undefined){
    let backlog = data[0];
    console.log(backlog);
  
  const task = data[1];
  console.log(task);
  //task.classList.remove("fade-in");
  if (task != undefined){
    task.className += " fade-out";
  }
  
  setTimeout(() => {
    
      backlog.removeChild(task);
    
  }, 2000);
  }
}

removeTaskButton.addEventListener("click", removeTask);

function rotateFunction(event) {
  event.stopPropagation();
  addTaskButton.className += " rotate";
  setTimeout(() => {
    addTaskButton.classList.remove("rotate");
  }, 1000);
}

addTaskButton.addEventListener("click", rotateFunction);
