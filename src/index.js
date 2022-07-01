"use script";
//localStorage.removeItem("listNotes")
let baseData;

var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;

let TimeNow = function () {
    let date = new Date();
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
    var openRequest = indexedDB.open("notes", 5);
    openRequest.onerror = (event) => {
        console.error("Error", openRequest.error);
    };
    openRequest.onsuccess = (event) => {
        baseData = openRequest.result;

        baseData.onversionchange = function () {
            baseData.close();
            alert("База данных устарела, пожалуста, перезагрузите страницу.")
        };
        console.log(openRequest.result)
        build_HTML_elements();

    };
    openRequest.onupgradeneeded = (e) => {
        let db = openRequest.result;
        console.log("uduhuhsdvuhu")
        if (!db.objectStoreNames.contains("NotesFilterDate")) { // если хранилище не существует
            db.createObjectStore("NotesFilterDate", { autoIncrement: true }); // создаем хранилище
        }
        connectBD();
    };
};//db
connectBD();

function createHtmlNotesElments(date, object, key, containerWithNotes) {
    let Text = object.Text;
    let important = object.isImportant ? "active" : "";
    let noteBox = document.querySelector("#note-box");

    if (!(date == object.Date)) {
        console.log(date)
        noteBox.insertAdjacentHTML("afterbegin",
            `<div data-date="${object.Date}">
                <h2 class="date-title">${object.Date}</h2>
                <div class="notes-container"></div>
            </div>`);
        containerWithNotes = document.querySelector(`[data-date*="${object.Date}"] > .notes-container`);
        //контейнер в котором хранятся записи с одинаковой датой 
    }
    containerWithNotes.insertAdjacentHTML("beforeend",
        `<div class="note" data-id="${key}">
            <button class="tagget"></button>
            <p class="note-text">${Text}</p>
            <span class="star the-star ${important}" aria-label="Пометка записи как важной.">
                <i class="fa-regular fa-star star1"></i>
                <i class="fa-solid fa-star star2" ></i>
            </span>
        </div>`);//вставляем в родителя
    return [object.Date, containerWithNotes];
}


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

function build_HTML_elements() {
    console.log(baseData)
    let transaction = baseData.transaction("NotesFilterDate").objectStore("NotesFilterDate");//получаем доступ
    console.log(transaction)
    let request = transaction.openCursor();
    //let item = objectStoreRead.get("Text");
    let date, dateAndNotesBox, containerWithNotes;
    request.onsuccess = () => {
        let cursor = request.result;
        let object, key;
        if (cursor) {
            object = cursor.value;
            key = cursor.key;

            dateAndNotesBox = createHtmlNotesElments(date, object, key, containerWithNotes);
            [date, containerWithNotes] = dateAndNotesBox;
            console.log(date)
            cursor.continue();
        } else {
            taggetButtonsListener();
        }
    }
    document.querySelector("#load-window").classList.add("close");
}




function taggetButtonsListener() {

    document.querySelectorAll(".tagget").forEach(item => {
        item.onclick = () => {
            activateHtmlElem(item)
            let activeButtons = document.querySelectorAll(".tagget.active");
            if (activeButtons.length === 0) {
                let delectButton = document.querySelector("#delete-button");
                if (delectButton.classList.contains('active')) {
                    delectButton.classList.remove('active');
                }
                return;
            };
            let delectButton = document.querySelector("#delete-button");
            delectButton.classList.add("active");
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
document.querySelector("#addForm__icon-important").onclick = (item) => {
    activateHtmlElem(document.querySelector("#addForm__icon-important"))
};
document.querySelector("#tab-button-add").onclick = () => {
    let Form = document.querySelector("#add-form");
    activateHtmlElem(Form);
}
document.querySelector("#delete-button").onclick = () => {
    let store = baseData.transaction("NotesFilterDate", "readwrite")
        .objectStore("NotesFilterDate"); //получаем доступ
    console.log(document.querySelectorAll(".tagget.active"))
    document.querySelectorAll(".tagget.active").forEach((item) => {
        let parentElem = item.parentElement;
        let i = parentElem.getAttribute("data-id");
        let request = store.delete(Number(i));

        request.onsuccess = () => {
            parentElem.remove();
            document.querySelector("#delete-button").classList.remove("active");
        }
    })
}

document.querySelector('#search-btn').onclick = function (event) {
    event.preventDefault();
    let searchText = document.querySelector("#search-input").value;
    if (!searchText) return;
    document.querySelector("#search-form").reset();

    let promise = new Promise(function (resolve, reject) {
        let store = baseData.transaction("NotesFilterDate", "readwrite")
            .objectStore("NotesFilterDate"); //получаем доступ
        let request = store.openCursor();
        let resultArray = [];
        request.onsuccess = () => {
            let cursor = request.result;
            if (cursor) {
                if (cursor.value.Text.indexOf(searchText) !== -1) {
                    resultArray.push(cursor.key);
                }
                cursor.continue();
            } else {
                if (!resultArray) {
                    reject(`ничего не найдено по запросу: ${searchText}`)
                }
                console.log(resultArray)
                resolve(resultArray);
            }
        }
    })//promuse
};