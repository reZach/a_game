let interval = 10000; // 10 sec
let pennies = 1;

setInterval(function(){
    self.postMessage(pennies);
}, interval);

onmessage = function(e){
    pennies += e.data;
};