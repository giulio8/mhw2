let selectionMap = {}

function initializeVariables() {
    const grids = document.querySelectorAll(".choice-grid")
    for(const grid of grids) {
        let selection = {
            chosen: false,
            selectionId: null
        }
        const child = grid.children[0]
        selectionMap[child.dataset.questionId] = selection
    }
    const cards = document.querySelectorAll("section.choice-grid div")
    for (const card of cards) {
        card.addEventListener("click", select)
    }
}

function isComplete(selectionMap) {
    console.log(selectionMap)
    for (const sel in selectionMap) {
        if (selectionMap[sel].chosen === false) {
            return false
        }
    }
    return true
}

function result(selectionMap) {
    firstAnswer = selectionMap["one"].selectionId
    let preferencyMap = {}
    for (const key in RESULTS_MAP)
        preferencyMap[key] = 0
    for (sel in selectionMap) {
        preferencyMap[selectionMap[sel].selectionId]++
    }
    console.log(selectionMap)
    let idx_max = -1
    let max = 0
    for (const key in preferencyMap) {
        if (preferencyMap[key] > max) {
            idx_max = key
            max = preferencyMap[key]
        }
    }
    if (max > 1) {
        return idx_max
    } else {
        return firstAnswer
    }
}

function select(event) {
    const selectedElement = event.currentTarget
    const grid = selectedElement.parentNode
    selectionMap[selectedElement.dataset.questionId] = {
        chosen: true,
        selectionId: selectedElement.dataset.choiceId
    }
    addSelectedClass(selectedElement)
    for (const other of grid.children) {
        if (other !== selectedElement) {
            notSelectedClass(other, true)
        }
    }
    if (isComplete(selectionMap)) {
        showResult(result(selectionMap))
    }
}

function addSelectedClass(element) {
    const checkbox = element.querySelector("img.checkbox")
    element.classList.add("card-selected")
    element.classList.remove("card-opaque")
    checkbox.src = "images/checked.png"
}

function notSelectedClass(element, opacize) {
    const checkbox = element.querySelector("img.checkbox")
    if (element.classList.contains("card-selected")) {
        element.classList.remove("card-selected")
    }
    if (opacize)
        element.classList.add("card-opaque")
    checkbox.src = "images/unchecked.png"
}

function showResult(result) {
    const el = document.querySelector("#risposta")
    let title = document.createElement("h1")
    title.textContent = RESULTS_MAP[result].title
    let description = document.createElement("p")
    description.textContent = RESULTS_MAP[result].contents
    let button = document.createElement("div")
    button.classList.add("button")
    button.textContent = "Ricomincia il quiz"
    el.appendChild(title)
    el.appendChild(description)
    el.appendChild(button)

    removeListeners()
    button.addEventListener("click", resetAll)
}

function removeListeners() {
    divs = document.querySelectorAll("section.choice-grid div")
    for (const div of divs) {
        div.removeEventListener("click", select)
    }
}

function resetAll() {
    document.querySelector("#risposta").innerHTML = ""
    window.scrollTo(0, 0)
    initializeVariables()
    divs = document.querySelectorAll("section.choice-grid div")
    for (const div of divs) {
        notSelectedClass(div, false)
        div.classList.remove("card-opaque")
    }
}

initializeVariables()
