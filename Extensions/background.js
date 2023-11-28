
// background.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'storeInMongoDB') {
    // Send job application details to your Flask backend with MongoDB
    let token = ''

    const tabs = chrome.tabs.query({ active: true, currentWindow: true });
    const currentTabId = tabs[0].id;

    // Execute a script in the context of the current tab to retrieve local storage data
    chrome.tabs.executeScript(currentTabId, { code: 'localStorage.getItem("your_key")' }, function(results) {
      token = results[0];
    });

    fetch('http://127.0.0.1:5000/columns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
      "column":{
        "boardid":request.boardid,
        "name":request.colName,
        "tasks":request.tasks,
      }
    }),
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          console.log('Job application details stored in MongoDB:', result.message);
        } else {
          console.error('Error storing job application details:', result.error);
        }
      })
      .catch(error => {
        console.error('Error storing job application details:', error);
      });
  }
});
