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
        console.log(notes);
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

 
});