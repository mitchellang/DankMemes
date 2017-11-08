
google.charts.load('current', {'packages':['gauge']});
google.charts.setOnLoadCallback(drawChart);

function drawChart(t1,t2,t3,nsfwScore) {
    // if(t1>5){t1=5;}
    // if(t2>5){t2=5;}
    // if(t3>5){t3=5;}
    var data = google.visualization.arrayToDataTable([
        ['rofl', 'Value'],
        ['Current Events', t1*20],
        ['Science', t2*20],
        ['Food', t3*20],
        // ['wat', t4*20],
        // ['lol', t5*20],
        // ['Harass Lvl', nsfwScore*100]
    ]);

    var options = {
        width: 1000, height: 300,
        redFrom: 90, redTo: 100,
        yellowFrom:75, yellowTo: 90,
        minorTicks: 5
    };

    var chart = new google.visualization.Gauge(document.getElementById('chart_div'));

    chart.draw(data, options);
}

function TextToJSONify(text){
    var returnObj;
    var tagArr=text.split(" ");
    returnObj={"tags":tagArr};
    return returnObj;
};

$(function(){
    var tagArr=[];
    var nsfwScore=0;
    $('#post').click(function () {
        var url = $('#imgQuery').val();
        document.getElementById("IMAGE").src=url;
        var urlObj = JSON.stringify({"url": url});
        var params = {
            // Request parameters
        };
        var tagArr = [];

        if (url === "") {
            var textArr = $('#query').val().split(" ");
            //add text to taggArr
            for (var i in textArr) {
                tagArr.push(textArr[i]);
            }
            console.log(tagArr);
            $.ajax({
                type: 'POST',
                url: "http://13.64.116.230:3000/analyze",
                data: {"tags": tagArr},
                success: function (res) {
                    // alert(JSON.stringify(res));

                    //TODO############################################################
                    var nsfwScore = 0;
                    drawChart(res['1'], res['2'],res['3'], nsfwScore);
                    tagArr = [];
                    return;
                },
                error: function (e) {
                    console.log(e);
                    alert(JSON.stringify(e));
                    tagArr=[];
                    return;
                }
            });
        } else {



        $.ajax({
            url: "https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Categories,Adult,Tags" + $.param(params),
            beforeSend: function (xhrObj) {
                // Request headers
                xhrObj.setRequestHeader("Content-Type", "application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "af5e7a515c2549ee9a528e125003a121");
            },
            type: "POST",
            // Request body
            data: urlObj,
        }).done(function (data) {
            console.log(data);
            for (var tg in data.tags) {
                if (data.tags[tg].confidence > 0.80) {
                    tagArr.push(data.tags[tg].name);
                }
            }
            nsfwScore=data.adult.adultScore;
        }).done(function (data) {
                //Prepare form data
                var formData = new FormData();
                formData.append("url", url);
                formData.append("language", "eng");
                formData.append("apikey", "9f368da3dd88957");
                //Send OCR Parsing request asynchronously
                $.ajax({
                    url: "https://api.ocr.space/parse/image",
                    data: formData,
                    dataType: 'json',
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    success: function (ocrParsedResult) {
                        //Get the parsed results, exit code and error message and details
                        var parsedResults = ocrParsedResult["ParsedResults"];
                        //If we have got parsed results, then loop over the results to do something
                        if (parsedResults != null) {
                            //Loop through the parsed results
                            for (var value in parsedResults) {
                                var text = parsedResults[value]["ParsedText"].split(" ");
                                for (var word in text) {
                                    var newWord = text[word].replace("\r", "").replace("\n", "");
                                    if (newWord === "") {
                                        continue;
                                    }
                                    tagArr.push(newWord);
                                }
                                ;
                            }
                            ;
                        }
                    },
                    error: function (e) {
                        alert(e);
                    }
                }).done(function () {
                    var textArr = $('#query').val().split(" ");
                    //add text to taggArr
                    for (var i in textArr) {
                        tagArr.push(textArr[i]);
                    }
                    console.log(tagArr);
                    $.ajax({
                        type: 'POST',
                        url: "http://13.64.116.230:3000/analyze",
                        data: {"tags": tagArr},
                        success: function (res) {
                            // alert(JSON.stringify(res));

                            //TODO############################################################
                            drawChart(res['1'], res['2'],res['3'], nsfwScore);
                            console.log("GET: this is the status: " + status);
                            console.log("GET this is the xhr " + xhr);
                            tagArr = [];
                        },
                        error: function (e) {
                            console.log(e);
                            alert(JSON.stringify(e));
                            tagArr=[];
                        }
                    })
                })
            }).fail(function (e) {
            console.log(e);
            alert("error");
        }); 
        }
    });
});