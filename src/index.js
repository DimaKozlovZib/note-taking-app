"use script";
//localStorage.removeItem("listNotes")
let baseData;
let date = new Date()
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;

let TimeNow = function(){
    let Day = date.getDate();
    let Month = date.getMonth();
    let year = date.getFullYear();
    if (`${Day}`.length === 1) {
        Day = "0" + Day;
    }
    if (`${Month}`.length === 1) {
        Month = "0" + Month;
    }
    return `${Day}.${Month}.${year}`;
}

function connectBD() {
    var openRequest = indexedDB.open("notes", 2);
    openRequest.onerror = (event) => {
        console.error("Error", openRequest.error);
    };
    openRequest.onsuccess = (event) => {
        baseData = openRequest.result;
        build_HTML_elements(openRequest.result);
    };
    openRequest.onupgradeneeded = (e) => { 
        e.currentTarget.result.createObjectStore("NotesFilterDate" , {KeyPath: "id" , autoIncrement: true}); 
        connectBD();
    };
};//db
connectBD();


document.getElementById("add").onclick = (event) => { return event.preventDefault(); };

let addNotes = document.getElementById("add").addEventListener( "click" , () => {
    let transaction = baseData.transaction("NotesFilterDate" , "readwrite") //получаем доступ
    .objectStore("NotesFilterDate");// получить хранилище объектов для работы с ним
    let noteString = document.getElementById("input-for-add").value;//form.value
    document.getElementById("add-form").reset();

    let addObject = [{
        Text: noteString,
        Date: TimeNow(),
        isImportant : false
    }];
    let notesAdd = transaction.add(addObject[0]);
    notesAdd.onsuccess = (event) => {
        let boxWithNotes = document.querySelector("#note-box");
  
        boxWithNotes.insertAdjacentHTML('afterbegin', 
        `<div class="note" data-id="${event.target.result}">
            <button class="tagget"></button>
            <p class="note-text">${noteString}</p>
            <span class="star" aria-label="Пометка задачи как важной.">
                <i class="fa-regular fa-star star1"></i>
                <i class="fa-solid fa-star star2" ></i>
            </span>
        </div>`);
        taggetButtonsListener();
    };
});

function build_HTML_elements(baseData){
    let transaction = baseData.transaction("NotesFilterDate") //получаем доступ
    .objectStore("NotesFilterDate");
    let request = transaction.openCursor();
    //let item = objectStoreRead.get("Text");
    let noteBox = document.querySelector("#note-box");

    request.onsuccess = () => {
        let cursor = request.result;
        let object, key, Text, important;
        if (cursor) {
            object = cursor.value
            key = cursor.key
            Text = object.Text
            important = object.isImportant ? "active" : "";

            noteBox.insertAdjacentHTML('afterbegin', 
                `<div class="note" data-id="${key}">
                    <button class="tagget"></button>
                    <p class="note-text">${Text}</p>
                    <span class="star" aria-label="Пометка задачи как важной.">
                        <i class="fa-regular fa-star star1"></i>
                        <i class="fa-solid fa-star star2" ></i>
                    </span>
                </div>`);//вставляем в родителя
            cursor.continue();
        } else {
            taggetButtonsListener();
        }
    }
    
}





function taggetButtonsListener() {
    let array = document.querySelectorAll(".tagget");

    array.forEach(item => {
        item.onclick = () => {
            if (item.classList.contains("active")) {
                item.classList.remove("active");
            } else {
                item.classList.add("active");
            };
        };
    });

    document.querySelectorAll(".star").forEach(item => {
        item.onclick = () => {
            if (item.classList.contains("active")) {
                item.classList.remove("active");
            } else {
                item.classList.add("active");
            }; 
        }
    });
}

