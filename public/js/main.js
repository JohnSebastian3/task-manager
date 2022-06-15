const deleteButton = document.querySelectorAll('.fa-trash');
const incPriorityButton = document.querySelectorAll('.fa-calendar-plus');
const decPriorityButton = document.querySelectorAll('.fa-calendar-minus');

Array.from(deleteButton).forEach(el => {
  el.addEventListener('click', deleteTask);
});

Array.from(incPriorityButton).forEach(el => {
  el.addEventListener('click', increasePriority);
})

Array.from(decPriorityButton).forEach(el => {
  el.addEventListener('click', decreasePriority);
})

async function deleteTask() {
  const tName = this.parentNode.childNodes[1].innerText;
  const completed = this.parentNode.childNodes[3].innerText;
  try {
    const response = await fetch('deleteTask', {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'taskNameS': tName,
        'completedS': completed,
      })
    })
    const data = await response.json();
    console.log(data);
    location.reload();
  }
  catch(err) {
    console.log(err);
  }
}

async function increasePriority() {
  const tName = this.parentNode.childNodes[1].innerText;
  const completed = this.parentNode.childNodes[3].innerText;
  const priority = Number(this.parentNode.childNodes[5].innerText);
  if(priority >= 10) {
    return;
  }
  try {
    const response = await fetch('addOnePriority', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'taskNameS': tName,
        'completedS': completed,
        'priorityS': priority
      })
    })
    const data = await response.json();
    console.log(data);
    location.reload();
  }
  catch(err) {
    console.log(err);
  }
}

async function decreasePriority() {
  const tName = this.parentNode.childNodes[1].innerText;
  const completed = this.parentNode.childNodes[3].innerText;
  const priority = Number(this.parentNode.childNodes[5].innerText);
  if(priority <= 0) {
    return
  }
  try {
    const response = await fetch('removeOnePriority', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'taskNameS': tName,
        'completedS': completed,
        'priorityS': priority
      })
    })
    const data = await response.json();
    console.log(data);
    location.reload();
  }
  catch(err) {
    console.log(err);
  }
}