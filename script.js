var i=0;
var todo=[];


function init(){
    retrieveTodoLocal();

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
        newDisplaySlot.attr("data-toggle","modal");
        newDisplaySlot.attr("data-target","#viewModal");
    var newCheckBox=$("<button>");
        newCheckBox.html("&#9745;");
        newCheckBox.attr("class", "list-group-item list-group-item-action list-group-item-secondary col-2  round-right save");

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



// for(i=0; i< formBoxesAll.length; i++){
// formBoxesAll[i].addEventListener("submit",function(event){
//     if(this.children[1].value != ""){
//     todo[this.dataset.time].push(this.children[1].value);
//     saveTodoLocal();}

// });}

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
        if(this.value != ""){
            todo[this.parentElement.dataset.time].push(this.value);
            saveTodoLocal();
            location.reload();
        }
  
    }
});
}

var saveBoxesAll=document.querySelectorAll(".save");

for(i=0; i< saveBoxesAll.length; i++){
saveBoxesAll[i].addEventListener("click", function(event){
    event.preventDefault();
        if(this.parentElement.children[1].value != ""){
            todo[this.parentElement.dataset.time].push(this.parentElement.children[1].value);
            saveTodoLocal();
            location.reload();
        }

});
}

var viewBoxesAll=document.querySelectorAll(".view-todo");
var lastClickedTime=0;

for(i=0; i< viewBoxesAll.length; i++){
    viewBoxesAll[i].addEventListener("click", function(event){
        event.preventDefault();
        lastClickedTime=this.parentElement.dataset.time;
        refreshModal();
    });}

        
function refreshModal(){
        if(lastClickedTime%12==0){
        $("#myModalTitle").html("<h1>12:00</h1>")
    }else{
        $("#myModalTitle").html("<h1>"+(lastClickedTime %12) + ":00</h1>") 
    }

    $("#myModalBody").empty();

    var newUl=$("<ul>");
    newUl.html("<h2>To do List<h2>");
    newUl.attr("id","myModalUl");
    $("#myModalBody").append(newUl);
    
    for(var j=0; j< todo[lastClickedTime].length; j++){
    var newLi=$("<li>");
    newLi.html("<h4>" + todo[lastClickedTime][j] + "</h4> <button class='myModalComplete btn btn-secondary' data-completetime=' "+lastClickedTime+" ' data-complete=' "+j+" '>Complete</button>");
    $("#myModalUl").append(newLi);
    }
    }   
 
        
  


 

    $("#myModalBody").on("click",function(event){
        var completeTime=Number(event.target.dataset.completetime);
        var listItemNumber=Number(event.target.dataset.complete);
        if(event.target.dataset.completetime != null){
            todo[completeTime].splice(listItemNumber,1);
        }
        saveTodoLocal();
        refreshModal();
        viewBoxesAll[lastClickedTime].textContent="View "+ todo[lastClickedTime].length;
    })

    $("#completeAll").on("click",function(){
        todo=[];
        saveTodoLocal();
        location.reload();
    });

    function refreshPage() {
        var currentTime=moment().startOf('day').fromNow();
        currentTime=Number(currentTime.slice(0,2));
       
     

        for(i=0; i< 24; i++){
            var timeSlot=formBoxesAll[i].dataset.time;
            if(timeSlot < currentTime){
                inputBoxesAll[i].setAttribute("class", "list-group-item list-group-item-action list-group-item-danger col-6  typing");
            } else if(timeSlot==currentTime){
                inputBoxesAll[i].setAttribute("class", "list-group-item list-group-item-action list-group-item-light col-6  typing");
            }
            if(todo[i].length != 0){
                viewBoxesAll[i].setAttribute("class","list-group-item list-group-item-action list-group-item-warning col-2  view-todo");
            }
        }
        for(i=0; i< 24; i++){
            if(todo[i].length > 0){
            inputBoxesAll[i].placeholder=todo[i][todo[i].length-1];
            }
        }


    }

    refreshPage();

