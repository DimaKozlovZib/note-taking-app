"use script";
//localStorage.removeItem("listNotes")
//.............................................................................................
class HTMLelemntsForApp {
    _nav = document.getElementById("Site-navigation");
    _menu = document.getElementById("menu");
    _add = document.getElementById("add");//button
    get _nav(){
        return this._nav;
    }
    get _menu(){
        return this._menu;
    }
    get _add(){
        return this._add;
    }
}

//.............................................................................................

menu.addEventListener("click" , () => {
    let classVariables = new HTMLelemntsForApp();

    const TO_CLOSE_ITEM = document.querySelectorAll(".to-close");
    if (!(classVariables._menu.classList.contains("is-active"))) {
        classVariables._menu.classList.add("is-active");
        classVariables._nav.classList.add("is-open");
        TO_CLOSE_ITEM.forEach(i => {i.style.display = "none" });
    } else {
        classVariables._menu.classList.remove("is-active");
        classVariables._nav.classList.remove("is-open");
        TO_CLOSE_ITEM.forEach(i => {i.style.display = "block" });
    }
})
//.............................................................................................

let stopSending = new HTMLelemntsForApp()._add.onclick = (event) => { return event.preventDefault(); };

let addNotes = new HTMLelemntsForApp()._add.onclick = () => {
    let noteString = document.getElementById("input-for-add").value;//form.value

    if(!noteString) return;
    noteString = localStorage.listNotes ? [localStorage.listNotes , noteString].join("@#") : noteString;//для разделения сторок
    localStorage.setItem("listNotes" , noteString);
};

//.............................................................................................

class createHTML{
    constructor(index , item){
        this.index = index;
        this.item = item;
        this.noteBox = document.querySelector("#note-box");
    }
    get createNoteWrapper(){//создаём обёртку для текста и кнопки удаления
        let box = document.createElement("div");//создаём элемент
        box.classList += "note";//задаём класс
        box.setAttribute("data-index" , this.index);
        this.noteBox.prepend(box);//вставляем в родителя
        return box;
    }
    get createNoteDeleteImg(){//создаём кнопку удаления (картинка)
        let img = document.createElement("img");
        img.setAttribute("src" , "image/delete.svg");
        img.classList += "deleteImg";
        return img;
    }
    get createNoteText(){//создаём элемент с текстом
        let note = document.createElement("p");//создаём элемент
        note.classList += "note-text";//задаём класс
        note.innerHTML = this.item;//задаём значение
        return note;
    }
}
class hideElement{
    constructor(noVisible , visible){
        this.noVisible = noVisible;
        this.visible = visible;
    }
    get hideElements(){
        document.querySelectorAll(this.noVisible).forEach(i => {i.classList.remove("is-working")});
        document.querySelectorAll(this.visible).forEach(i => {i.classList.add("is-working")});
    }
}
class deleteNote{
    #deleteImg = document.querySelectorAll('.deleteImg');//иконка удаления
    constructor(array){
        this.array = array;
    }
    get main(){
        this.#deleteImg.forEach(item => {
            item.addEventListener("click", () => {//слушатель кликов на иконку удаления
                makeElementsInvisible();//делаем видимым окно для подтверждения удаления

                document.getElementById("confirm-button").addEventListener("click",() => {//слушаем кнопку подтверждения
                    item.parentElement.style.display = "none";// делаем невидимым удаляемый элемент
                    // item.parentElement - обёртка кнопки удаления с индексом
                    this.array.splice( item.parentElement.getAttribute("data-index") , 1)
                    localStorage.setItem("listNotes" ,  this.array.join("@#"));

                    makeElementsInvisible();
                    this.#СhangeIndexAllPreviousElements(item);

                    if (!localStorage.listNotes){ hideElements("#load-icon" ,".noNotes-wrapper");}//включение строки 'нету записей' 
                })

                
                document.getElementById("cancel").onclick = function(){
                    makeElementsInvisible();
                }
            });
        });
    }
    #СhangeIndexAllPreviousElements(item){
        let sibling = item.parentElement;
    
        while(sibling.previousElementSibling){
            //получаем соседний элемент и меняем атрибут (index - 1)
            sibling = sibling.previousElementSibling
            sibling.setAttribute("data-index" , sibling.getAttribute("data-index")-1);
        }
    }
}

let build_HTML_elements = new Promise(function (){
    if (!localStorage.listNotes){
        new hideElement("#load-icon" ,".noNotes-wrapper").hideElements;
        return;
    };

    let stringList = localStorage.listNotes.split("@#");//notes array
     
    for (let [index , item] of stringList.entries()) {
        let HTMLelem = new createHTML(index , item);//создаём класс

        let box = HTMLelem.createNoteWrapper;//создаём элемент
        let note = HTMLelem.createNoteText;//создаём элемент
        let img = HTMLelem.createNoteDeleteImg;

        box.append(img);
        box.prepend(note);//вставляем в родителя
    }
    new hideElement("#load-icon" ,".note").hideElements;
    new deleteNote(stringList).main;
})



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