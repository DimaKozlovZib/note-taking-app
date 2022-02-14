"use script";

//.............................................................................................

let menu = document.querySelector("#menu");
let nav = document.querySelector("#Site-navigation");

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

let add = document.querySelector("#add");
let form = document.querySelector("#input-for-add");

//.............................................................................................

let stopSending = add.onclick = (event) => {
    return event.preventDefault();
}

let addNotes = add.onclick = () => {  
    let noteString = form.value;
    if(noteString == ""){
        return;
    } else {
        noteString = noteString +"@#"+ localStorage.listNotes;//для разделения сторок
    }
    return localStorage.setItem("listNotes" , noteString);
};

//.............................................................................................

let noteBox = document.querySelector("#note-box");

//.............................................................................................
window.onload = function(){
    let stringList = localStorage.listNotes.split("@#");
    for (let item of stringList) {

        let box = createNoteWrapper();//создаём элемент
        let img = createNoteDeleteImg();
        let note = createNoteText(item);//создаём элемент
        
        //.............................................................................................

        box.append(img);
        box.prepend(note);//вставляем в родителя
    }
}


function createNoteWrapper() {
    let box = document.createElement("div");//создаём элемент
    box.classList += "note";//задаём класс
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
    let note = document.createElement("p");//создаём элемент
    note.classList += "note-text";//задаём класс
    note.innerHTML = item;//задаём значение
    return note;
}

//let deleteImg = document.querySelector(".deleteImg");


