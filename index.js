
var no_rows = 11;
var no_columns = 11;
var max_columns = 26;

 window.onload = () => {
     console.log("Loaded");
     let table = document.createElement("table");
     table.setAttribute("id","Spreadsheet");
     for(let i=0;i<no_rows;i++){
        let tr = document.createElement("tr");
         for(let j=0;j<no_columns;j++){
            let td = document.createElement("td");

            if(i==0 & j==0){
                td.setAttribute("id","Row"+ i + ","+ "Cell"+ j);
                td.setAttribute("contentEditable","false");
            }

            if(i==0 & j>0){
                td.setAttribute("id","Row"+ i + ","+ "Cell"+ j);
                let text= document.createTextNode(String.fromCharCode(j+64));
                td.addEventListener("click",function(){
                    selectedColumn(td);
                },false);
                td.appendChild(text);
            }

            else if(j==0 & i>0){
                td.setAttribute("id","Row"+ i + ","+ "Cell"+ j);
                let text = document.createTextNode(i);
                td.addEventListener("click",function(){
                    selectedRow(tr);
                },false);
                td.appendChild(text);
            }

            else{
                td.setAttribute("contentEditable","true");
                td.setAttribute("id","Row"+ i + ","+ "Cell"+ j);
            }

            tr.appendChild(td);
        }
        table.appendChild(tr);
     }
     document.body.appendChild(table);
 }


var addRow = document.getElementById("addRow");
 addRow.addEventListener("click",function() {
     
    if(selectedRows.length!=1 || selectedRows.length==0){
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
        let newRow = table.insertRow(index);
        //newRow.setAttribute("id", "Row"+ index + ","+ "Cell"+ j);
        for(let i=0; i< no_columns;i++){
            let newCell = newRow.insertCell(i);
            if(i==0){
                newCell.setAttribute("contentEditable","false");
                newCell.setAttribute("id","Row"+ index + ","+ "Cell"+ 0);
                newCell.addEventListener("click", function(){
                    selectedRow(newRow);
                },false);
            }
            else{
                newCell.setAttribute("contentEditable","true");
                newCell.setAttribute("id","Row"+ index + ","+ "Cell"+ i);
            }
        }
        selectedRows.forEach((element) => {
            element.classList.remove("selectedCell");
        });

        selectedRows.length =0; // Possible
        no_rows = no_rows+1;
        IdIndexingRows(index);
    }
});

const selectedRows = [];

const selectedRow = (x) => {
    console.log(x);
if(x.classList.contains("selectedCell")){
    x.classList.remove("selectedCell");
    selectedRows.pop(x);
    console.log("Deleted");
    console.log(selectedRows);
}
else{
    x.classList.add("selectedCell");
    selectedRows.push(x);
    console.log("Selected");
    console.log(selectedRows);
}
}

var deleteRow = document.getElementById("deleteRow");
deleteRow.addEventListener("click", function(){
    if(no_rows<=2){
        alert("Cannot Delete The Last Row");
    }
    else
    if(selectedRows.length!=1 || selectedRows.length==0){
        console.log("Inside Delete Row")
        console.log(selectedRows.length);
        selectedRows.forEach((element) => {
            element.classList.remove("selectedCell");
        });
        selectedRows.length = 0; // Possible Bug       
        alert("Select Only One Row For Deleting!")      
    }
    else{
            let table =  document.getElementById("Spreadsheet");
            let row = selectedRows[0];
            let index = row.rowIndex;
            let toDeleteRow = table.deleteRow(index);
            selectedRows.length = 0;
            no_rows= no_rows-1;
            IdIndexingRows(index);
        }
    }
)

var deleteColumn = document.getElementById("deleteColumn");
deleteColumn.addEventListener("click",function() {
    if(no_columns<=2){
        alert("Cannot Delete The Last Column");
    }
    else 
    if(selectedColumns.size!=1 || selectedColumns.size ==0){
        console.log("Inside Delete Column")
        selectedColumns.forEach((element) => {
            console.log(element);
            element.classList.remove("selectedCell");
            for(let i=1;i<no_rows;i++){
                let cellId;
                if(element.id[10]===undefined){
                cellId = element.id[9];
                }
                else
                {
                cellId = Number(element.id[9]+element.id[10]); 
                }
                let requiredId = "Row"+(i)+",Cell"+cellId;
                let col = document.getElementById(requiredId);
                col.classList.toggle("selectedCell");
        } 
        });
        selectedColumns.clear(); // Possible Bug  
            
        alert("Select Only One Column For Deleting!")
        }
    else{
        let table =  document.getElementById("Spreadsheet");
        let iterator = selectedColumns.values();
        let column = iterator.next().value;
        if(column.id[10]===undefined){
            cellId = column.id[9];
        }
            else
        {
            cellId = Number(column.id[9]+column.id[10]); 
        }
        let x = table.rows;
        console.log(x);
        for(let i=0;i<no_rows;i++){
            let requiredId = "Row"+(i)+",Cell"+cellId;
            x[i].deleteCell(cellId);
        }
        selectedColumns.clear();
        no_columns= no_columns-1;
        IdIndexColumnDeletion(column.id[9]);
    }
});

var addColumn = document.getElementById("addColumn");
 addColumn.addEventListener("click",function() {
     
    if(no_columns>max_columns){
        alert("Cannot Add More Than 26 Columns");
    }
    else if(selectedColumns.size!=1 || selectedColumns.size ==0){
        console.log("Inside Add Column")
        selectedColumns.forEach((element) => {
            console.log(element);
            element.classList.remove("selectedCell");
            for(let i=1;i<no_rows;i++){
                let cellId;
                if(element.id[10]===undefined){
                cellId = element.id[9];
                }
                else
                {
                cellId = Number(element.id[9]+element.id[10]); 
                }
                let requiredId = "Row"+(i)+",Cell"+cellId;
                let col = document.getElementById(requiredId);
                col.classList.toggle("selectedCell");
        } 
        });
        selectedColumns.clear();// Possible Bug  
            
        alert("Select Only One Column For Adding!")
        }
        else{
            let table =  document.getElementById("Spreadsheet");
            let iterator = selectedColumns.values();
            let column = iterator.next().value;
            let cellId;
            if(column.id[10]===undefined){
                cellId = column.id[9];
            }
                else
            {
                cellId = Number(column.id[9]+column.id[10]); 
            }
            let rel = cellId +1;
            for(let i=0;i<no_rows;i++){
                let id = column[0];
                let requiredId = "Row"+(i)+",Cell"+cellId;
                let oldtd = document.getElementById(requiredId);
                let td = document.createElement("td");
                oldtd.insertAdjacentElement("afterend",td);
                if(i==0){
                    td.setAttribute("contentEditable","false");
                    td.setAttribute("id","Row"+(i)+",Cell"+(cellId+1));
                    td.addEventListener("click",function(){         
                        selectedColumn(td);
                    },false);
                }
                else{  
                    td.setAttribute("contentEditable","true");
                    td.setAttribute("id","Row"+(i)+",Cell"+(cellId+1))
                }
            }
            selectedColumns.forEach((element) => {
                console.log(element);
                element.classList.remove("selectedCell");
                for(let i=1;i<no_rows;i++){
                let cellId;
                if(element.id[10]===undefined){
                cellId = element.id[9];
                }
                else
                {
                    cellId = Number(element.id[9]+element.id[10]); 
                }
                    let requiredId = "Row"+(i)+",Cell"+cellId;
                    let col = document.getElementById(requiredId);
                    col.classList.toggle("selectedCell");
            } 
            });
            selectedColumns.clear();
            no_columns= no_columns+1;
            IdIndexColumnDeletion(cellId);
        }
    
    }
);

const IdIndexColumnDeletion = (delCol) => {
    console.log(selectedColumns.size);
    let table =  document.getElementById("Spreadsheet");
    console.log(delCol);
    let x = table.rows;
   for(let i=0; i<no_rows;i++){
       for(let j=delCol; j<no_columns;j++){
           let y = x[i].cells;
           if(i==0){
           y[j].innerText = String.fromCharCode(Number(j)+64);
           }
           y[j].setAttribute("id","Row"+ i + ","+ "Cell"+ j);
       }
   }
}

const IdIndexingRows = (index) => {
    let table = document.getElementById("Spreadsheet");
    let x = table.rows;
    console.log(x);
    for(let i=index;i<no_rows;i++){
        for(let j=0;j<no_columns;j++){
            let y = x[i].cells;
            y[0].innerText = i;
            y[j].setAttribute("id","Row"+ i + ","+ "Cell"+ j);
        }
    }
}

const selectedColumns = new Set();
const selectedColumn = (x) => {
    console.log(x);
    if(x.classList.contains("selectedCell")){
        selectedColumns.delete(x);
        x.classList.remove("selectedCell");
        console.log("Delete");
        console.log(selectedColumns);
    }
    else{
        selectedColumns.add(x);
        x.classList.add("selectedCell"); //Possible
        console.log("Add")
        console.log(selectedColumns);
    }

    for(let i=1;i<no_rows;i++){
        let cellId;
        if(x.id[10]===undefined){
         cellId = x.id[9];
        }
        else
        {
         cellId = Number(x.id[9]+x.id[10]); 
        }
        let requiredId = "Row"+(i)+",Cell"+(cellId);
        let col = document.getElementById(requiredId);
        col.classList.toggle("selectedCell");
}
}
