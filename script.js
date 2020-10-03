var i=0;
var todo=[];


function init(){
    retrieveTodoLocal();
    console.log(todo);
}

init();


for(i=0; i < 24; i++){
    var j=i % 12; 
    if(j==0){
        j=12;
    }
    var newRowForm=$("<form>");
        newRowForm.attr("data-time",i);
        newRowForm.attr("class", "row formRow");
    var newTimeSlot=$("<button>");
        newTimeSlot.text(j+":00");
        newTimeSlot.attr("class","list-group-item list-group-item-action list-group-item-secondary col-2 round-left time"); 
    var newInputSlot=$("<input>");
        newInputSlot.attr("class", "list-group-item list-group-item-action list-group-item-primary col-6  typing");
    var newDisplaySlot=$("<button>");
        newDisplaySlot.attr("class", "list-group-item list-group-item-action list-group-item-primary col-2  view-todo");        
        newDisplaySlot.text("View "+ todo[i].length);
    var newCheckBox=$("<button>");
        newCheckBox.html("&#9745;");
        newCheckBox.attr("class", "list-group-item list-group-item-action list-group-item-secondary col-2  round-right submit save");

    newRowForm.append(newTimeSlot);
    newRowForm.append(newInputSlot);
    newRowForm.append(newDisplaySlot);
    newRowForm.append(newCheckBox);
    $("#time-block-container").append(newRowForm);
}

var buttonsTimeAll=document.querySelectorAll(".time");

for(i=0; i< buttonsTimeAll.length; i++){
buttonsTimeAll[i].addEventListener("click", function(event){
    event.preventDefault();
});}


var formBoxesAll=document.querySelectorAll(".formRow");



for(i=0; i< formBoxesAll.length; i++){
formBoxesAll[i].addEventListener("submit",function(event){
    if(this.children[1].value != ""){
    todo[this.dataset.time].push(this.children[1].value);
    saveTodoLocal();}

});}

function saveTodoLocal(){
    localStorage.setItem("todo",JSON.stringify(todo));
}

function retrieveTodoLocal(){
    todo=JSON.parse(localStorage.getItem("todo"));
    if(todo===null || todo.length != 24){
        todo=[];
        for(i=0; i<24; i++){
            todo.push([]);
        }
        saveTodoLocal();
        retrieveTodoLocal();
    }
}

var inputBoxesAll=document.querySelectorAll(".typing");

for(i=0; i< formBoxesAll.length; i++){
inputBoxesAll[i].addEventListener("keydown", function(event){
    if(event.keyCode==13){
        this.parentElement.submit();
    }
});
}

var viewBoxesAll=document.querySelectorAll(".view-todo");

for(i=0; i< viewBoxesAll.length; i++){
    viewBoxesAll[i].addEventListener("click", function(event){
        event.preventDefault();
    });}
