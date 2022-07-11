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

function createHtmlNotesElments(date, object, key, containerWithNotes, notesBox) {
    let Text = object.Text;
    let important = object.isImportant ? "active" : "";
    let noteBox = document.querySelector(`#${notesBox}`);

    if (!(date == object.Date)) {
        console.log(date)
        noteBox.insertAdjacentHTML("afterbegin",
            `<div data-date="${object.Date}">
                <h2 class="date-title">${object.Date}</h2>
                <div class="notes-container"></div>
            </div>`);
        containerWithNotes = document.querySelector(`#${notesBox} [data-date*="${object.Date}"] > .notes-container`);
        //контейнер в котором хранятся записи с одинаковой датой 
    }
    containerWithNotes.insertAdjacentHTML("afterbegin",
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
    let lastNotesDate;
    notesAdd.onsuccess = (event) => {
        try {
            lastNotesDate = document.querySelector("#note-box").firstChild.getAttribute("data-date");
        } catch (error) {
            lastNotesDate = '';
        }
        createHtmlNotesElments(
            lastNotesDate,
            addObject[0], event.target.result,
            document.querySelector(`#note-box .notes-container`),
            "note-box"
        );
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

            dateAndNotesBox = createHtmlNotesElments(date, object, key, containerWithNotes, "note-box");
            [date, containerWithNotes] = dateAndNotesBox;
            console.log(date)
            cursor.continue();
        } else {
            taggetButtonsListener();
        }
    }
    document.querySelector("#load-window").classList.add("close");
}

function sectionManagement(activeSection, closeLoadWindow = false) {
    if (closeLoadWindow) {
        if (!document.querySelector("#load-window").classList.contains("close")) {
            document.querySelector("#load-window").classList.add("close");
        }
        document.querySelectorAll(".notes-contant-section").forEach(item => {
            item.classList.remove("active");
        })
        document.querySelector(`#${activeSection}`).classList.add("active");

    } else {
        document.querySelector("#load-window").classList.remove("close");
    }
}


function taggetButtonsListener() {

    document.querySelectorAll(".tagget").forEach(item => {
        item.onclick = () => {
            activateHtmlElem(item)
            let activeButtons = document.querySelectorAll(".tagget.active");
            let section = activeButtons[0].parentElement.parentElement.parentElement.parentElement.parentElement;
            if (activeButtons.length === 0) {
                let delectButton = section.querySelector(".delete-button");
                if (delectButton.classList.contains('active')) {
                    delectButton.classList.remove('active');
                }
                return;
            };
            console.log(section)
            section.querySelector(".delete-button").classList.add("active");
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

document.querySelectorAll(".delete-button").forEach(deleteBtn => {
    deleteBtn.onclick = () => {
        let store = baseData.transaction("NotesFilterDate", "readwrite")
            .objectStore("NotesFilterDate"); //получаем доступ
        console.log(document.querySelectorAll(".tagget.active"))
        document.querySelectorAll(".tagget.active").forEach((taggetElem) => {
            let elemId = taggetElem.parentElement.getAttribute("data-id");
            let request = store.delete(Number(elemId));
            request.onsuccess = () => {
                document.querySelectorAll(`[data-id="${elemId}"]`).forEach(item => {
                    let parentElem = item.parentElement;
                    item.remove();
                    if (parentElem.querySelectorAll(".note").length === 0) {
                        parentElem.parentElement.remove()
                    }
                    deleteBtn.classList.remove("active");
                });
            };
        });
    };
});

document.querySelector('#search-btn').onclick = function (event) {
    event.preventDefault();
    let searchText = document.querySelector("#search-input").value;
    if (!searchText || !baseData) return;
    document.querySelector("#search-form").reset();
    sectionManagement("notes-search-container");
    if (document.querySelector("#note-search-box").childNodes) {
        document.querySelector("#note-search-box").childNodes.forEach(item => {
            item.remove();
        })
    }
    let promise = new Promise(function (resolve, reject) {
        let store = baseData.transaction("NotesFilterDate")
            .objectStore("NotesFilterDate"); //получаем доступ
        let request = store.openCursor();
        let resultArray = [];
        request.onsuccess = () => {
            let cursor = request.result;
            if (cursor) {
                if (cursor.value.Text.indexOf(searchText) !== -1) {
                    resultArray.push([cursor.key, cursor.value]);
                }
                cursor.continue();
            } else {
                if (resultArray.length === 0) {
                    reject(`ничего не найдено по запросу: ${searchText}`)
                }
                console.log(resultArray === [])
                resolve(resultArray);
            }
        }
    })//promuse
    promise.then(
        (succesResult) => {
            document.querySelector("#search-title-text").innerHTML = `Результаты по запросу: ${searchText}`;
            document.querySelector("#search-title-text").classList = "notes-title-text";
            let date, dateAndNotesBox, containerWithNotes;
            for (let elem of succesResult) {
                let object, key;
                [key, object] = elem;
                console.log(object)
                dateAndNotesBox = createHtmlNotesElments(date, object, key, containerWithNotes, "note-search-box");
                [date, containerWithNotes] = dateAndNotesBox;
                taggetButtonsListener();
            }
        },
        (error) => {
            document.querySelector("#search-title-text").innerHTML = error;
            document.querySelector("#search-title-text").classList.add("noResult")
        }
    );
    sectionManagement("notes-search-container", true);
};
document.querySelector("#search-btn-navigation").onclick = () => {
    sectionManagement("notes-search-container");
    let searchTitle = document.querySelector("#search-title-text");
    if (!searchTitle.innerHTML) {
        searchTitle.innerHTML = "Начните поиск прямо сейчас";
        searchTitle.classList.add("noResult");
    };
    sectionManagement("notes-search-container", true);
}

document.querySelector(".important-btn").onclick = function seeOnlyimportantNotes() {
    if (!baseData) { return };
    sectionManagement("important-container");
    if (document.querySelector("#note-important-box").childNodes) {
        console.log(document.querySelector("#note-important-box").childNodes)
        document.querySelectorAll("#note-important-box > div").forEach(item => {
            item.remove()
        })
    }
    let promise = new Promise(function (resolve, reject) {
        let store = baseData.transaction("NotesFilterDate")
            .objectStore("NotesFilterDate"); //получаем доступ
        let request = store.openCursor();
        let resultArray = [];
        request.onsuccess = () => {
            let cursor = request.result;
            if (cursor) {
                if (cursor.value.isImportant) {
                    resultArray.push([cursor.key, cursor.value]);
                }
                cursor.continue();
            } else {
                if (!resultArray.length) {
                    reject("У вас нету важных записей")
                } else {
                    resolve(resultArray);
                }
            }
        }
    })//promuse
    promise.then(
        (succesResult) => {
            document.querySelector("#notes-important-title").innerHTML = "ваши важные записи :";
            let date, dateAndNotesBox, containerWithNotes;
            for (let elem of succesResult) {
                let object, key;
                [key, object] = elem;
                console.log(object)
                dateAndNotesBox = createHtmlNotesElments(date, object, key, containerWithNotes, "note-important-box");
                [date, containerWithNotes] = dateAndNotesBox;
                taggetButtonsListener();
            }
        },
        (error) => {
            console.log(error);
            document.querySelector("#notes-important-title").innerHTML = error;
        }
    );
    sectionManagement("important-container", true);
};

document.querySelector("#home-btn").onclick = () => {
    sectionManagement("notes-container");
    sectionManagement("notes-container", true);
}

document.querySelector("#burger-menu").onclick = () => menuOnMobile();

function menuOnMobile() {
    const menuButton = document.querySelector("#burger-menu").classList;
    const menuList = document.querySelector("#Site-navigation").classList;
    if (menuList.contains("active")) {
        menuButton.remove("active");
        menuList.remove("active");
    } else {
        menuButton.add("active");
        menuList.add("active");
    }
}
document.querySelectorAll(".button-navigation").forEach(item => {
    item.addEventListener("click", () => {
        document.querySelectorAll(".tagget.active").forEach(item => {
            item.classList.remove("active");
        });
        document.querySelectorAll(".delete-button").forEach(item => {
            item.classList.remove("active");
        });
        menuOnMobile();

    });
})