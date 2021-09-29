"use strict";

const alert = document.getElementById('alert');
const todoForm = document.getElementById('todo-form');
const todo = document.getElementById('todo');
const todoContainer = document.getElementById('todo-container');
const todoList = document.getElementById('todo-list');
const btnClear = document.getElementById('btn-clear');
const btnSubmit = document.getElementById('btn-submit');


// Program constant

let editElement;
let editFlag = false;
let editID='';

// Functions
const addToLocalStorage = function(id,value){
  const todo ={ id:id , value:value};
  let items = localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
  items.push(todo);
  localStorage.setItem('list', JSON.stringify(items));
};

const removeFromLocalStorage = function(id){
  let items = localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
  items = items.filter(item => item.id !== id);
  localStorage.setItem('list', JSON.stringify(items));

};
const editFromLocalStorage = function(id,value){
  let items = localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
  items = items.map((item)=>{
    if (item.id === id){
      item.value = value;
    }
    return item;
  });
  localStorage.setItem('list', JSON.stringify(items));

};

const creatListItem = function(id,value){
  const element = document.createElement('article');
  let attr = document.createAttribute('data.id');
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add('todo-item');
  element.innerHTML=`
  <p class="title">${value}</p>
  <div class="btn-container">
    <button type="button" role="button" class="btn-edit" id="btn-edit">
      <i class="fas fa-edit"></i>
    </button>
    <button type="button" role="button" class="btn-delete" id="btn-delete">
      <i class="fas fa-trash-alt"></i>
    </button>
  </div>`
  //add event listeners edit and delete

  const btnDelete =element.querySelector('.btn-delete');
  btnDelete.addEventListener('click',deleteItem);

  const btnEdit =element.querySelector('.btn-edit');
  btnEdit.addEventListener('click',editItem);

  //append child

  todoList.appendChild(element);
}

const populateList = function(){
  let items = localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
  if(items.length>0){
    items.forEach(item=>creatListItem(item.id,item.value))
  }
  todoContainer.classList.add('show-container');

}

// add item 
const addItem = function(e){
  e.preventDefault();
  const todoValue = todo.value;
  const id = new Date().getTime().toString();

  if (todoValue && !editFlag){
    creatListItem(id,todoValue)
    displayAlert('New Task Added','success')
    //show container
    todoContainer.classList.add('show-container');
    //set back to default
    addToLocalStorage(id,todoValue);
    setBackToDefault();
  }else if(todoValue && editFlag){
    editElement.innerHTML = todoValue;
    displayAlert('Task Updated','success');
    editFromLocalStorage(editID,todoValue);
    setBackToDefault();
  }else{
    displayAlert('Empty Task','danger');
  }
};

const clearItems = function(){
  const items = document.querySelectorAll('.todo-item');
  if(items.length > 0  ){
    items.forEach(item => todoList.removeChild(item));
  }
  todoContainer.classList.remove('show-container');
  displayAlert('Removed all task','danger');
  localStorage.removeItems('list');
  setBackToDefault();
};

// deleteItem 
const deleteItem = function(e){
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  todoList.removeChild(element);
  if(todoList.children.length === 0){
    todoContainer.classList.remove('show-container');
  }
  displayAlert('Task removed','danger');
  removeFromLocalStorage(id);
  setBackToDefault();
}

// editItem 
const editItem=function(e){
  const element = e.currentTarget.parentElement.parentElement;
  editID = element.dataset.id;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  todo.value = editElement.innerHTML;
  editFlag = true;
  btnSubmit.textContent = 'Update Task';

};

//setBackToDefault
const setBackToDefault = function(){
  todo.value='';
  editFlag=false;
  btnSubmit.textContent='Add New Task'
};

// display alerts
const displayAlert = function(message,color){
  alert.innerText = message;
  alert.classList.add(color);
  setTimeout(()=>{
    alert.innerText = '';
    alert.classList.remove(color);
  },1500)
};



// eventListener

todoForm.addEventListener('submit',addItem);

btnClear.addEventListener('click',clearItems);

window.addEventListener('DOMContentLoaded',populateList);