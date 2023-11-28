
console = chrome.extension.getBackgroundPage().console;

document.addEventListener("DOMContentLoaded",function(){
    function handler() {
      let token = ''

      const tabs = chrome.tabs.query({ active: true, currentWindow: true });
      const currentTabId = tabs[0].id;

      // Execute a script in the context of the current tab to retrieve local storage data
      chrome.tabs.executeScript(currentTabId, { code: 'localStorage.getItem("your_key")' }, function(results) {
        token = results[0];
      });

    fetch('http://127.0.0.1:5000/getBoards/extension',
    {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(items => {
          // Populate the dropdown with fetched items
          console.log(items);
          const dropdown = document.getElementById('items');

          const defaultOption = document.createElement('option');
          defaultOption.value = ''; // Set this to the desired default value
          defaultOption.textContent = 'Select an item';
          dropdown.appendChild(defaultOption);

          items.forEach(item => {
            const option = document.createElement('option');
            option.value = item._id.$oid; // Convert ObjectId to string
            option.textContent = item.name;
            dropdown.appendChild(option);
          });
          dropdown.addEventListener('change', handler2);
        })
        .catch(error => console.error('Error fetching items:', error));
  }
  
  function handler2(){
    boardid = document.getElementById("items").value;
    fetch('http://127.0.0.1:5000/getColumns/extension' ,{
      // method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'boardid':boardid
        },
      })
        .then(response =>response.json())
        .then(items => {
          const dropdown = document.getElementById('columns');
          items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.name;
            // item._id.$oid; // Convert ObjectId to string
            option.textContent = item.name;
            dropdown.appendChild(option);
          });
        })
  }
  handler();
});

document.addEventListener('DOMContentLoaded', function(){
var ele = document.getElementById('submitApplication');

ele.addEventListener('click',submitIntoDb);

  function submitIntoDb() {
    const companyName = document.getElementById('companyName').value;
    const desc = document.getElementById('description').value;
    const subtasks = document.getElementById('subtasks').value;
    const boardid = document.getElementById("items").value;
    const colName = document.getElementById("columns").value;
    console.log("Column name that is sent:",colName);
    // Send job application details to the background script
    chrome.runtime.sendMessage({
      action: 'storeInMongoDB',
      tasks:[
        {
        "title":companyName,
        "description":desc,
        "subtasks":[
          {
            "title":subtasks
          }
        ]
      }
    ],
    boardid : boardid,
    colName: colName
    });
  }

});