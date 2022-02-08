"use script";
import {x} from "/buttons-notes.js";


let menu = document.querySelector("#menu");
let nav = document.querySelector("#Site-navigation");

menu.onclick = () => {
    if (!(menu.classList.contains("is-active"))) {
        menu.classList.add("is-active");
        nav.classList.add("is-open");
    } else {
        menu.classList.remove("is-active");
        nav.classList.remove("is-open");
    }
};

