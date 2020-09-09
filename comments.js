import { v4 as uuidv4 } from 'uuid';

document.onreadystatechange = function () {
  if (document.readyState === 'interactive') {
    console.log("document is ready");
    document.body.addEventListener("mousedown", event => {
      console.log(event);
      if (event.target.tagName === "TEXTAREA" || event.target.tagName === "INPUT") {
        console.log("Clicked an input field, not adding new input element.");
        return;
      } else if (event.target.id.indexOf("-inline-comment-") !== -1) {
        console.log("Inline comment elements, not adding new input element.");
        return;
      }
      const uuid = uuidv4();
      const idPrefix = uuid + "-inline-comment-";
      const div = document.createElement("div");
      div.id = idPrefix + "div";
      Object.assign(div.style, {
        position: 'absolute',
        "z-index": 'auto',
        // border: '1px solid #d3d3d3',
        // width: '150px',
        // height: '20px',
        float: 'inline-start',
        top: event.layerY.toString() + 'px',
        left: event.layerX.toString() + 'px'
      });
      const headerDiv = document.createElement("div");
      headerDiv.id = idPrefix + "header";
      Object.assign(headerDiv.style, {
        display: "inline-block",
        width: "90%",
        height: "15px",
        cursor: 'move',
        background: '#2196F3'
      });
      div.appendChild(headerDiv);
      const deleteElement = document.createElement("div");
      deleteElement.id = idPrefix + "delete";
      deleteElement.innerText = "x";
      Object.assign(deleteElement.style, {
        display: "inline-block",
        "text-align": "center",
        width: "15px",
        height: "15px",
        margin: 0,

      });
      div.appendChild(deleteElement);
      const newTextInput = document.createElement("textarea");
      newTextInput.id = idPrefix + "textarea";
      Object.assign(newTextInput.style, {
        display: "block",
        resize: 'both'
      });
      div.appendChild(newTextInput);
      document.body.appendChild(div);
      dragElement(headerDiv, div);
    });
  }
}

function dragElement(element, moveElement) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  element.onmousedown = dragMouseDown;

  function dragMouseDown(event) {
    event.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = event.clientX;
    pos4 = event.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(event) {
    event.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - event.clientX;
    pos2 = pos4 - event.clientY;
    pos3 = event.clientX;
    pos4 = event.clientY;
    // set the element's new position:
    moveElement.style.top = (moveElement.offsetTop - pos2) + "px";
    moveElement.style.left = (moveElement.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}