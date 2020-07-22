const submitButton = document.querySelector(".btn.btn-submit");
const flashBoxes = document.querySelectorAll(".flashbox");
if(submitButton){
    submitButton.addEventListener("click",function(event){
        const inputsArray = Array.from(document.querySelectorAll("input.form-control"));
        if(inputsArray.find(input => input.value === "") != undefined ){ 
            console.log("Input field left blank. Cannot submit!"); 
            event.preventDefault();
        } 
        else{ 
            console.log("Successfully Submitted!"); 
        }  
    });
}
setTimeout(function(){
    flashBoxes.forEach(function(flashBox){
        flashBox.style.height  = "0px";
        flashBox.style.padding = "0px";
        flashBox.style.border  = "0px";
        flashBox.style.margin  = "0px";
    })
}, 3000);