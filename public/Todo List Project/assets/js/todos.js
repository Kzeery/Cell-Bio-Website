//Check Off Specific Todos By Clicking
$("ul").on("click", "li", function() {
    $(this).toggleClass("completed");
});

//Click On X To Delete Todo
$("ul").on("click", "span", function(event) {
    $(this).parent().fadeOut(500, function() {
        $(this).remove();
    });
    event.stopPropagation();
});

$("input[type='text']").on("keypress", function(event) {
    if(event.which === 13) {
        var todoText = $(this).val();
        $("ul").append("<li><span><i class='fa fa-trash'></i></span> " + todoText + "</li>");
        $(this).val("");
    }
});

$("#plus").on("click", function() {
    $("input[type='text']").fadeToggle();
});