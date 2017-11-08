
function TextToJSONify(text){
    var returnObj;
    returnObj=text.split();
    return returnObj;
};

$(function(){
    $('#post').click(function(){
        var text=$('#query').val();
        var queryObjectStr=TextToJSONify(text);
        $.ajax({
            type: 'POST',
            url: "http://13.64.116.230:3000/analyze",
            data: queryObjectStr,
            success: function(InsRes){
                alert(JSON.stringify(InsRes.body));
                console.log("GET: this is the status: "+status);
                console.log("GET this is the xhr "+xhr);
                $('#responseTextArea').val(JSON.stringify(InsRes.body));
            },
            error: function(e) {
                $('#responseTextArea').val(JSON.stringify(e));
                console.log(e);
                alert(JSON.stringify(e));
            },
            dataType: "json",
            contentType: "application/json; charset=utf-8"
        });
    })
});