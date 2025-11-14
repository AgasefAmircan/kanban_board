// header section elements
const searchInput = document.getElementById("search");
const priorityFilter = document.getElementById("priority-filter");
const sortBySelect = document.getElementById("sort-by");

// main section elements
const todoListEl = document.getElementById("todo-list");
const progressListEl = document.getElementById("progress-list");
const doneListEl = document.getElementById("done-list");

// modal section elements
const openModalBtn = document.getElementById("open-modal");
const modal = document.getElementById("task-modal");
const closeModal = document.getElementById("close-modal");
const cancelBtn = document.getElementById("cancel-btn");
const form = document.getElementById("task-form");
const modalTitle = document.getElementById("modal-title");
const editIdEl = document.getElementById("edit-id");

// fetch task from localStorage
let tasks = JSON.parse(localStorage.getItem("kanbanTasks")) || [];

// intial filter values
let filters = {
  search: "",
  priority: "all",
  sort: "none",
};

// save task details to localstorage
const save = () => localStorage.setItem("kanbanTasks", JSON.stringify(tasks));

const generateId = () => Date.now() + Math.floor(Math.random() * 999);

// modal controls
openModalBtn.addEventListener("click", () => openAddModal());
closeModal.addEventListener("click", closeModalFn);
cancelBtn.addEventListener("click", closeModalFn);

// open modal func
function openAddModal() {
  modalTitle.textContent = "Add Task";
  editIdEl.value = "";
  form.reset();
  modal.classList.remove("hidden");
}

// open edit modal func
function openEditModal(task) {
  modalTitle.textContent = "Edit Task";
  editIdEl.value = task.id;
  document.getElementById("title").value = task.title;
  document.getElementById("description").value = task.description;
  document.getElementById("priority").value = task.priority;
  document.getElementById("dueDate").value = task.dueDate;
  modal.classList.remove("hidden");
}

// close modal func
function closeModalFn() {
  modal.classList.add("hidden");
  form.reset();
  editIdEl.value = "";
}

// add || edit functionality for form
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = editIdEl.value ? Number(editIdEl.value) : null;
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const priority = document.getElementById("priority").value;
  const dueDate = document.getElementById("dueDate").value;

  if (!title || !priority || !dueDate) return;

  //   if task exist , edit it, otherwise...
  if (id) {
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx > -1) {
      tasks[idx] = { ...tasks[idx], title, description, priority, dueDate };
    }
  }
  //  .... create new task
  else {
    const newTask = {
      id: generateId(),
      title,
      description,
      priority,
      dueDate,
      status: "todo",
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
  }

  save();
  closeModalFn();
  render();
});

// delete task
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  save();
  render();
}

// update status with drag and drop
function updateTaskStatus(id, status) {
  const t = tasks.find((t) => t.id === id);
  if (t) {
    t.status = status;
    save();
    render();
  }
}

// search event
searchInput.addEventListener("input", (e) => {
  filters.search = e.target.value.trim().toLowerCase();
  render();
});

// priority event
priorityFilter.addEventListener("change", (e) => {
  filters.priority = e.target.value;
  render();
});

// due date event
sortBySelect.addEventListener("change", (e) => {
  filters.sort = e.target.value;
  render();
});

// drag functionality
let dragId = null;
function handleDragStart(e) {
  e.target.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", e.target.innerHTML);
}
function handleDragEnd() {
  this.classList.remove("dragging");
  dragId = null;
}

// board drop targets
document.querySelectorAll(".task-list").forEach((list) => {
  list.addEventListener("dragover", (e) => {
    e.preventDefault();
    list.classList.add("drag-over");
  });
  list.addEventListener("dragleave", () => list.classList.remove("drag-over"));
  list.addEventListener("drop", (e) => {
    e.preventDefault();
    list.classList.remove("drag-over");
    // prefer dataTransfer but fallback to global var
    const data = e.dataTransfer?.getData("text/plain");
    const id = data ? Number(data) : dragId;
    const status = list.parentElement.dataset.status;
    if (!Number.isNaN(id)) updateTaskStatus(id, status);
  });
});

// --- Rendering
function applyFilters(items) {
  let out = items.slice();

  // search filter
  if (filters.search) {
    out = out.filter((t) => t.title.toLowerCase().includes(filters.search));
  }

  // priority filter
  if (filters.priority && filters.priority !== "all") {
    out = out.filter((t) => t.priority === filters.priority);
  }

  // date sort filter
  if (filters.sort === "asc") {
    out.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  } else if (filters.sort === "desc") {
    out.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
  } else {
    out.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return out;
}

function createTaskCard(task) {
  const card = document.createElement("div");
  card.className = "task-card";
  card.draggable = true;
  card.dataset.id = task.id;

  const today = new Date();
  const due = new Date(task.dueDate + "T23:59:59");
  const isOverdue = due < today && task.status !== "done";

  card.innerHTML = `
    <div class="task-header">
      <h4>${task.title}</h4>
      <div class="task-actions">
        <button class="edit-btn" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="delete-btn" title="Delete"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
    <p class="description">${task.description}</p>
    <div class="task-footer">
      <span class="priority ${task.priority.toLowerCase()}">${
    task.priority
  }</span>
      <span class="due-date ${isOverdue ? "overdue" : ""}">${
    task.dueDate
  }</span>
    </div>
  `;

  card
    .querySelector(".delete-btn")
    .addEventListener("click", () => deleteTask(task.id));
  card
    .querySelector(".edit-btn")
    .addEventListener("click", () => openEditModal(task));

  card.addEventListener("dragstart", handleDragStart);
  card.addEventListener("dragend", handleDragEnd);

  return card;
}

function render() {
  todoListEl.innerHTML = "";
  progressListEl.innerHTML = "";
  doneListEl.innerHTML = "";

  const filtered = applyFilters(tasks);

  // group for status
  const groups = { todo: [], "in-progress": [], done: [] };
  filtered.forEach((t) => {
    (groups[t.status] || groups.todo).push(t);
  });

  // render each group
  groups.todo.forEach((t) => todoListEl.appendChild(createTaskCard(t)));
  groups["in-progress"].forEach((t) =>
    progressListEl.appendChild(createTaskCard(t))
  );
  groups.done.forEach((t) => doneListEl.appendChild(createTaskCard(t)));

  updateCounts();
}

function updateCounts() {
  document.querySelector('[data-status="todo"] .task-count').textContent =
    tasks.filter((t) => t.status === "todo").length;
  document.querySelector(
    '[data-status="in-progress"] .task-count'
  ).textContent = tasks.filter((t) => t.status === "in-progress").length;
  document.querySelector('[data-status="done"] .task-count').textContent =
    tasks.filter((t) => t.status === "done").length;
}

render();
