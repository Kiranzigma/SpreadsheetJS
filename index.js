
var no_rows = 10;
var no_columns = 10;
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
                td.setAttribute("editable","false");
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
                td.setAttribute("editable","true");
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
    console.log("Inside Add Row")
    if(selectedRows.size!=1 || selectedRows.size==0){
        alert("Select Only One Row For Adding!")
    }
    else {
        let table = document.getElementById("Spreadsheet");
        console.log(table);
        
    }
})

const selectedRows = new Set();

const selectedRow = (x) => {
    console.log(x);
if(x.classList.contains("selectedCell")){
    x.classList.remove("selectedCell");
    selectedRows.delete(x);
    console.log("Deleted");
    console.log(selectedRows.size);
}
else{
    x.classList.add("selectedCell");
    selectedRows.add(x);
    console.log("Selected");
    console.log(selectedRows.size);
}
}

var deleteRow = document.getElementById("deleteRow");
deleteRow.addEventListener("click", function(){
    if(no_rows<=2){
        alert("Cannot Delete The Last Row");
    }
    else{
        console.log("Inside Delete Row")
        if(selectedRows.size!=1 || selectedRows.size==0){
        alert("Select Only One Row For Deleting!")
    }
        else{
            let table = document.getElementsByTagName("table")[0];
            let iterator = selectedRows.values();
            let row = iterator.next().value;
            let index = row.rowIndex;
            let toDeleteRow = table.deleteRow(index);
            selectedRows.clear();
            no_rows= no_rows-1;
            IdIndexingRows(index);
        }
    }
})

const IdIndexingRows = (index) => {
    let table = document.getElementById("Spreadsheet");
    let x = table.rows;
    for(let i=index;i<no_rows;i++){
        for(let j=0;j<no_columns;j++){
            let y = x[i].cells;
            y[0].innerText = i;
            y[j].setAttribute("id","Row"+ i + ","+ "Cell"+ j);
        }
    }

}