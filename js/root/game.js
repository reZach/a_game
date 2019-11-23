const Game = (function(){
    let initialized = false;
    let started = null;
    let penniesWorker = null;
    let zoomLevel = null;
    let state = (function(){
        let dashboardBound = false;
        let penniesEarned = 0;
        let penniesCount = 0;
        let nicklesCount = 0;
        let dimesCount = 0;
        let quartersCount = 0;
        let halfDollarsCount = 0;
        let dollarsCount = 0;
        let fiveDollarsCount = 0;
        let tenDollarsCount = 0;
        let twentyDollarsCount = 0;
        let fiftyDollarsCount = 0;
        let hundredDollarsCount = 0;
    
        const addPennies = pennies => {
            penniesEarned += pennies;

            writePennies(penniesEarned);
            updateDashboard();
        }
    
        const updateDashboard = () => {
            if (penniesEarned >= 1){
                show("invest-pennies", true);
                disable("invest-pennies", false);
                show("penny-ascii"); 
            } else {
                disable("invest-pennies");
                hide("invest-pennies");
                hide("penny-ascii"); 
            }

            if (penniesEarned >= 5){
                show("invest-nickles", true);
                disable("invest-nickles", false);
                show("nickle-ascii");
            } else {
                disable("invest-nickles");
                hide("nickle-ascii");
            }

            if (penniesEarned >= 10){
                show("invest-dimes", true);
                disable("invest-dimes", false);
            } else {
                disable("invest-dimes");
            }

            if (penniesEarned >= 25){
                show("invest-quarters", true);
                disable("invest-quarters", false);
            } else {
                disable("invest-quarters");
            }

            if (penniesEarned >= 50){
                show("invest-half-dollars", true);
                disable("invest-half-dollars", false);
            } else {
                disable("invest-half-dollars");
            }

            if (penniesEarned >= 100){
                show("invest-dollars", true);
                disable("invest-dollars", false);
            } else {
                disable("invest-dollars");
            }

            if (penniesEarned >= 500){
                show("invest-five-dollars", true);
                disable("invest-five-dollars", false);
            } else {
                disable("invest-five-dollars");
            }

            if (penniesEarned >= 1000){
                show("invest-ten-dollars", true);
                disable("invest-ten-dollars", false);
            } else {
                disable("invest-ten-dollars");
            }

            if (penniesEarned >= 2000){
                show("invest-twenty-dollars", true);
                disable("invest-twenty-dollars", false);
            } else {
                disable("invest-twenty-dollars");
            }

            if (penniesEarned >= 5000){
                show("invest-fifty-dollars", true);
                disable("invest-fifty-dollars", false);
            } else {
                disable("invest-fifty-dollars");
            }

            if (penniesEarned >= 10000){
                show("invest-hundred-dollars", true);
                disable("invest-hundred-dollars", false);
            } else {
                disable("invest-hundred-dollars");
            }
        }
        
        const bindDashboard = () => {

            if (!dashboardBound){
                let bind = (element, value) => {
                    document.getElementById(element).onclick = e => {                        
                        penniesEarned -= value;
                    
                        if (value === 1){
                            penniesCount++;
                        } else if (value === 5){
                            nicklesCount++;
                        } else if (value === 10){
                            dimesCount++;
                        } else if (value === 25){
                            quartersCount++;
                        } else if (value === 50){
                            halfDollarsCount++;
                        } else if (value === 100){
                            dollarsCount++;
                        }
    
                        let newValue = (penniesCount + (5 * nicklesCount) + (10 * dimesCount) + (25 * quartersCount) + (50 * halfDollarsCount) + (100 * dollarsCount)) / 100;
                        document.getElementById("total-invested").textContent = `Total invested: $${newValue}`;
                        
                        writePennies(penniesEarned);
                        updateDashboard();
                    };                    
                };
                bind("invest-pennies", 1);
                bind("invest-nickles", 5);
                bind("invest-dimes", 10);
                bind("invest-quarters", 25);
                bind("invest-half-dollars", 50);
                bind("invest-dollars", 100);
                bind("invest-five-dollars", 500);
                bind("invest-ten-dollars", 1000);
                bind("invest-twenty-dollars", 2000);
                bind("invest-fifty-dollars", 5000);
                bind("invest-hundred-dollars", 10000);

                dashboardBound = true;
            }
        }
        const show = function(element, inline = false){
            document.getElementById(element).style.display = !inline ? "block" : "inline-block";
        }
        const hide = function(element){
            document.getElementById(element).style.display = "none";
        }
        const disable = (element, isTrue = true) => {
            document.getElementById(element).disabled = isTrue;
        }
        const writePennies = function(pennies){
            document.getElementById("pennies").textContent = `Pennies count: ${pennies}`;
        }
        const writeText = function(text){
            document.getElementById("text").textContent = text;
        }
        const clearText = () => document.getElementById("text").textContent = "";
    
        return {
            addPennies,
            bindDashboard
        }
    })();
    let achievements = (function(){
        let internal = {
            "detail": "You have a sharp eye for detail"
        };
        let achieved = {};

        const get = achievement => {
            if (typeof internal[achievement] !== "undefined"){
                achieved[achievement] = internal[achievement];
            }
        }        

        return {
            get
        }
    })();

    const bindPenniesWorker = function(){   
        try{
            fetch("./js/root/penny.js")
            .then(response => response.text())
            .then(text => {                
                let blob = new Blob([text], { type: "text/javascript" });
                penniesWorker = new Worker(URL.createObjectURL(blob));
                penniesWorker.onmessage = function(e){
                    state.addPennies(e.data);
                };
            })
            .catch(error => console.error(error));
        } catch (e){
            console.error(e);
        }
    }
    const bindResizeEvent = () => {
        if (!zoomLevel){
            zoomLevel = window.devicePixelRatio;
        }

        window.onresize = () => {
            if (window.devicePixelRatio > zoomLevel){
                achievements.get("detail");
            } else if (window.devicePixelRatio < zoomLevel){

            }
        }
    };
    const bindDashboard = () => state.bindDashboard();

    const init = function(){
        if (!window.Worker){
            alert("Your browser has no web worker support, please upgrade or switch browsers to play this game");
            return;
        }

        if (!initialized){
            started = new Date();
            bindPenniesWorker();
            bindResizeEvent();
            bindDashboard();
        }
    }
    return {
        init
    };
})();
Game.init();