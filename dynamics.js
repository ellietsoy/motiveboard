const workspace = document.getElementById("workspace")
const shapesContainer = document.getElementById("shapes")
const svg = document.getElementById("connections")

/* rectBtn.onclick = () => createShape("character")
circleBtn.onclick = () => createShape("clue") 
these two commands above were initially supposed to be the ones "handling" 
the creation of the shapes, but as the number of the card names got a bit bigger, 
I put them all to a single template in hopes to optimize it better */

const connectBtn = document.getElementById("connect")

let dragShape = null
let offsetX = 0
let offsetY = 0

let connectMode = false
let firstShape = null
let selectedShape = null

const connections = []

const templates = {

    character:
    `CHARACTER  
    name:
    motive:
    alibi:`,

    suspect:
    `SUSPECT
    name:
    suspicion:
    last seen:`,

    event:
    `EVENT
    what happened:
    time:
    location:`,

    clue:
    `CLUE
    description:
    found at:
    connected to:`,

     note:
    `
    `
}

connectBtn.onclick = () => {
    connectMode = true
    firstShape = null
}

function createShape(type){

    const shape = document.createElement("div")

    shape.classList.add("shape")
    shape.classList.add("rectangle")
    shape.classList.add(type)  

    shape.style.left = "100px"
    shape.style.top = "100px"

    shape.contentEditable = true
    shape.innerText = templates[type]

    shapesContainer.appendChild(shape)

    shape.addEventListener("mousedown", startDrag)

    shape.addEventListener("click",(e)=>{
        selectShape(e.currentTarget)
        handleConnection({target:e.currentTarget})
    })

}


function startDrag(e){
    
    dragShape = e.target
    offsetX = e.offsetX
    offsetY = e.offsetY

    document.addEventListener("mousemove", drag)
    document.addEventListener("mouseup", stopDrag)

}

function drag(e){

    if(!dragShape) return

    const x = e.clientX - workspace.offsetLeft - offsetX
    const y = e.clientY - workspace.offsetTop - offsetY

    dragShape.style.left = x + "px"
    dragShape.style.top = y + "px"

    updateConnections()

}

function stopDrag(){

    dragShape = null

    document.removeEventListener("mousemove", drag)
    document.removeEventListener("mouseup", stopDrag)

}

function handleConnection(e){

    if(!connectMode) return

    if(!firstShape){

        firstShape = e.target
        return

}

    createConnection(firstShape,e.target)

    connectMode = false
    firstShape = null

}

function createConnection(shape1,shape2){

    const line = document.createElementNS("http://www.w3.org/2000/svg","line")

    line.setAttribute("stroke","black")
    line.setAttribute("stroke-width","2")

    svg.appendChild(line)

    connections.push({
        shape1,
        shape2,
        line
    })

    updateConnections()

}

function selectShape(shape){

    document.querySelectorAll(".shape").forEach(s=>{
        s.style.borderColor="#333"
    })

    selectedShape = shape
    shape.style.borderColor="red"

}

document.addEventListener("keydown", (e)=>{

    if(e.key === "Delete" && selectedShape){

        e.preventDefault()

        removeConnections(selectedShape)

        selectedShape.remove()

        selectedShape = null

    }

}, true)


function removeConnections(shape){

    for(let i=connections.length-1;i>=0;i--){

    const c=connections[i]

    if(c.shape1===shape || c.shape2===shape){

        c.line.remove()
        connections.splice(i,1)

        }

    }

}

function updateConnections(){

    connections.forEach(conn=>{

        const r1 = conn.shape1.getBoundingClientRect()
        const r2 = conn.shape2.getBoundingClientRect()

        const w = workspace.getBoundingClientRect()

        const x1 = r1.left + r1.width/2 - w.left
        const y1 = r1.top + r1.height/2 - w.top

        const x2 = r2.left + r2.width/2 - w.left
        const y2 = r2.top + r2.height/2 - w.top

        conn.line.setAttribute("x1",x1)
        conn.line.setAttribute("y1",y1)
        conn.line.setAttribute("x2",x2)
        conn.line.setAttribute("y2",y2)

    })

}