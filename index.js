// https://stackoverflow.com/questions/7431268/how-to-read-data-from-csv-file-using-javascript/12289296#12289296
$(document).ready(function() {
	var questions = [];
	var q_num;
	var current_question_id = 0;
	var q_cnt = [];
	var current_answers = [];
	var correct_answers = [];
	var correct_len = [];
	var wrong_len = [];
	var selected_answers = [];
	var selected;
	var q_type = [];
	var feedback = [];

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
		// console.log(q_num);
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
		for (var j in lines) {
	    	questions.push({
	    		"question_id": lines[j][1],
	    		"question_text": lines[j][2],
	    		"std_answer": lines[j][3],
	    		"correct": [],
	    		"wrong": [],
	    	});
	    	if (lines[j][3].length > 1) {
	    		q_type[lines[j][1] - 1] = 1;
	    	} else {
	    		q_type[lines[j][1] - 1] = 0;
	    	}
		}

	    q_num = questions.length;
	    for (k = 0; k < q_num; k ++) {
	    	q_cnt[k] = 0;
	    	selected_answers[k] = 0;
	    	feedback[k] = "";
	    }

		for (var i in lines) {
	    	if (lines[i][3].indexOf("A") != -1 ) {
	    		feedback[i] = feedback[i] + lines[i][4] + " \n ";
	    	}
	    	if (lines[i][3].indexOf("B") != -1 ) {
	    		feedback[i] = feedback[i] + lines[i][6] + " \n ";
	    	}
	    	if (lines[i][3].indexOf("C") != -1 ) {
	    		feedback[i] = feedback[i] + lines[i][8] + " \n ";
	    	}
	    	if (lines[i][3].indexOf("D") != -1 ) {
	    		feedback[i] = feedback[i] + lines[i][10] + " \n ";
	    	}
	    }

	}

	function getAnswerText(allText) {
		function descend(x,y){
		    return y[1] - x[1];  //Descend by the second value of the array
		}

		var lines = processData(allText);
		for (var i in lines) {
			question_id = lines[i][1];
			if (lines[i][2] == 1) {
				questions[question_id-1]["correct"].push([lines[i][0],lines[i][4]]);
				correct_len[question_id-1] = questions[question_id-1]["correct"].length;
				questions[question_id-1]["correct"].sort(descend);
			} else {
				questions[question_id-1]["wrong"].push([lines[i][0],lines[i][4]]);
				wrong_len[question_id-1] = questions[question_id-1]["wrong"].length;
				questions[question_id-1]["wrong"].sort(descend);
			}
			
	    }
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
		if (selected_answers.toString() == correct_answers.toString()) {
			alert("Congratulation, you answer is correct!" + " \n " +feedback[current_question_id]);
			current_question_id++;
			if (current_question_id == questions.length) {
				current_question_id = 0;
			}
		} else {
			var half = true;
			for (i = 0; i < q_num; i ++) {
				if (correct_answers[i] - selected_answers[i] < 0) {
					half = false;
				}
			}
			if (half) {
				alert("Oops, your answer is not quite right. Another options is also correct. Try this question again!");
			} else {
				alert("Oops, your answer is incorrect. Try this question again!");
			}
		}
		selected_answers = [0, 0, 0, 0];
	}

	function showQuestion(event) {		
		// shuffle(questions[current_question_id]["answers"]);
		if(q_type[current_question_id] == 0) {
			var head_type = "(Multiple Choice Question) "
			var c = q_cnt[current_question_id] % correct_len[current_question_id];
			var w0 = q_cnt[current_question_id] % wrong_len[current_question_id];
			var w1 = (q_cnt[current_question_id] + 1) % wrong_len[current_question_id];
			var w2 = (q_cnt[current_question_id] + 2) % wrong_len[current_question_id];
			current_answers[0] = [questions[current_question_id]["correct"][c][0], 1];
			current_answers[1] = [questions[current_question_id]["wrong"][w0][0], 0];
			current_answers[2] = [questions[current_question_id]["wrong"][w1][0], 0];
			current_answers[3] = [questions[current_question_id]["wrong"][w2][0], 0];
		} else {
			var head_type = "(Select All That Apply) "
			var c0 = q_cnt[current_question_id] % correct_len[current_question_id];
			var c1 = (q_cnt[current_question_id] + 1) % correct_len[current_question_id];
			var w0 = q_cnt[current_question_id] % wrong_len[current_question_id];
			var w1 = (q_cnt[current_question_id] + 1) % wrong_len[current_question_id];
			current_answers[0] = [questions[current_question_id]["correct"][c0][0], 1];
			current_answers[1] = [questions[current_question_id]["correct"][c1][0], 1];
			current_answers[2] = [questions[current_question_id]["wrong"][w0][0], 0];
			current_answers[3] = [questions[current_question_id]["wrong"][w1][0], 0];
		}

		shuffle(current_answers);
		// console.log(current_answers);

		$("#question").text(head_type + questions[current_question_id]["question_text"]);
		$("#1").text("A.  " + current_answers[0][0]);
		$("#2").text("B.  " + current_answers[1][0]);
		$("#3").text("C.  " + current_answers[2][0]);
		$("#4").text("D.  " + current_answers[3][0]);
		for (i = 0; i < q_num; i ++ ) {
			correct_answers[i] = current_answers[i][1];
		}
		q_cnt[current_question_id] ++;
	}


// https://blog.csdn.net/Charles_Tian/article/details/80342438 
  function shuffle(arr) {
    var len = arr.length;
    //Traverse from the largest index and then decrease
    for(var i=len-1;i>=0;i--){
      //randomIndex is got from 0-arr.length randomly
      var randomIndex = Math.floor(Math.random() * (i+1));
      //the following three lines is exchanging the value selected randomly and the value currently traversed
      var itemIndex = arr[randomIndex];
      arr[randomIndex] = arr[i];
      arr[i] = itemIndex;
    }
    return arr;
  }

});

