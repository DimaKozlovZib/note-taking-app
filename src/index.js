"use script";
//localStorage.removeItem("listNotes")
let baseData;
let date = new Date()
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;

let TimeNow = function () {
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
function activateHtmlElem(item) {
    if (item.classList.contains("active")) {
        item.classList.remove("active");
    } else {
        item.classList.add("active");
    };
}
function connectBD() {
    var openRequest = indexedDB.open("notes", 3);
    openRequest.onerror = (event) => {
        console.error("Error", openRequest.error);
    };
    openRequest.onsuccess = (event) => {
        baseData = openRequest.result;
        build_HTML_elements(openRequest.result);
    };
    openRequest.onupgradeneeded = (e) => {
        e.currentTarget.result.createObjectStore("NotesFilterDate", { autoIncrement: true });
        connectBD();
    };
};//db
connectBD();


document.getElementById("add").onclick = (event) => { return event.preventDefault(); };

let addNotes = document.getElementById("add").addEventListener("click", () => {
    let noteString = document.getElementById("input-for-add").value;//form.value
    if (!noteString) { return; };
    document.getElementById("add-form").reset();
    let classListIconImportant = document.querySelector("#addForm__icon-important").classList;
    let notesIsImportant = classListIconImportant.contains("active") ? true : false;
    !notesIsImportant || classListIconImportant.remove("active");

    let transaction = baseData.transaction("NotesFilterDate", "readwrite") //получаем доступ
        .objectStore("NotesFilterDate");// получить хранилище объектов для работы с ним

    let addObject = [{
        Text: noteString,
        Date: TimeNow(),
        isImportant: notesIsImportant
    }];
    let notesAdd = transaction.add(addObject[0]);
    notesAdd.onsuccess = (event) => {
        let boxWithNotes = document.querySelector("#note-box");

        boxWithNotes.insertAdjacentHTML('afterbegin',
            `<div class="note" data-id="${event.target.result}">
            <button class="tagget"></button>
            <p class="note-text">${noteString}</p>
            <span class="star  the-star" aria-label="Пометка задачи как важной.">
                <i class="fa-regular fa-star star1"></i>
                <i class="fa-solid fa-star star2" ></i>
            </span>
        </div>`);
        taggetButtonsListener();
    };
});

function build_HTML_elements(baseData) {
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
                    <span class="star the-star ${important}" aria-label="Пометка записи как важной.">
                        <i class="fa-regular fa-star star1"></i>
                        <i class="fa-solid fa-star star2" ></i>
                    </span>
                </div>`);//вставляем в родителя
            cursor.continue();
        } else {
            taggetButtonsListener(cursor);
            return;
        }
    }

}





function taggetButtonsListener(cursor) {
    let array = document.querySelectorAll(".tagget");

    array.forEach(item => {
        item.onclick = () => {
            activateHtmlElem(item)
        };
    });

    document.querySelectorAll(".star").forEach(item => {
        item.onclick = () => {
            activateHtmlElem(item);
            console.log("jhshuhsuhg")
            let indexThisNotes = item.parentElement.getAttribute("data-id");
            let store = baseData.transaction("NotesFilterDate", "readwrite")
                .objectStore("NotesFilterDate"); //получаем доступ
            let object = store.get(Number(indexThisNotes))
            object.onsuccess = () => {
                if (item.classList.contains("active")) {
                    object.result.isImportant = true;

                } else {
                    object.result.isImportant = false;
                };
                store.put(object.result, Number(indexThisNotes))
            }
        };
    });
}
document.querySelector("#addForm__icon-important").onclick = (item) => { activateHtmlElem(item) };

document.querySelector("#tab-button-add").addEventListener("click", () => {
    let Form = document.querySelector("#add-form");
    activateHtmlElem(Form);
})