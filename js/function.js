var list = [
    {name: 'Learning HTML',completed: false, dueDate:'', subtasks: []},] 
    init()

function init(){
render(list)
bind()
}

todoList(list)

function bind(){
document.querySelector('.input').addEventListener('keyup', function(e){    //to add new item 
console.log(e)
if(!e.target.value || !(e.target.value ||''.trim())){                     //to check if the input is empty
    return;
}
if(e.key === 'Enter'){
    console.log('enter')
    var name = e.target.value;
    var item = {
        name: name,
        completed: false,
    }
    list.push(item)                                                      //to add new item to the list
    render(list)
    e.target.value = '';
}
})
document.querySelectorAll('.filter-btn').forEach((el) => {              //to filter the list
el.addEventListener('click', filterCompleted)
})

document.querySelector('.btn-clear').addEventListener('click', () => {     //to clear the list
list = []
render(list)
})
}

// to look for the completed items
function filterCompleted(e){
var completed = e.target.dataset.completed
if(completed === 'all'){
    return todoList(list)
}
var newList = list.filter((item) => item.completed === Boolean(Number(completed)))
render(newList)
}

// to add the due date
function addDueDate(index, value) {
    list[index].dueDate = value;
    saveData();
    }

    function saveData() {
        localStorage.setItem("todo-list", JSON.stringify(list));
    }

    function loadData() {
        var data = localStorage.getItem("todo-list");
        if (data) {
            list = JSON.parse(data);
            render(list);
        }
    }

// to change the color of the text
function changeColor(index) {
    const li = document.querySelector(`ul li:nth-child(${index + 1})`);
    const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    li.style.color = randomColor;
  }
  

// to be able to edit the item
function EditItem(index){
var item = list[index]
var input = document.createElement('input')
input.value = item.name
input.addEventListener('keyup', function(e){
    if(e.key === 'Enter'){
        item.name = e.target.value
        render(list)
    }
})
var li = document.querySelector('.todo-list').children[index]        //to select the item
li.innerHTML = ''
li.appendChild(input)
}

// to delete the item
function deleteItem(index){
list.splice(index, 1)
render(list);
}

// to mark the item as completed
function onClickBtn(index){
list[index].completed = !list[index].completed
render(list)
}

function render(list){
updateActiveitem()
todoList(list)
}

function updateActiveitem(){
var activeItem = list.filter(item => !item.completed).length        //to count the number of active items
document.querySelector('.active-item').innerHTML = activeItem
}

function todoList(list){
    var L = '';
    list.forEach((item, index) => {
      var itemC = item.completed ? 'input-item item-complete' : 'input-item';
      var spanC = item.completed ? 'icon-complete icon-active' : 'icon-complete';
      if(item.completed){
        const audio = new Audio('audio.mp3');                      //to play the audio when the item is completed
        audio.play();
      }
      L += `<li class="${itemC}">
              <span onclick="onClickBtn(${index})" class="${spanC}"></span>      
              <span>${item.name}</span>
              <input type="date" onchange="addDueDate(${index}, this.value)" />
              <div class="btn-group">
                <button onclick="EditItem(${index})" class="btn-edit">Edit</button>
                <button onclick="deleteItem(${index})" class="btn-delete">delete</button>
                <button onclick="changeColor(${index})" class="btn-color">Color</button>
                <button onclick="addSubtask(${index}, 'New Subtask')" class="btn-addSubtask">Subtask</button>
              </div>
            </li>`;
      if (item.subtasks) {
        L += `<ul>`;
        item.subtasks.map((subtask, i) => {
          var subtaskC = subtask.completed ? 'input-item item-complete' : 'input-item';
          var subtaskSpanC = subtask.completed ? 'icon-complete icon-active' : 'icon-complete';
          L += `<li class="${subtaskC}">
                  <span onclick="onClickSubtask(${index}, ${i})" class="${subtaskSpanC}"></span>
                  <span>${subtask.name}</span>
                  <div class="btn-group">
                    <button onclick="editSubtask(${index}, ${i})" class="btn-edit">Edit</button>
                    <button onclick="deleteSubtask(${index}, ${i})" class="btn-delete">delete</button>
                  </div>
                </li>`;
        });
        L += `</ul>`;
      }
    });
    document.querySelector('.todo-list').innerHTML = L;
  }
    
// to add a subtask to the supertask  
function addSubtask(index) {
  const subtaskName = prompt('Enter subtask');
  if (subtaskName) {
    const item = list[index];
    if (!item.subtasks) {
      item.subtasks = [];
    }
    item.subtasks.push({
      name: subtaskName,
      completed: false,
    });
    saveData();
    todoList(list);
  }
}

function deleteSubtask(index, subIndex) {
  const item = list[index];
  if (item.subtasks && item.subtasks[subIndex]) {               //if the subtask exists then delete it
    item.subtasks.splice(subIndex, 1);
    saveData();
    todoList(list);
  }
}

function editSubtask(index, subIndex) {                     
    const item = list[index];
    if (item.subtasks && item.subtasks[subIndex]) {
        const subtaskName = prompt('Enter new subtask', item.subtasks[subIndex].name);  //to edit the subtask
        if (subtaskName) {
            item.subtasks[subIndex].name = subtaskName;              //to change the name of the subtask
            saveData();
            todoList(list);
        }
    }
}

function onClickSubtask(index, subIndex) {
    const item = list[index];
    if (item.subtasks && item.subtasks[subIndex]) {
        item.subtasks[subIndex].completed = !item.subtasks[subIndex].completed;    //to mark the subtask as completed
        saveData();
        todoList(list);
    }
}