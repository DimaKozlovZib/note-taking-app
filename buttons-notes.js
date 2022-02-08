let Buttons = {
    add : document.querySelector("#add"),
}
export let x = Object.keys(Buttons).forEach(item => {Buttons[item].addEventListener("click", () => {
    if (item == "add") {
        return openWindowForNote()
    } else {
        //return gettingElementsToRemove()
    }
})});

let openWindowForNote = () => alert("hvfdhfh")
