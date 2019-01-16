$(function() {

    $(".save").on("click", function(event) {
        event.preventDefault();
        var id = $(this).attr("data-saveId");
        
        $.ajax({
            method: "put",
            url: "/save/" + id
          })
            .then(function(result) {
             console.log(result); 
             $("*[data-saveId="+id+"]").removeClass("btn-primary");
             $("*[data-saveId="+id+"]").addClass("btn-success").text("SAVED");
            });
    });

    $(".edit").on("click", function(event) {
        event.preventDefault();
        var id = $(this).attr("data-edit");
        var notes = $("*[data-field="+id+"]").val().trim();
        $("*[data-field="+id+"]").val("")
        

        var noteToSend = {
            id: id,
            body: notes
        };
        console.log(noteToSend);

        $.ajax({
            method: "post",
            url: "/submit",
            data: noteToSend
        })
          .then(function(result) {
              console.log(result);
              $("*[data-notes="+id+"]").click();
          });
    });

    $(".retrieve").on("click", function(event) {
        event.preventDefault();
        var id = $(this).attr("data-getNote");
        console.log(id);
        $.ajax({
            method: "get",
            url: "/getNotes/" + id
        })
          .then(function(result) {
              console.log(result);
              for (i in result.note) {
                $("*[data-field="+id+"]").append(result.note[i].body+"\n");
              }
              
          });
    });


    $("#add-btn").on("click", function(event) {
        event.preventDefault();
        
        $.ajax({
            method: "get",
            url: "/articles"
          })
            .then(function(result) {
             console.log(result); 
        
            });
    });

    $(".delete").on("click", function(event) {
        event.preventDefault();
        var id = $(this).attr("data-delid");
        
        $.ajax({
            method: "DELETE",
            url: "/deleteArticle/" + id
          })
            .then(function(result) {
             console.log(result); 
             location.reload();
        
            });
    });

    $(".getNotes").on("click", function(event) {
        event.preventDefault();
        var id = $(this).attr("data-notes");
        console.log(id);
        $.ajax({
            method: "get",
            url: "/getNotes/" + id
        })
          .then(function(result) {
              console.log(result._id);
              modal.style.display = "block";
            
            if (result.note.length > 0) {
              for (i in result.note) {
                
                $("#noteField").append("<div>" + result.note[i].body + "<span class='closeNote' data-x=" + result.note[i]._id + " data-parent=" + result._id + "> X</span></div>");
              }
            }
            else {
                $("#noteField").append("No Notes Submitted!");
            }
              
          });
    });

    $( '#myModal' ).on( 'click', '.closeNote', function (event) {
        event.preventDefault();
        var id = $(this).attr("data-x");
        $(this).parent().remove();
        
        $.ajax({
            method: "DELETE",
            url: "/deleteNote/" + id
          })
            .then(function(result) {
             console.log(result); 

            });
    });

    //////////////////hide modal//////////////////////////////

var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];
span.onclick = function() {
    modal.style.display = "none";
    $("#noteField").empty();
}


window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        $("#noteField").empty();
    }
}

 
});