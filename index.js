// https://stackoverflow.com/questions/7431268/how-to-read-data-from-csv-file-using-javascript/12289296#12289296
$(document).ready(function() {
	var questions = [];
	var current_question_id = 0;
	var q_cnt = [0, 0, 0, 0];
	var current_answers = [];
	var correct_answers = [];
	var selected_answers = [0, 0, 0, 0];
	var selected;

    $.ajax({
        type: "GET",
        url: "Questions_data_prj3.csv",
        dataType: "text",
        contentType: "text/plain",
        success: function(data) { 
        	getQuestionText(data); 
        }
    });

	$.ajax({
        type: "GET",
        url: "Answers_data_prj3_update2.csv",
        dataType: "text",
        contentType: "text/plain",
        success: function(data) { 
        	getAnswerText(data); 
        }
    });

	$("#btn-start").click(function(event) {
		$(".welcome-container").hide();
		$(".question-container").show();
    	showQuestion(event);
	});

    $("#btn-submit").click(function(event) {
    	checkAnswer(event);
    	$('.selected').removeClass('selected');
    	showQuestion(event);
	});

	$(".btns .btn").click(function() {
		$(this).toggleClass('selected');
		selected = Number($(this).attr("id"));
		if ($(this).hasClass('selected')) {
			selected_answers[selected - 1] = 1;
		} else {
			selected_answers[selected - 1] = 0;			
		}
	});

	function getQuestionText(allText) {
		var lines = processData(allText);
		for (var i in lines) {
	    	questions.push({
	    		"question_id": lines[i][1],
	    		"question_text": lines[i][2],
	    		"correct": [],
	    		"wrong": [],
	    	});
	    }
	    // console.log(questions);
	}

	function getAnswerText(allText) {
		var lines = processData(allText);
		for (var i in lines) {
			question_id = lines[i][1];
			if (lines[i][2] == 1) {
				questions[question_id-1]["correct"].push(lines[i][0]);
			} else {
				questions[question_id-1]["wrong"].push(lines[i][0]);
			}
			
	    }
	    // console.log(questions);
	}

	function processData(allText) {
	    var allTextLines = allText.split(/\r\n|\n/);
	    var headers = allTextLines[0].split(',');
	    var lines = [];
	    for (var i=1; i<allTextLines.length; i++) {
	        var data = allTextLines[i].split(',');
            var tarr = [];
            for (var j=0; j<data.length; j++) {
            	var line = data[j];
            	if (data[j][0] == '"') {
            		line = line.substring(1);
            		while (data[j][data[j].length-1] != '"') {
            			line += data[++j];
            		}
            		line = line.substring(0, line.length-1);
            	} 
            	tarr.push(line);
            }
            lines.push(tarr);
	    }
	    return lines;
	}

	function checkAnswer(event) {
		console.log(selected_answers);
		console.log(correct_answers);
		if (selected_answers.sort().toString() == correct_answers.sort().toString()) {
			console.log("success");
			current_question_id++;
			if (current_question_id == questions.length) {
				current_question_id = 0;
			}
			selected_answers = [0, 0, 0, 0];
		} else {
			console.log("fail");
		}
	}

	function showQuestion(event) {
		console.log(current_question_id);
		current_answers[0] = [questions[current_question_id]["correct"][q_cnt[current_question_id]], 1];
		current_answers[1] = [questions[current_question_id]["wrong"][q_cnt[current_question_id]], 0];
		current_answers[2] = [questions[current_question_id]["wrong"][q_cnt[current_question_id] + 1], 0];
		current_answers[3] = [questions[current_question_id]["wrong"][q_cnt[current_question_id] + 2], 0];
		console.log(current_answers);		
		// shuffle(questions[current_question_id]["answers"]);
		// shuffle(current_answers);
		// console.log(current_answers);
		$("#question").text(questions[current_question_id]["question_text"]);
		$("#1").text(current_answers[0][0]);
		$("#2").text(current_answers[1][0]);
		$("#3").text(current_answers[2][0]);
		$("#4").text(current_answers[3][0]);
		for (i = 0; i < 4; i ++ ) {
			correct_answers[i] = current_answers[i][1];
		}
		q_cnt[current_question_id] ++;
	}

	// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
	function shuffle(a) {
	    var j, x, i;
	    for (i = a.length - 1; i > 0; i--) {
	        j = Math.floor(Math.random() * (i + 1));
	        x = a[i];
	        a[i] = a[j];
	        a[j] = x;
	    }
	    return a;
	}

});

