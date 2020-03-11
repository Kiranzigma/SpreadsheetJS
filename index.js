
var no_rows = 11;
var no_columns = 11;
var max_columns = 26;

const obs = new rxjs.Subject();
const rowObs = new rxjs.Subject();

window.onload = () => {
    console.log("Loaded");
    let table = document.createElement("table");
    table.setAttribute("id", "Spreadsheet");
    for (let i = 0; i < no_rows; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < no_columns; j++) {
            let td = document.createElement("td");

            if (i == 0 & j == 0) {
                td.setAttribute("id", "Row" + i + "," + "Cell" + j);
                td.setAttribute("contentEditable", "false");
            }
            else if (i == 0 & j > 0) {
                td.setAttribute("id", "Row" + i + "," + "Cell" + j);
                let text = document.createTextNode(String.fromCharCode(j + 64));
                td.addEventListener("click", function () {
                    selectedColumn(td);
                }, false);
                td.appendChild(text);
            }

            else if (j == 0 & i > 0) {
                td.setAttribute("id", "Row" + i + "," + "Cell" + j);
                let text = document.createTextNode(i);
                td.addEventListener("click", function () {
                    selectedRow(tr);
                }, false);
                td.appendChild(text);
            }

            else {
                td.setAttribute("contentEditable", "true");
                td.setAttribute("id", "Row" + i + "," + "Cell" + j);
                rxjs.fromEvent(td, 'input').pipe(rxjs.operators.debounceTime(300)).subscribe(x => {
                    if (td.innerText.toLowerCase().startsWith("=sum(") && td.innerText.endsWith(")")) {
                        let initalStr = td.innerText.substring(4, td.innerText.length);
                        let actualStr = initalStr.substring(1, initalStr.length - 1);
                        let arr = [];
                        actualStr.split(":").forEach(x => {
                            if (x.length > 1)
                                arr.push(x)
                        });
                        if (arr.length == 2) {
                            sum(td, arr);
                        }
                    } else if (td.innerText.startsWith("=", 0) && td.innerText.length >= 6) {
                        let operator = td.innerText.charAt(3);
                        if (operator === "+") {
                            td.setAttribute("operation", "true")
                            td.setAttribute("type", "sum")
                            operate(td, "+");
                        } else if (operator === "-") {
                            td.setAttribute("operation", "true")
                            td.setAttribute("type", "diff")
                            operate(td, "-");
                        } else if (operator === "*") {
                            td.setAttribute("operation", "true")
                            td.setAttribute("type", "mul")

                           operate(td, "*");
                        } else if (operator === "/") {
                            td.setAttribute("operation", "true")
                            td.setAttribute("type", "div")
                            operate(td, "*");
                        }
                    } else if (x.inputType == "deleteContentBackward" && td.getAttribute("operation") == "true") {
                        td.removeAttribute("operation");
                        td.removeAttribute("type");
                    }
                    obs.next(x.target);
                });
            }

            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    document.body.appendChild(table);
}

const sum = (td, arr) => {
    let map = new Map();
    for(i=1;i<=26;i++){
    map.set(String.fromCharCode(i + 64),'Cell'+i);
    }  
     
    if (arr[0].charAt(0) == arr[1].charAt(0)) {
        let col = map.get(arr[0].charAt(0));
        td.setAttribute("operation", "true")
        let start = parseInt(arr[0].substring(1, arr[0].length));
        let end = parseInt(arr[1].substring(1, arr[1].length));
        let rowObserver = rowObs.subscribe(x => {
            if (x < end && x > start) {
                end = parseInt(end) + 1;
            }
        });
        let observer = obs.subscribe(x => {
            if (td.getAttribute("operation")) {
                let sum = 0;
                for (i = start; i <= end; i++) {
                    sum = sum + parseInt(document.getElementById("Row" + i + "," + col).innerText);
                }
                td.innerText = sum;
            } else {
                observer.unsubscribe();
                rowObserver.unsubscribe();
            }
        });
    } else if (arr[0].substring(1, arr[0].length) == arr[1].substring(1, arr[1].length)) {
        td.setAttribute("operation", "true") 
        let observer = obs.subscribe(x => {
            if (td.getAttribute("operation")) {
                let sum = 0;
                let start = arr[0].charCodeAt(0);
                let end = arr[1].charCodeAt(0);
                let val = arr[0].substring(1, arr[0].length);
                for (i = start; i <= end; i++) {
                    sum = sum + parseInt(document.getElementById(String.fromCharCode(i) + val).innerText);
                }
                td.innerText = sum;
            } else { observer.unsubscribe() }
        });
    } else {
        console.log("invalid");
    }
}

const operate = (td, type) => {
    let map = new Map();
    for(i=1;i<=26;i++){
    map.set(String.fromCharCode(i + 64),'Cell'+i);
    }   
    let cell1 = td.innerText.substring(1, 3);
    let cell2 = td.innerText.substring(4, 6);

    console.log("Row" + cell1.substring(1,cell1.length) + "," + map.get(cell1[0]));
    console.log("Row" + cell2.substring(1,cell2.length) + "," + map.get(cell2[0]));

    let a = document.getElementById("Row" + cell1.substring(1,cell1.length) + "," + map.get(cell1[0]));
    let b = document.getElementById("Row" + cell2.substring(1,cell2.length) + "," + map.get(cell2[0]));
    let observer = obs.subscribe(x => {
        let sum = 0;
        if (td.getAttribute("operation") && td.getAttribute("type") == "sum") {
            td.innerText = parseInt(b.innerText) + parseInt(a.innerText);
        } else if (td.getAttribute("operation") && td.getAttribute("type") == "diff") {
            td.innerText = parseInt(a.innerText) - parseInt(b.innerText);
        } else if (td.getAttribute("operation") && td.getAttribute("type") == "mul") {
            td.innerText = parseInt(a.innerText) * parseInt(b.innerText);
        } else if (td.getAttribute("operation") && td.getAttribute("type") == "div") {
            td.innerText = parseInt(a.innerText) / parseInt(b.innerText);
        } else {
            observer.unsubscribe();
        }
    });
}

var addRow = document.getElementById("addRow");
addRow.addEventListener("click", function () {

    if (selectedRows.length != 1 || selectedRows.length == 0) {
        console.log("Inside Add Row");
        console.log(selectedRows.length);
        selectedRows.forEach((element) => {
            element.classList.remove("selectedCell");
        });
        selectedRows.length = 0; // Possible Bug       
        alert("Select Only One Row For Adding!")
    }
    else {
        let table = document.getElementById("Spreadsheet");
        let row = selectedRows[0];

        let index = row.rowIndex;
        console.log(index);
        let newRow = table.insertRow(index + 1);
        //newRow.setAttribute("id", "Row"+ index + ","+ "Cell"+ j);
        for (let i = 0; i < no_columns; i++) {
            let newCell = newRow.insertCell(i);
            if (i == 0) {
                newCell.setAttribute("contentEditable", "false");
                newCell.setAttribute("id", "Row" + index + "," + "Cell" + 0);
                newCell.addEventListener("click", function () {
                    selectedRow(newRow);
                }, false);
            }
            else {
                let col = document.getElementById("Row" + index + "," + "Cell" + i);
                let cellId;
                selectedColumns.forEach((element) => {
                    if (element.id[10] === undefined) {
                        cellId = element.id[9];
                    }
                    else {
                        cellId = Number(element.id[9] + element.id[10]);
                    }
                    if (cellId == i) {
                        console.log("Here");
                        newCell.setAttribute("class", "selectedCell");
                    }
                });
                newCell.setAttribute("contentEditable", "true");
                newCell.setAttribute("id", "Row" + index + "," + "Cell" + i);
                rxjs.fromEvent(newCell, 'input').pipe(rxjs.operators.debounceTime(300)).subscribe(x => {
                    if (td.innerText.toLowerCase().startsWith("=sum(") && td.innerText.endsWith(")")) {
                        let initalStr = td.innerText.substring(4, td.innerText.length);
                        let actualStr = initalStr.substring(1, initalStr.length - 1);
                        let arr = [];
                        actualStr.split(":").forEach(x => {
                            if (x.length > 1)
                                arr.push(x)
                        });
                        if (arr.length == 2) {
                            sum(td, arr);
                        }
                    } else if (td.innerText.startsWith("=", 0) && td.innerText.length >= 6) {
                        let operator = td.innerText.charAt(3);
                        if (operator === "+") {
                            td.setAttribute("operation", "true")
                            td.setAttribute("type", "sum")
                            operate(td, "+");
                        } else if (operator === "-") {
                            td.setAttribute("operation", "true")
                            td.setAttribute("type", "diff")
                            operate(td, "-");
                        } else if (operator === "*") {
                            td.setAttribute("operation", "true")
                            td.setAttribute("type", "mul")
                            operate(td, "*");
                        } else if (operator === "/") {
                            td.setAttribute("operation", "true")
                            td.setAttribute("type", "div")
                            operate(td, "*");
                        }
                    } else if (x.inputType == "deleteContentBackward" && td.getAttribute("operation") == "true") {
                        td.removeAttribute("operation");
                        td.removeAttribute("type");
                    }
                    obs.next(x.target);
                });
            }
        }
        selectedRows.forEach((element) => {
            element.classList.remove("selectedCell");
        });

        selectedRows.length = 0;
        no_rows = no_rows + 1;
        IdIndexingRows(index);
    }
});

const selectedRows = [];

const selectedRow = (x) => {
    console.log(x);
    if (x.classList.contains("selectedCell")) {
        x.classList.remove("selectedCell");
        selectedRows.pop(x);
        console.log(selectedRows);
    }
    else {
        x.classList.add("selectedCell");
        selectedRows.push(x);
        console.log(selectedRows);
    }
}

var deleteRow = document.getElementById("deleteRow");
deleteRow.addEventListener("click", function () {
    if (no_rows <= 2) {
        alert("Cannot Delete The Last Row");
    }
    else
        if (selectedRows.length != 1 || selectedRows.length == 0) {
            console.log("Inside Delete Row")
            console.log(selectedRows.length);
            selectedRows.forEach((element) => {
                element.classList.remove("selectedCell");
            });
            selectedRows.length = 0; // Possible Bug       
            alert("Select Only One Row For Deleting!")
        }
        else {
            let table = document.getElementById("Spreadsheet");
            let row = selectedRows[0];
            let index = row.rowIndex;
            let toDeleteRow = table.deleteRow(index);
            selectedRows.length = 0;
            no_rows = no_rows - 1;
            IdIndexingRows(index);
        }
}
)

var deleteColumn = document.getElementById("deleteColumn");
deleteColumn.addEventListener("click", function () {
    if (no_columns <= 2) {
        alert("Cannot Delete The Last Column");
    }
    else
        if (selectedColumns.size != 1 || selectedColumns.size == 0) {
            console.log("Inside Delete Column")
            selectedColumns.forEach((element) => {
                console.log(element);
                element.classList.remove("selectedCell");
                for (let i = 1; i < no_rows; i++) {
                    let cellId;
                    if (element.id[10] === undefined) {
                        cellId = element.id[9];
                    }
                    else {
                        cellId = Number(element.id[9] + element.id[10]);
                    }
                    let requiredId = "Row" + (i) + ",Cell" + cellId;
                    let col = document.getElementById(requiredId);
                    col.classList.toggle("selectedCell");
                }
            });
            selectedColumns.clear(); // Possible Bug  

            alert("Select Only One Column For Deleting!")
        }
        else {
            let table = document.getElementById("Spreadsheet");
            let iterator = selectedColumns.values();
            let column = iterator.next().value;
            if (column.id[10] === undefined) {
                cellId = column.id[9];
            }
            else {
                cellId = Number(column.id[9] + column.id[10]);
            }
            let x = table.rows;
            console.log(x);
            for (let i = 0; i < no_rows; i++) {
                let requiredId = "Row" + (i) + ",Cell" + cellId;
                x[i].deleteCell(cellId);
            }
            selectedColumns.clear();
            no_columns = no_columns - 1;
            IdIndexColumnDeletion(column.id[9]);
        }
});

var addColumn = document.getElementById("addColumn");
addColumn.addEventListener("click", function () {

    if (no_columns > max_columns) {
        alert("Cannot Add More Than 26 Columns");
    }
    else if (selectedColumns.size != 1 || selectedColumns.size == 0) {
        console.log("Inside Add Column")
        selectedColumns.forEach((element) => {
            console.log(element);
            element.classList.remove("selectedCell");
            for (let i = 1; i < no_rows; i++) {
                let cellId;
                if (element.id[10] === undefined) {
                    cellId = element.id[9];
                }
                else {
                    cellId = Number(element.id[9] + element.id[10]);
                }
                let requiredId = "Row" + (i) + ",Cell" + cellId;
                let col = document.getElementById(requiredId);
                col.classList.toggle("selectedCell");
            }
        });
        selectedColumns.clear();// Possible Bug  

        alert("Select Only One Column For Adding!")
    }
    else {
        let table = document.getElementById("Spreadsheet");
        let iterator = selectedColumns.values();
        let column = iterator.next().value;
        let cellId;
        if (column.id[10] === undefined) {
            cellId = column.id[9];
        }
        else {
            cellId = Number(column.id[9] + column.id[10]);
        }
        let rel = cellId + 1;
        for (let i = 0; i < no_rows; i++) {
            let id = column[0];
            let requiredId = "Row" + (i) + ",Cell" + cellId;
            let oldtd = document.getElementById(requiredId);
            let td = document.createElement("td");
            oldtd.insertAdjacentElement("afterend", td);
            if (i == 0) {
                td.setAttribute("contentEditable", "false");
                td.setAttribute("id", "Row" + (i) + ",Cell" + (cellId + 1));
                td.addEventListener("click", function () {
                    selectedColumn(td);
                }, false);
            }
            else {
                td.setAttribute("contentEditable", "true");
                td.setAttribute("id", "Row" + (i) + ",Cell" + (cellId + 1))
                rxjs.fromEvent(td, 'input').pipe(rxjs.operators.debounceTime(450)).subscribe(x => {
                    if (td.innerText.toLowerCase().startsWith("=sum(") && td.innerText.endsWith(")")) {
                        let initalStr = td.innerText.substring(4, td.innerText.length);
                        let actualStr = initalStr.substring(1, initalStr.length - 1);
                        let arr = [];
                        actualStr.split(":").forEach(x => {
                            if (x.length > 1)
                                arr.push(x)
                        });
                        if (arr.length == 2) {
                            sum(td, arr);
                        }
                    } else if (td.innerText.startsWith("=", 0) && td.innerText.length >= 6) {
                        let operator = td.innerText.charAt(3);
                        if (operator === "+") {
                            td.setAttribute("operation", "true")
                            td.setAttribute("type", "sum")
                            operate(td, "+");
                        } else if (operator === "-") {
                            td.setAttribute("operation", "true")
                            td.setAttribute("type", "diff")
                            operate(td, "-");
                        } else if (operator === "*") {
                            td.setAttribute("operation", "true")
                            td.setAttribute("type", "mul")
                            operate(td, "*");
                        } else if (operator === "/") {
                            td.setAttribute("operation", "true")
                            td.setAttribute("type", "div")
                            operate(td, "*");
                        }
                    } else if (x.inputType == "deleteContentBackward" && td.getAttribute("operation") == "true") {
                        td.removeAttribute("operation");
                        td.removeAttribute("type");
                    }
                    obs.next(x.target);
                });
            }
        }
        selectedColumns.forEach((element) => {
            console.log(element);
            element.classList.remove("selectedCell");
            for (let i = 1; i < no_rows; i++) {
                let cellId;
                if (element.id[10] === undefined) {
                    cellId = element.id[9];
                }
                else {
                    cellId = Number(element.id[9] + element.id[10]);
                }
                let requiredId = "Row" + (i) + ",Cell" + cellId;
                let col = document.getElementById(requiredId);
                col.classList.toggle("selectedCell");
            }
        });
        selectedColumns.clear();
        no_columns = no_columns + 1;
        IdIndexColumnDeletion(cellId);
    }

}
);

const IdIndexColumnDeletion = (delCol) => {
    console.log(selectedColumns.size);
    let table = document.getElementById("Spreadsheet");
    console.log(delCol);
    let x = table.rows;
    for (let i = 0; i < no_rows; i++) {
        for (let j = delCol; j < no_columns; j++) {
            let y = x[i].cells;
            if (i == 0) {
                y[j].innerText = String.fromCharCode(Number(j) + 64);
            }
            y[j].setAttribute("id", "Row" + i + "," + "Cell" + j);
        }
    }
}

const IdIndexingRows = (index) => {
    let table = document.getElementById("Spreadsheet");
    let x = table.rows;
    for (let i = index; i < no_rows; i++) {
        for (let j = 0; j < no_columns; j++) {
            let y = x[i].cells;
            y[0].innerText = i;
            y[j].setAttribute("id", "Row" + i + "," + "Cell" + j);
        }
    }
}

const selectedColumns = new Set();
const selectedColumn = (x) => {
    console.log(x);
    if (x.classList.contains("selectedCell")) {
        selectedColumns.delete(x);
        x.classList.remove("selectedCell");
        console.log("Delete");
        console.log(selectedColumns);
    }
    else {
        selectedColumns.add(x);
        x.classList.add("selectedCell"); //Possible
        console.log("Add")
        console.log(selectedColumns);
    }

    for (let i = 1; i < no_rows; i++) {
        let cellId;
        if (x.id[10] === undefined) {
            cellId = x.id[9];
        }
        else {
            cellId = Number(x.id[9] + x.id[10]);
        }
        let requiredId = "Row" + (i) + ",Cell" + (cellId);
        let col = document.getElementById(requiredId);
        col.classList.toggle("selectedCell");
    }
}

//exports the table data into CSV
const export_csv = (html, filename) => {
    let csv = [];
    let rows = document.querySelectorAll("table tr");
    //traversing
    for (var i = 0; i < rows.length; i++) {
        let row = [], cols = rows[i].querySelectorAll("td");
        for (var j = 0; j < cols.length; j++) {
            let newid = cols[j].id;
            let value = document.getElementById(newid).innerText;
            row.push(value);
        }
        csv.push(row.join(","));
    }
    download_csv(csv.join("\n"), filename);
}
var exportCSV = document.getElementById("exportCSV");
exportCSV.addEventListener("click", function () {
    var html = document.querySelector("table").outerHTML;
    export_csv(html, "Ouput.csv");
});


//this function downloads the csv
const download_csv = (csv, filename) => {
    var csvFile;
    var downloadLink;
    csvFile = new Blob([csv], { type: "text/csv" });
    downloadLink = document.createElement("a");

    //filename
    downloadLink.download = filename;

    //link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";

    //link appends to DOM
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

var uploadCSV = document.getElementById("uploadCSV");
uploadCSV.addEventListener("click", function () {
    var fileUpload = document.getElementById("fileUpload");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                var table = document.getElementById("Spreadsheet");
                let x = table.rows;
                for (j = 0; j < x.length; j++) {
                    // let index = j + 1;
                    table.deleteRow(j);
                    j = j - 1;
                }
                var body = document.getElementsByTagName("body")[0];
                body.removeChild(table);
                var rows = e.target.result.split("\n");
                no_rows = rows.length;
                for (var i = 0; i < rows.length; i++) {
                    var cell = rows[0].split(",");
                    if (cell.length > max_columns) {
                        alert("Showing maximum possible columns");
                        init_cols = max_columns;
                    }
                    else {
                        let temp = cell.length + 1;
                        init_cols = temp;
                    }
                }

                window.onload();
                
                let table1 = document.getElementsByTagName("table")[0];
                let x1 = table1.rows;
                let r = e.target.result.split("\n");
                //init_rows = rows.length;
                for (let l = 0, i = 1; l < r.length, i < no_rows; i++ , l++) {
                    var cell = r[l].split(",");
                    if (cell.length < max_columns) {
                        for (let k = 0, j = 1; k < cell.length, j < no_columns; k++ , j++) {
                            let y = x1[i].cells;
                            y[j].innerText = cell[k];
                        }
                    }
                    else {
                        for (let k = 0, j = 1; k < max_columns, j < no_columns; k++ , j++) {
                            let y = x1[i].cells;
                            y[j].innerText = cell[k];
                        }
                    }
                }

            }
            reader.readAsText(fileUpload.files[0]);

        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid CSV file.");
    }
});