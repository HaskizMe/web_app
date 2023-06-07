// shows config settings form section
function l3ConfigSettingsFormShow(){
    const mainBody = document.getElementById("main-body");
    mainBody.style.display = null;
}

// Hides config settings form section
function l3ConfigSettingsFormHide(){
    const mainBody = document.getElementById("main-body");
    mainBody.style.display = "none";
}

// Hides L3ContentHide
function l3ContentHide(){
    const l3Content = document.getElementById("l3-content");
    l3Content.style.display = "none";
}

// Shows l3Content div
function l3ContentShow(){
    const l3Content = document.getElementById("l3-content");
    l3Content.style.display = null;
}

// Shows an error message if fields aren't filled
function l3ErrorMessageShow(message){
	const errorMessage = message;
    var errorMessageElement = document.getElementById("error-message-read");
	errorMessageElement.innerHTML = errorMessage;
    errorMessageElement.style.display = "block";
    //errorMessageElement.style.visibility = "visible";
}

// Hides error message if fields are filled
function l3ErrorMessageHide(){
    var errorMessageElement = document.getElementById("error-message-read");
    errorMessageElement.style.display = "none";

    //errorMessageElement.style.visibility = "hidden";
}

// Parsing all input into strings and placing in array
// function parseIntoString(registerWrite, value, registerRead){
//     var arr = [];

//     if(registerWrite === '' && registerRead === '' && value == ''){
//         var message = "Please enter something";
//         console.log(message);
//         l3ErrorMessageShow(message);
//         return;
//     }
//     else if(registerWrite !== '' && value === '' ){
//         var message = "Please enter a value";
//         console.log(message);
//         l3ErrorMessageShow(message);
//         return;
//     }

//     else if(registerWrite === '' && value !== '' ){
//         var message = "Please enter a register";
//         console.log(message);
//         l3ErrorMessageShow(message);
//         return;
//     }
//     else {
//         l3ErrorMessageHide();
//         if(registerWrite !== '' && value !== '' && registerRead !== ''){
//             arr.push('W ' + registerWrite.toString() + ' ' + value.toString() + ' ');
//             arr.push('G ' + registerRead.toString() + ' ');
//         }
//         else if(registerWrite !== '' && value !== ''){
//             arr.push('W '+ registerWrite.toString() + ' ' + value.toString() + ' ');
//         }
//         else{
//             arr.push('G ' + registerRead.toString() + ' ');
//         }
//     }
//     return arr;
// }

// Submit button saves settings and also starts a load animation
// function l3SubmitSettingsButton(){
//     const submitBtn = document.getElementById("submit-button");
//     const loader = document.getElementById("btn-loader");
//     const regNumWriteInput = document.getElementById("reg-num");
//     const regValueInput = document.getElementById("reg-value");
//     const regNumReadInput = document.getElementById("read-reg-num");

//     submitBtn.addEventListener('click', function(event) {
//         event.preventDefault();
//     submitBtn.disabled = true;
//     loader.style.display = 'block';
//     setTimeout(() => {
//         submitBtn.disabled = false;
//         loader.style.display = 'none';
//     }, 2000);
//     const regNumWrite = regNumWriteInput.value;
//     const regValue = regValueInput.value;
//     const regNumRead = regNumReadInput.value;

//     var myArray = parseIntoString(regNumWrite, regValue, regNumRead);
//     getResults(myArray);
//     return myArray;
//     });
// }


// function getResults(){
//     return l3SubmitSettingsButton();
// }

// Hides config settings page and shows l3 content div
function l3BackSettingsButton(){
    const backBtn = document.getElementById("back-button");
    backBtn.addEventListener('click', function(event) {
        event.preventDefault();
        l3ConfigSettingsFormHide();
        l3ContentShow();
    });
}

// When configure settings button is clicked it hides l3-content div and shows main-body section
function l3ConfigButton(){
    let settingsForm = document.getElementById("settings-form");
    const configButton = document.getElementById("configure-settings-button");
    configButton.addEventListener('click', function() {
        settingsForm.reset();
        l3ErrorMessageHide();
        l3ContentHide();
        l3ConfigSettingsFormShow();
    });
}




function l3SubmitWriteRegisterBtn(){
    const regNumWriteInput = document.getElementById("reg-num");
    const regValueInput = document.getElementById("reg-value");

    const regNumWrite = '0x' + regNumWriteInput.value;
    const regValue = regValueInput.value;
    l3ErrorMessageHide();
    var intHex = parseInt(regNumWrite, 16);
    if(regNumWrite && regValue) {

        return 'W ' + intHex.toString() + ' ' + regValue + ' ';
    }
    else {
        l3ErrorMessageShow("Please enter an address and value");
        console.log("Please fill in both boxes");
        return;
    }

}

function l3SubmitReadRegisterBtn(){
    const regNumReadInput = document.getElementById("reg-num");
    const regNumRead = '0x' + regNumReadInput.value;
    l3ErrorMessageHide();
    var intHex = parseInt(regNumRead, 16);

    if(!isNaN(regNumRead)) {
        return 'G ' + intHex.toString() + ' ';
    }
    else {
        l3ErrorMessageShow("Please enter a value to read");
        console.log("Please enter a value to read");
        return;
    }


}

function _l3AppRunConfigureSettings(bleIcm){
    l3ConfigureSettings();
	var readButton = document.getElementById("submit-read-btn");
	var writeButton = document.getElementById("submit-write-btn");
    var executeMeasurement = document.getElementById("submit-button");
    var loadingAnimation = document.getElementById("btn-loader");
    async function readReg(event) {
        //console.log("Read register works on click");
        event.preventDefault();
        if (bleIcm.device && bleIcm.device.gatt.connected) {
            
            try {
                await bleIcm.readRegister(l3SubmitReadRegisterBtn());
            } catch (error) {
                console.error("Read register error:", error);
            }
        } else {
            console.error("Bluetooth device is not connected.");
        }
    }
    
    async function writeReg(event) {
        event.preventDefault();
        //console.log("Write register works on click");
        try {
            await bleIcm.writeRegister(l3SubmitWriteRegisterBtn());
        } catch (error) {
            console.error("Write register error:", error);
        }
    }

    async function getMeasurement(event){
        event.preventDefault();
        console.log("Execute works on click");
        await bleIcm.writeRegister('W 536870919 1 ');
        // Disable the button and show the loading animation
        executeMeasurement.disabled = true;
        loadingAnimation.style.display = "block";

        // Wait for 2 seconds (2000 milliseconds)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Enable the button and hide the loading animation
        executeMeasurement.disabled = false;
        loadingAnimation.style.display = "none";

    }

	// Add an event listener to wait for the button click event
	writeButton.addEventListener("click", writeReg);
	readButton.addEventListener("click", readReg);
    executeMeasurement.addEventListener("click", getMeasurement);
}
// Function that holds all the functions for the config settings page
function l3ConfigureSettings(){
    l3ConfigButton();
    // l3SubmitSettingsButton();
    l3BackSettingsButton();
}