"use script";
//localStorage.removeItem("listNotes")
//.............................................................................................

const menu = document.querySelector("#menu");
const nav = document.querySelector("#Site-navigation");

//.............................................................................................

menu.onclick = () => {
    if (!(menu.classList.contains("is-active"))) {
        menu.classList.add("is-active");
        nav.classList.add("is-open");
    } else {
        menu.classList.remove("is-active");
        nav.classList.remove("is-open");
    }
};

//.............................................................................................

const add = document.querySelector("#add");

//.............................................................................................

let stopSending = add.onclick = (event) => {
    return event.preventDefault();
}
let addNotes = add.onclick = () => {
    let noteString = document.querySelector("#input-for-add").value;//form.value

    if(!noteString) return;
    noteString = localStorage.listNotes ? [localStorage.listNotes , noteString].join("@#") : noteString;//для разделения сторок
    localStorage.setItem("listNotes" , noteString);
};

//.............................................................................................

const noteBox = document.querySelector("#note-box");

//.............................................................................................
window.onload = function build_HTML_elements(){
    if (!localStorage.listNotes) return;


    let stringList = localStorage.listNotes.split("@#");//notes array
     
    for (let [index , item] of stringList.entries()) {
        let box = createNoteWrapper(index);//создаём элемент
        let note = createNoteText(item);//создаём элемент
        let img = createNoteDeleteImg();

        box.append(img);
        box.prepend(note);//вставляем в родителя
    }
    hideLoadIcon();
    deleteNote(stringList);
}
function createNoteWrapper(index) {
    let box = document.createElement("div");//создаём элемент
    box.classList += "note";//задаём класс
    box.setAttribute("data-index" , index);
    noteBox.prepend(box);//вставляем в родителя
    return box;
}
function createNoteDeleteImg() {
    let img = document.createElement("img");
    img.setAttribute("src" , "image/delete.svg");
    img.classList += "deleteImg";
    return img;
}
function createNoteText(item){
    if(!item) return;// !== undefined , !== ""

    let note = document.createElement("p");//создаём элемент
    note.classList += "note-text";//задаём класс
    note.innerHTML = item;//задаём значение
    return note;
}
function hideLoadIcon() {
    document.querySelector("#load-icon").classList.remove("is-working");
    document.querySelectorAll(".note").forEach(i => {i.classList.add("is-working")});
}


function deleteNote(array) {
    const deleteImg = document.querySelectorAll('.deleteImg');//иконка удаления

    deleteImg.forEach(item => {
        item.addEventListener("click", () => {//слушатель кликов на иконку удаления
            makeElementsInvisible();//делаем видимым окно для подтверждения удаления

            document.querySelector("#confirm-button").onclick = function(){//слушаем кнопку подтверждения
                item.parentElement.style.display = "none";// делаем невидимым удаляемый элемент
                // item.parentElement - обёртка item'а с индексом
                array.splice( item.parentElement.getAttribute("data-index") , 1)
                localStorage.setItem("listNotes" , array.join("@#"));

                makeElementsInvisible();
                getAllPreviousElements(item);
            }
            document.querySelector("#cancel").onclick = function(){
                makeElementsInvisible();
            }
        });
    });
}
function getAllPreviousElements(item){
    let allPreviousElements = []
    let sibling = item.parentElement;

    while(sibling.previousElementSibling){
        sibling = sibling.previousElementSibling;
        allPreviousElements.push(sibling);
    }
    indexСhange(allPreviousElements);
}
function indexСhange(array){
    array.forEach(item => {
        item.setAttribute("data-index" , item.getAttribute("data-index")--);
    })
}
function makeElementsInvisible() {
    const windowConfirm = document.querySelector(".window-confirm-deletion");

    if (windowConfirm.classList.contains("is-invisible")) {
        document.querySelector(".notes-container").classList.add("is-invisible");
        windowConfirm.classList.remove("is-invisible");
    } else {
        document.querySelector(".notes-container").classList.remove("is-invisible");
        windowConfirm.classList.add("is-invisible");
    }
}