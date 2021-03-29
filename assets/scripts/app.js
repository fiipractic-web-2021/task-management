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
      <i class="fa fa-bookmark"></i>
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

function compileTaskTemplate(title, tag, template) {
  const compiledTemplate = template
    .replace("{title}", title)
    .replace("{tag}", tag);
  return compileToNode(compiledTemplate);
}

function addTask(title, tag) {
  const task = compileTaskTemplate(title, tag, taskTemplate);
  backlog.appendChild(task);

  // addTaskButton.removeEventListener("click", addTask);
}

addTaskButton.addEventListener("click", showForm);

function showForm() {
  const h1 = Array.from(document.getElementsByTagName('h1')).shift();
  const form = h1.insertAdjacentElement("afterend", showAddForm());

  form.addEventListener('submit', function submitEventListener(event){
    event.preventDefault();
    const { target }  = event;

    const title = target.querySelector('[name="title"]');
    const tag = target.querySelector('[name="tag"]');

    // todo validate data!!
    addTask(title.value, tag.value);
    form.removeEventListener("submit", submitEventListener);
    form.parentNode.removeChild(form);
  });
  //addTaskButton.removeEventListener("click", showForm);
}

function showAddForm() {
  const formString = `
    <form id="addTaskForm" action="" method="POST">
      <label for="title">Title</label>
      <input type="text" name="title" id="title">
      <label for="tag">Tag</label>
      <select name="tag" id="tag">
        <option value="low">LOW</option>
        <option value="medium">MEDIUM</option>
        <option value="high">HIGH</option>
        <option value="urgent">URGENT</option>
      </select>
      <button name="submit" type="submit">Add task</button>
    </form>
  `.trim();

    return compileToNode(formString);
}