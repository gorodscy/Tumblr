// Making a function be executed every hour:
var interval = 3600000; // 1 hour in milliseconds

var runningFunction = setInterval(everyhourFunction, interval);

function everyhourFunction() {
  // Code to be executed:
  console.log("Executed!");
}

// [If necessary] Removing the running condition:
//clearInterval(interval);