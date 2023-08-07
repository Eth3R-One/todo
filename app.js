class TodoMaker {
  constructor() {
    this._todos = Storage.todos();
  }
  addTodo(todo) {
    this._todos.push(todo);
    Storage.saveTodo(todo);
    location.reload();
  }
  getTodos() {
    return this._todos;
  }
  updateTodo(id) {
    Storage.updateTodo(id);
  }
  removeTodo(id) {
    Storage.deleteTodo(id);
  }
}
class Todo {
  constructor(name, status = false) {
    this._id = Math.random().toString(16).slice(2);
    this._name = name;
    this._status = status;
  }
}

class Storage {
  static todos() {
    let todos;
    if (localStorage.getItem("todos") === null) {
      todos = [];
    } else {
      todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
  }
  static saveTodo(todo) {
    const todos = this.todos();
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
  }
  static deleteTodo(id) {
    const todos = Storage.todos();
    todos.forEach((todo, index) => {
      if (id === todo._id) {
        todos.splice(index, 1);
      }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
  }
  static updateTodo(id) {
    const todos = Storage.todos();
    todos.map((todo) => {
      if (id === todo._id) {
        todo._status ? (todo._status = false) : (todo._status = true);
      }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}

class Ui {
  constructor() {
    const todos = Storage.todos();
    table.innerHTML = "";
    if (todos.length === 0) {
      const table = document.getElementById("table");
      const div = document.createElement("div");
      div.classList.add("table", "mb-4", "text-center", "my-3", "pb-3");
      div.innerHTML = "<h1>No todo</h1>";
      document.querySelector(".card-body").appendChild(div);
    } else {
      const tableElement = document.getElementById("table");
      const tableHead = document.createElement("thead");
      const tableRow = document.createElement("tr");
      tableRow.innerHTML = `
        <th scope="col">No.</th>
        <th scope="col">Todo item</th>
        <th scope="col">Status</th>
        <th scope="col">Actions</th>`;
      tableHead.appendChild(tableRow);
      tableElement.appendChild(tableHead);

      const tableBodyElement = document.createElement("tbody");

      todos.forEach((todo, index) => {
        const innerTableRow = document.createElement("tr");
        innerTableRow.setAttribute("value", todo._id);
        innerTableRow.innerHTML = `
        <th scope="row">${index + 1}</th>
        <td id="todo-data" value="${todo._id}" class="${
          todo._status ? "text-success" : "text-warning"
        }" >${todo._name}</td>
        <td >${
          todo._status
            ? "<div class='text-success'>Done</div>"
            : "<div class='text-warning'>Pending</div>"
        }</td>
        <td>
          <button id="deleteBtn" value="${
            todo._id
          }" type="submit" class="btn btn-danger">
            Delete
          </button>
          <button id="finishBtn" value="${
            todo._id
          }" type="submit" class="btn btn-${
          todo._status ? "success" : "warning"
        } ms-1">
        ✓
          </button>
        </td>
        `;
        tableBodyElement.appendChild(innerTableRow);
      });
      tableElement.appendChild(tableBodyElement);
    }
  }
}
class App {
  constructor() {
    const todoMaker = new TodoMaker();
    const ui = new Ui();
    const saveBtn = document
      .getElementById("save")
      .addEventListener("click", this._newTodo.bind(this));
    const finishBtn = document.querySelectorAll("#finishBtn").forEach((el) => {
      el.addEventListener("click", this._setFinish.bind(this));
      const deleteBtn = document.querySelectorAll("#deleteBtn");
    });
    const deleteBtn = document.querySelectorAll("#deleteBtn").forEach((el) => {
      el.addEventListener("click", this._remove);
    });
  }
  _newTodo(e) {
    e.preventDefault();
    const todoMaker = new TodoMaker();
    const dataFromDOM = document.getElementById("form");
    if (dataFromDOM.value === "") {
      alert("Enter a todo");
      return;
    }
    const todo = new Todo(dataFromDOM.value);

    todoMaker.addTodo(todo);
    dataFromDOM.value = "";
    const ui = new Ui();
  }
  _getTodos() {
    const todos = Storage.todos();
  }
  _setFinish(e) {
    const todos = new TodoMaker();
    const todosFromStorage = todos.getTodos();
    todosFromStorage.forEach((todo) => {
      if (todo._id === e.target.value) {
        todos.updateTodo(e.target.value);
        return;
      }
    });
    location.reload();
    return;
  }

  _remove(e) {
    const todoMaker = new TodoMaker();
    todoMaker.removeTodo(e.target.value);
    location.reload();
  }
}

const app = new App();
