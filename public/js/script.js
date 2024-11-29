// *********** SHOW PASSWORD *********** //
const pwdBtn = document.querySelector("#pwdBtn");

pwdBtn.addEventListener("click", function() {
    
    const pwdInput = document.getElementById("account_password");
    console.log(pwdInput)
    const type = pwdInput.getAttribute("type");

    if (type == "password") {
        pwdInput.setAttribute("type", "text");
        pwdBtn.innerHTML = "Hide";
    } else {
        pwdInput.setAttribute("type", "password");
        pwdBtn.innerHTML = "Show";
    }
});