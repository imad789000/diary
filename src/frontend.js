let line = document.querySelectorAll(".line")[0]
let textInputs = null;
let pagefooter = document.querySelector(".footer")
let pageheader = document.querySelector(".header")

let papers = document.querySelectorAll(".paper")
let toolbar = document.querySelector(".toolbar")
let paperIndex = 0

let lastFocused = null;

function colors()
{
    var colorsList = null
    const { readFile, writeFile } = require('fs');

    readFile("setting.txt", function(err, buf) {
        //getting file info
        colorsList = buf.toString().split("\n")

        //apply background for body
        document.body.style.backgroundColor = colorsList[0]

        //applying colors for toolbar
        let toolbarColor = function () {let list = colorsList[0].substr(0, colorsList[0].length - 2).split("("); return list[0] + "a" + "(" + list[1]}
        toolbar.style.backgroundColor = toolbarColor() + ",0.5)"

        //applying colors for papers
        let papers = document.querySelectorAll(".paper")
        papers.forEach(function(element) {element.style.backgroundColor = colorsList[1];})

        //applying colors for buttons
        let forButtons = function() {
            let value1 = (parseInt(colorsList[1].substring(colorsList[1].indexOf("(") + 1, colorsList[1].indexOf(","))) - 43).toString()
            let value2 = (parseInt(colorsList[1].split(",")[1]) - 39).toString()
            let value3 = (parseInt(colorsList[1].split(",")[2].substr(0, colorsList[1].split(",")[2].length - 1)) - 75).toString()

            return "rgb(" + value1 + "," + value2 + "," + value3 + ")"
        }
        let buttons = document.querySelectorAll(".i")

        //applying colors for fonts tab
        let fontsTab = document.querySelector(".fonts")
        fontsTab.style.backgroundColor = colorsList[0]
        fontsTab.style.borderColor = forButtons()
        //applying font
        let allLines = document.querySelectorAll(".text")
        allLines.forEach(function(element) {
            element.className = "text"
            element.classList.add(colorsList[2])})

        let fontLines = document.querySelectorAll(".f")
        fontLines.forEach(function(el) {el.style.backgroundColor = getComputedStyle(document.querySelector(".paper")).getPropertyValue("background-color")})

        let root = document.documentElement;
        root.style.setProperty('--hoverText', getComputedStyle(fontsTab, null).getPropertyValue("border-color"));
        root.style.setProperty('--hover', getComputedStyle(document.body, null).getPropertyValue("background-color"))    

        let spaces = document.querySelectorAll(".space")
        spaces.forEach((el) => {el.style.backgroundColor = getComputedStyle(document.querySelector(".paper")).getPropertyValue("background-color")})


    });
}

function changeOnHoverEnter(element)
{
    if (element.className.includes("addPage") == true)
    {
        element.classList.add("addPagehover")
    }

    if (element.className.includes("i") == true)
    {
        element.classList.add("iHover")
    }

    if (element.className.includes("option") == true)
    {
        element.classList.add("optionHover")
    }

    if (element.className.includes("deletePage") == true)
    {
        element.classList.add("deletePageHover")
    }
}

function changeOnHoverLeave(element)
{
    if (element.className.includes("addPage"))
    {
        element.classList.remove("addPagehover")
    }

    if (element.className.includes("i"))
    {
        element.classList.remove("iHover")
    }

    if (element.className.includes("option") == true)
    {
        element.classList.remove("optionHover")
    }

    if (element.className.includes("deletePage") == true)
    {
        element.classList.remove("deletePageHover")
    }
}

function insertingTextLines(paper)
{
    for (let i = 0; i <29; i++)
    {
        let lineClone = line.cloneNode(true)
        lineClone.children[0].value = ""
        let pageFooter = paper.querySelector(".footer")
        paper.insertBefore(lineClone, pageFooter)
    }

    textInputs = document.querySelectorAll(".text")
}

function setColor(textInput)
{
    let colorpicker = document.querySelector(".colorpicker")
    if(textInput != "all"){
        textInput.style.color = colorpicker.value
    }
    else{
        let allInputs = document.querySelectorAll(".text")
        allInputs.forEach(function (e) {
            e.style.color = colorpicker.value
        })
    }
}

function isOverflown(element) {
    //checks if the width of the content of the elemnt is larger than the width of the element specified
    return element.scrollWidth > element.clientWidth;
}

insertingTextLines(papers[paperIndex])

document.onkeydown = function (e){
    lastFocused = document.activeElement
    setColor(document.activeElement)
    if ((e.key == "Enter" || e.key == "ArrowDown") && Array.from(textInputs).indexOf(document.activeElement) != Array.from(textInputs).length - 1)
    {
        textInputs[Array.from(textInputs).indexOf(document.activeElement) + 1].focus()
    }

    if ((e.key == "Backspace" || e.key == "ArrowUp") && e.target.selectionStart == 0 && document.activeElement != textInputs[0])
    {
        textInputs[Array.from(textInputs).indexOf(document.activeElement) - 1].focus()
    }

    if(isOverflown(document.activeElement))
    {
        let lastWord = document.activeElement.value.split(" ")[document.activeElement.value.split(" ").length - 1]
        //removing the last word from the text input
        document.activeElement.value = document.activeElement.value.substr(0, document.activeElement.value.length - lastWord.length)

        //pasting the last word to the next text input
        textInputs[Array.from(textInputs).indexOf(document.activeElement) + 1].value =  lastWord + textInputs[Array.from(textInputs).indexOf(document.activeElement) + 1].value
        textInputs[Array.from(textInputs).indexOf(document.activeElement) + 1].focus()
    }
}

function addPages()
{
    let paperClone = papers[0].cloneNode()
    let pagefooterClone = pagefooter.cloneNode()
    let pageheaderClone = pageheader.cloneNode(true)
    let addPageButton = document.querySelector(".addPage")
    document.body.insertBefore(paperClone, document.querySelector(".button"));
    papers = document.querySelectorAll(".paper")
    paperIndex++;
    papers[paperIndex].appendChild(pageheaderClone)
    papers[paperIndex].appendChild(pagefooterClone)
    insertingTextLines(papers[paperIndex])
}

function deletePages(element)
{
    let pages = document.querySelectorAll(".paper")

    if(pages.length > 1)
    {
        document.body.removeChild(element.parentNode.parentNode)
        paperIndex--;
    }

}

//buttons
let buttonclicked = null;
function buttonManager(whatButton)
{
    switch(whatButton)
    {
        case "color":
            let colorpicker = document.querySelector(".colorpicker")
            colorpicker.click()
            break;

        case "left":
            if(lastFocused.className.includes("text"))
            {
                lastFocused.style.textAlign = "left"
            }
            break;

        case "middle":
            if(lastFocused.className.includes("text"))
            {
                lastFocused.style.textAlign = "center"
            }
            break;

        case "right":
            if(lastFocused.className.includes("text"))
            {
                lastFocused.style.textAlign = "right"
            }
            break;

        case "fonts":
            let fontsTab = document.querySelector(".fontContainer")
            if(buttonclicked != "fonts")
            {
                buttonclicked = "fonts"
                fontsTab.style.margin = "0px"
                fontsTab.style.position = "sticky"
                fontsTab.classList.add("activated")
            }

            else
            {
                buttonclicked = null;
                fontsTab.classList.remove("activated")
                fontsTab.style.position = "absolute"
                setTimeout(() => {fontsTab.style.marginTop = "-10000px"; fontsTab.classList.remove("activated")}, 600)
            }
    }
}

function fontsManager(whatFont)
{
    let writeFontSetting = function (option) {
        const { readFile, writeFile } = require('fs');

        readFile("setting.txt", function(err, buf) {
            let info = buf.toString().split("\n")
            info[2] = option
            const { writeFile } = require('fs')
            writeFile("setting.txt", info[0] + "\n" + info[1] + "\n" + info[2],err => {
                colors()
                let fontsTab = document.querySelector(".fonts")
                fontsTab.classList.remove("activated")
                buttonclicked = null
                if (err) {
                  console.error(err);
                }
            })

        })
    }
    switch(whatFont)
    {
        case '1':
        writeFontSetting("applyFont1")
        break;

        case '2':
        writeFontSetting("applyFont2")
        break;
        
        case '3':
        writeFontSetting("applyFont3")
        break;

        case '4':
        writeFontSetting("applyFont4")
        break;

        case '5':
        writeFontSetting("applyFont5")
        break;

        case '6':
        writeFontSetting("applyFont6")
        break;

        case '7':
        writeFontSetting("applyFont7")
        break;

        case '8':
        writeFontSetting("applyFont8")
        break;

        case '9':
        writeFontSetting("applyFont9")
        break;
    }
}
let appearanceInterval
function realTimeDemo(bodyDemo, paperDemo)
{
    
    bodyDemo.style.backgroundColor = document.querySelector(".colorpickerBackground").value
    paperDemo.style.backgroundColor = document.querySelector(".colorpickerPage").value
}

function appearance()
{
    document.querySelector(".toolbarcontainer").style.display = "none"

    let mainContainer = document.querySelector(".appearance")
    mainContainer.style.position = "sticky"
    mainContainer.style.marginTop = "0px"
    mainContainer.classList.add("appearanceActivated")
    let paperDemo = document.querySelector(".paper").cloneNode(true)
    paperDemo.children[0].removeChild(paperDemo.children[0].children[0])
    paperDemo.querySelectorAll(".text").forEach((el) => {el.value = ""; el.className = "demoText"})
    paperDemo.className = "paperDemo"
    let bodyDemo = mainContainer.children[0]
    Array.from(bodyDemo.children).forEach(function(el){bodyDemo.removeChild(el)})
    bodyDemo.className = "bodyDemo"
    bodyDemo.style.marginTop = "-100px"
    bodyDemo.style.width = "500px"
    bodyDemo.style.height = "600px"
    bodyDemo.style.backgroundColor = getComputedStyle(document.body, null).getPropertyValue("background-color")
    bodyDemo.style.display = "flex"
    bodyDemo.style.justifyContent = "center"
    bodyDemo.style.alignItems = "center"

    paperDemo.style.scale = "0.5"
    let demoLines = paperDemo.querySelectorAll(".text")
    demoLines.forEach(function(el) {
        el.style.pointerEvents = "none"
        el.innerHtml = ""
    })
    
    bodyDemo.appendChild(paperDemo)

    appearanceInterval =  setInterval(() => {realTimeDemo(bodyDemo, bodyDemo.children[0])}, 100)
}

function appearanceFunctions(bool)
{
    let componentToHex = function (c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    let rgbToHex =  function (r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    let hexToRGB = function (hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        // return {r, g, b} 
        return "rgb" + "(" + r.toString() + "," + g.toString() + "," + b.toString() + ")";
    }

    if (bool == false)
    {

        let getinHex = function(rgb) {
            let value1 = parseInt(rgb.substring(rgb.indexOf("(") + 1, rgb.indexOf(",")))
            let value2 = parseInt(rgb.split(",")[1])
            let value3 = parseInt(rgb.split(",")[2].substr(0, rgb.split(",")[2].length - 1))

            return rgbToHex(value1, value2, value3)
        }

        document.querySelector(".colorpickerPage").value = getinHex(getComputedStyle(document.querySelector(".paper"), null).getPropertyValue("background-color"))
        document.querySelector(".colorpickerBackground").value = getinHex(getComputedStyle(document.body, null).getPropertyValue("background-color"))
    }

    else if (bool == 'exit')
    {
        let appearance = document.querySelector(".appearance")
        appearance.classList.remove("appearanceActivated")
        let mainContainer = document.querySelector(".appearance")
        mainContainer.style.position = "absolute"

        setTimeout(() => {mainContainer.style.marginTop = "-10000px"}, 600)
        document.querySelector(".toolbarcontainer").style.display = "flex"
        clearInterval(appearanceInterval)
        buttonclicked = null
    }

    else if (bool == true)
    {
        const { readFile } = require('fs');

        readFile("src/setting.txt", function(err, buf) {
            let info = buf.toString().split("\n")
            info[0] = hexToRGB(document.querySelector(".colorpickerBackground").value)
            info[1] = hexToRGB(document.querySelector(".colorpickerPage").value)
            const { writeFile } = require('fs')
            writeFile("src/setting.txt", info[0] + "\n" + info[1] + "\n" + info[2],err => {
                let appearance = document.querySelector(".appearance")
                appearance.classList.remove("appearanceActivated")
                let mainContainer = document.querySelector(".appearance")
                mainContainer.style.position = "absolute"
                setTimeout(() => {mainContainer.style.marginTop = "-10000px"}, 600)
                document.querySelector(".toolbarcontainer").style.display = "flex"
                clearInterval(appearanceInterval)
                buttonclicked = null
                colors()
                if (err) {
                  console.error(err);
                }
            })

        })
    }
}

const CryptoJS = require('crypto-js');

const encrypt = (text) => {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
};

const decrypt = (data) => {
  return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
};

function saveAs(encryption)
{
    let encryptionTab = document.querySelector(".encryption")
    encryptionTab.style.margin = "0px"
    encryptionTab.style.position = "sticky"
    encryptionTab.classList.add("encryptionActive")

    let closeEncryptionTab = function() 
    {
        encryptionTab.style.margin = "-10000px"
        encryptionTab.style.position = "absolute"
        encryptionTab.classList.remove("encryptionActive")
    }

    
    let allPages = document.querySelectorAll(".paper")
    allPages.forEach((el) =>
    {
        let text = el.querySelectorAll(".text")
        let getDeleted = true;
        text.forEach((t) => 
        {
            if(t.value != "")
            {
                getDeleted = false
            }
        })

        if(getDeleted == true)
        {
            if(allPages.length > 1)
            {
                el.parentNode.removeChild(el)
                paperIndex--;
            }
        }
    })

    let allLines = document.querySelectorAll(".text")
    let writtenLines = ""
    allLines.forEach((el) => {
        writtenLines += el.value +"\n"
    })

    let getDate = function()
    {
        const date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        // This arrangement can be altered based on how we want the date's format to appear.
        let currentDate = `${day}-${month}-${year}`;
        return currentDate
    }

    let {writeFile} = require("fs")
    const remote = require('@electron/remote');
    const { dialog } = remote;
    const {BrowserWindow} = remote

    if(encryption == false)
    {

        let saveDialog = dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
            title: "Save As",
            defaultPath: getDate()
        }).then((d) => {
            writeFile(d.filePath +".txt", writtenLines, err => {
                if (err) {
                    console.error(err);
                }}
            )
        })

        closeEncryptionTab()
    }
    

    else if(encryption == true)
    {
        let encryptedWrittenLines = ""
        Array.from(writtenLines.split("\n")).forEach((el) => {
            encryptedWrittenLines += encrypt(el) + "\n"
        })


        let saveDialog = dialog.showSaveDialog(BrowserWindow.getFocusedWindow(), {
            title: "Save As",
            defaultPath: getDate()
        }).then((d) => {
            writeFile(d.filePath +".txt", encryptedWrittenLines, err => {
                if (err) {
                    console.error(err);
                }}
            )
        })

        closeEncryptionTab()
    }

    else if(encryption == 'x'){
        closeEncryptionTab()
    }
}

function openFile()
{
    const remote = require('@electron/remote');
    const { dialog } = remote;

    let papers = document.querySelectorAll(".paper")
    papers.forEach((el) => {
        if (document.querySelectorAll(".paper").length > 1)
        {
            el.parentNode.removeChild(el)
            paperIndex--;
        }
    })

    for(let i =0; i < 100; i++)
    {
        addPages()
    }
    let allText = document.querySelectorAll(".text")

    const {readFile} = require("fs")
    dialog.showOpenDialog().then((d) => {
        if(d.filePaths[0] != undefined)
        {
            readFile(d.filePaths[0], "utf-8", (err, data) =>{
                if (err)
                {
                    console.log(err)
                }

                let lines = data.toString().split("\n")

                try
                {
                    for(let i =0; i < lines.length; i++)
                    {
                        allText[i].value = decrypt(lines[i])
                    }
                }

                catch
                {
                    for(let i =0; i < lines.length; i++)
                    {
                        allText[i].value = lines[i]
                    }
                }

                let allPages = document.querySelectorAll(".paper")
                allPages.forEach((el) =>
                {
                    let text = el.querySelectorAll(".text")
                    let getDeleted = true;
                    text.forEach((t) => 
                    {
                        if(t.value != "")
                        {
                            getDeleted = false
                        }
                    })

                    if(getDeleted == true)
                    {
                        if(allPages.length > 1)
                        {
                            el.parentNode.removeChild(el)
                            paperIndex--;
                        }
                    }
                })
                
            })
        }})
}

colors()

const remote = require('@electron/remote');

setInterval(() => {
    if (remote.getCurrentWindow().getSize()[0] < 1000)
    {
        remote.getCurrentWindow().setBounds(
            {
                width: 1000
            }
        )
    }
    
}, 1000);
