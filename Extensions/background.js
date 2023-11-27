
// background.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'storeInMongoDB') {
    // Send job application details to your Flask backend with MongoDB
    //get userid from localStorage:
    //userid = localStorage.getItem('token').split(".")[0]
    var token = "655c01111125be0e8ba12563.7f14a52c-112f-42d4-b9e7-d0c0984b143a"
    tokenParts = token.split(".");
    userid = tokenParts[0];
    console.log(userid)
    if(userid === null){
      throw new Error("Userid is null")
    }
    fetch('http://127.0.0.1:5000/columns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization':localStorage.getItem('token')
        'Authorization':token
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
