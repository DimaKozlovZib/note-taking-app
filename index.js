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
    return;
};

//.............................................................................................

const add = document.querySelector("#add");
const form = document.querySelector("#input-for-add");

//.............................................................................................

let stopSending = add.onclick = (event) => {
    return event.preventDefault();
}

let addNotes = add.onclick = () => {  
    let noteString = form.value;
    if(noteString === "") return;    
    
    noteString = localStorage.listNotes ? [localStorage.listNotes , noteString].join("@#") : noteString;//для разделения сторок
    localStorage.setItem("listNotes" , noteString);
    return;
};

//.............................................................................................

const noteBox = document.querySelector("#note-box");

//.............................................................................................
window.onload = function build_HTML_elements(){
    if (!localStorage.listNotes) return;

    let stringList = localStorage.listNotes.split("@#");//notes array
    let img = createNoteDeleteImg();
     
    for (let [ index , item] of stringList.entries()) {
        let box = createNoteWrapper(index);//создаём элемент
        let note = createNoteText(item);//создаём элемент
        let img = createNoteDeleteImg();
        //.............................................................................................

        box.append(img);
        box.prepend(note);//вставляем в родителя
    }
    return deleteNote(stringList);
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
    if(item){// !== undefined , !== ""
        let note = document.createElement("p");//создаём элемент
        note.classList += "note-text";//задаём класс
        note.innerHTML = item;//задаём значение
        return note;
    }
}

function deleteNote(array) {
    const deleteImg = document.querySelectorAll('.deleteImg');

    deleteImg.forEach(item => {item.addEventListener("click", () => {

        let parent = item.parentElement
        parent.style.display = "none";
        
        let indexDeleteNote = parent.getAttribute("data-index");
        array.splice(indexDeleteNote , 1)
        localStorage.setItem("listNotes" , array.join("@#"));
    })});
}


