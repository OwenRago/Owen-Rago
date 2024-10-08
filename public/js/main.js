// FRONT-END (CLIENT) JAVASCRIPT HERE

function fetchTableData() {
  fetch('/api/table')  // Replace with your actual API endpoint
    .then(response => response.json())
    .then(data => {
      let tableBody = document.getElementById('tableBody');
      tableBody.innerHTML = '';
      let age = -1
      let time = -1
      data['table'].forEach(curRow => {
        const row = document.createElement('tr');
        console.log(curRow);
        curRow.forEach((field, index) => {
          const cell = document.createElement('td');
          const div = document.createElement('div');
          div.contentEditable = true;
          div.textContent = field;
          cell.appendChild(div);
          row.appendChild(cell);
          if(index === 1){
            age = Number(field)
          }
          else if(index === 2){
            time = Number(field)
          }
        });

        const cell = document.createElement('td');
        const div = document.createElement('div');
        div.contentEditable = false;
        if(age >= 2*time){
          div.textContent = 'High'
        }
        else if(age < time/2){
          div.textContent = 'Low'
        }
        else{
          div.textContent = 'Moderate'
        }
        cell.appendChild(div);
        row.appendChild(cell);

        const deleteCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
          row.remove();
        });
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);

        tableBody.appendChild(row);
      });
    })
    .catch(error => console.error('Error fetching data:', error));
}

const submit = async function( event ) {
  const table = document.getElementById('table');
  event.preventDefault()

  let data = []
  for (let i = 1; i < table.rows.length; i++) {
    let tableRow = table.rows[i];
    let rowData = [];

    for (let j = 0; j < tableRow.cells.length - 2; j++) {
      rowData.push(tableRow.cells[j].innerText);
    }

    data.push(rowData);
  }

  json = { table: data },
  body = JSON.stringify( json )

  const response = await fetch( '/api/saveTable', {
    method:'POST',
    body
  })

  const text = await response.text()
  fetchTableData()
}

const addRow = async function( event ){
  document.getElementById('addRow').onclick = function() {
    let table = document.getElementById('table');
    let newRow = table.insertRow(-1);
    let cell1 = newRow.insertCell(0);
    let cell2 = newRow.insertCell(1);
    let cell3 = newRow.insertCell(2);
    let cell4 = newRow.insertCell(3)
    cell1.innerHTML = "<div contenteditable></div>";
    cell2.innerHTML = "<div contenteditable></div>";
    cell3.innerHTML = "<div contenteditable></div>";
    cell4.innerHTML = "<div></div>"

    let deleteCell = newRow.insertCell(4);
    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function() {
      newRow.remove();
    };
    deleteCell.appendChild(deleteButton);
  };
}

window.onload = function() {
  fetchTableData();
  const saveTable = document.getElementById("saveTable");
  saveTable.onclick = submit;
  const add = document.getElementById("addRow");
  add.onclick = addRow;
}