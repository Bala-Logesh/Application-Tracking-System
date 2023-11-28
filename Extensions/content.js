// content.js
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     if (request.action === 'submitApplication') {
//       // Extract job application data from the page
//       var jobApplicationData = {
//         jobName: extractJobName(),
//         companyName: extractCompanyName(),
//         jobLink: extractJobLink()
//       };
  
//       // Send data to the background script
//       chrome.runtime.sendMessage({ action: 'submitApplication', data: jobApplicationData });
//     }
//   });
  
//   function extractJobName() {
//     // Logic to extract job name from the page
//   }
  
//   function extractCompanyName() {
//     // Logic to extract company name from the page
//   }
  
//   function extractJobLink() {
//     // Logic to extract job link from the page
//   }
// content.js
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     if (request.action === 'scrapePage') {
//           // Line pattern to match in the HTML content
//         var linePattern = /Thank you for applying to company (.+?) for this role (.+?)\b/i;

//         // Check if the line pattern is present in the HTML content
//         var pageContent = document.documentElement.outerHTML;
//         var match = pageContent.match(linePattern);
//         console.log(match)
//         if (match && match.length === 3) {
//             // If the line is found, extract the company and role information
//             var company = match[1];
//             var role = match[2];
//             console.log(company,role);
//             // Send the information back to the background script with the action 'storeInMongoDB'
//             chrome.runtime.sendMessage({ action: 'storeInMongoDB', company: company, role: role });
//         }
//     }
//   });
  