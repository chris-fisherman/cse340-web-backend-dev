'use strict' 

let deleteClassificationItem = document.querySelector("#deleteClassificationItem")

let classificationTable = document.querySelector("#classificationDisplay")

deleteClassificationItem.addEventListener("click", function () { 

    classificationTable.classList.toggle('show')

})