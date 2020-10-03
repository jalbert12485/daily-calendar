//The variable i will be used as an index in loops and todo will be the list of events we want to keep track of.
var i=0;
var todo=[];

// Will retrieve the locally stored data for "to do"s.  In none exists, it will initialize the data.
retrieveTodoLocal();

// Here, we create the display of time rows. We run this 24 times in order to create a row for each hour of the day.
for(i=0; i < 24; i++){
    var j=i % 12; 
    if(j==0){
        j=12;
    }
    // This will create a form.
    var newRowForm=$("<form>");
        newRowForm.attr("data-time",i);
        newRowForm.attr("class", "row formRow");
    // Here we create a button to display the time corresponding to the row.
    var newTimeSlot=$("<button>");
        newTimeSlot.text(j+":00");
        newTimeSlot.attr("class","list-group-item list-group-item-action list-group-item-secondary col-2 round-left time"); 
        // We next create an input box for this row.
    var newInputSlot=$("<input>");
        newInputSlot.attr("class", "list-group-item list-group-item-action list-group-item-primary col-6  typing");
        // Here, we create a view button that will display the modal with the list of "to do"s for the hour.
    var newDisplaySlot=$("<button>");
        newDisplaySlot.attr("class", "list-group-item list-group-item-action list-group-item-primary col-2  view-todo");        
        newDisplaySlot.text("View "+ todo[i].length);
        newDisplaySlot.attr("data-toggle","modal");
        newDisplaySlot.attr("data-target","#viewModal");
        // Lastly, we have a button that will save the input.
    var newCheckBox=$("<button>");
        newCheckBox.html("&#9745;");
        newCheckBox.attr("class", "list-group-item list-group-item-action list-group-item-secondary col-2  round-right save");

        //Now that we've created our items, we append them to the container for the rows.
    newRowForm.append(newTimeSlot);
    newRowForm.append(newInputSlot);
    newRowForm.append(newDisplaySlot);
    newRowForm.append(newCheckBox);
    $("#time-block-container").append(newRowForm);
}

// We are creating an array of all the time buttons
var buttonsTimeAll=document.querySelectorAll(".time");

// We make it so the time buttons don't actually do anything.  Note, we only made these buttons to create a consistent layout.
for(i=0; i< buttonsTimeAll.length; i++){
buttonsTimeAll[i].addEventListener("click", function(event){
    event.preventDefault();
});}

// We create an array all the forms (rows) that we created for the day.
var formBoxesAll=document.querySelectorAll(".formRow");

//This function saves the current todo array to the local storage.
function saveTodoLocal(){
    localStorage.setItem("todo",JSON.stringify(todo));
}

//This function retrieves the "to do"s in local storage nad saves them to the todo variable.
function retrieveTodoLocal(){
    todo=JSON.parse(localStorage.getItem("todo"));
    // If there was nothing in the local storage, or it was not the correct length, we reinitialize the data to the correct length.
    if(todo===null || todo.length != 24){
        todo=[];
        for(i=0; i<24; i++){
            todo.push([]);
        }
        saveTodoLocal();
        retrieveTodoLocal();
    }
}

// Here we create an array of input boxes from each time row.
var inputBoxesAll=document.querySelectorAll(".typing");

// We now add an event listener to these inputs so that if the user presses 'enter' the information they typed in will be added to the todo array, then saved to local storage.
for(i=0; i< formBoxesAll.length; i++){
inputBoxesAll[i].addEventListener("keydown", function(event){
    // If they press enter
    if(event.keyCode==13){
        //If the input is non-empty
        if(this.value != ""){
            // Push the new value, then save to local and reload page.
            todo[this.parentElement.dataset.time].push(this.value);
            saveTodoLocal();
            location.reload();
        }
  
    }
});
}

// This creates an array of all the save buttons (with check marks).
var saveBoxesAll=document.querySelectorAll(".save");

// We then add a listener to these boxes that behaves similar to the clicking enter on input boxes.  The only difference is that it works on click.
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

// We set up an array of the view buttons and use a variable to track which one was last pushed.
var viewBoxesAll=document.querySelectorAll(".view-todo");
var lastClickedTime=0;

// For all of the view buttons, we create a listener which will change the last time clicked and run the refresh modal function.
for(i=0; i< viewBoxesAll.length; i++){
    viewBoxesAll[i].addEventListener("click", function(event){
        event.preventDefault();
        lastClickedTime=this.parentElement.dataset.time;
        refreshModal();
    });}

        // This function changes the title and body of the modal so that it will correspond to the requested information with regard to time clicked.
function refreshModal(){
        //The modal title will be the time (instead of 0:00 we have 12:00 show up).
        if(lastClickedTime%12==0){
        $("#myModalTitle").html("<h1>12:00</h1>")
    }else{
        $("#myModalTitle").html("<h1>"+(lastClickedTime %12) + ":00</h1>") 
    }
        //Empties the body if there is any content already in there.
    $("#myModalBody").empty();

    // We create an unorder list and append it to the modal body.
    var newUl=$("<ul>");
    newUl.html("<h2>To do List<h2>");
    newUl.attr("id","myModalUl");
    $("#myModalBody").append(newUl);
    
    //For each "to do" for the corresponding time, we create a list item.  We then append these list items into the unordered list in the modal.
    for(var j=0; j< todo[lastClickedTime].length; j++){
    var newLi=$("<li>");
    newLi.html("<h4>" + todo[lastClickedTime][j] + "</h4> <button class='myModalComplete btn btn-secondary' data-completetime=' "+lastClickedTime+" ' data-complete=' "+j+" '>Complete</button>");
    $("#myModalUl").append(newLi);
    }
    }   
 
        
  


 
    // When the modal but is up, we will listen for the user to click on one of the created complete buttons.
    $("#myModalBody").on("click",function(event){
        var completeTime=Number(event.target.dataset.completetime);
        var listItemNumber=Number(event.target.dataset.complete);
        // When the complete button is pressed we remove the corresponding element for the "to do" array and save changes to local storage.
        if(event.target.dataset.completetime != null){
            todo[completeTime].splice(listItemNumber,1);
        }
        saveTodoLocal();
        // We then refresh the modal to show the new information and refresh the view button to give the correct number of "to do"s left in that hour.
        refreshModal();
        viewBoxesAll[lastClickedTime].textContent="View "+ todo[lastClickedTime].length;
    })

    // On the complete all button, we add a listener which resets the "to do"s when clicked.
    $("#completeAll").on("click",function(){
        todo=[];
        saveTodoLocal();
        location.reload();
    });

    // This function sets the coloring of the page based on the current time and nubmer of "to do"s in a given hour.
    function refreshPage() {
        // create a variable for the given time of day and saves as a number.
        var currentTime=moment().startOf('day').fromNow();
        currentTime=Number(currentTime.slice(0,2));
       
     
        // This part loops through all the inputs to change color.
        for(i=0; i< 24; i++){
            var timeSlot=formBoxesAll[i].dataset.time;
            if(timeSlot < currentTime){
                inputBoxesAll[i].setAttribute("class", "list-group-item list-group-item-action list-group-item-danger col-6  typing");
            } else if(timeSlot==currentTime){
                inputBoxesAll[i].setAttribute("class", "list-group-item list-group-item-action list-group-item-light col-6  typing");
            }
            // Here, we loop through view buttons and change color if there is something to do.
            if(todo[i].length != 0){
                viewBoxesAll[i].setAttribute("class","list-group-item list-group-item-action list-group-item-warning col-2  view-todo");
            }
        }
        // Loops through the inputs and changes the placeholder to last input task.
        for(i=0; i< 24; i++){
            if(todo[i].length > 0){
            inputBoxesAll[i].placeholder=todo[i][todo[i].length-1];
            }
        }


    }

    //Add a listener that refreshes the page when the close modal button is pressed.
    $("#modalClose").on("click",function(){
        location.reload();
    });

    //Runs our refresh page function on load.
    refreshPage();

