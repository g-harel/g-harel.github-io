// three regex objects for username, password and email
var usernameRegEx = /^[a-zA-Z][a-zA-z0-9_]{2,19}$/g;
var emailRegEx = /^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/g;
var passwordRegEx = /^[a-zA-Z0-9!@#$%^&*()]{8,20}$/g;
var drawme = {};

// function to show messages to the user
function message(message) {
    $('#message').stop().html(message).slideToggle(20).delay(2000).slideToggle(20);
    console.log(message);
}

// changes the form being shown and clears the values from both
function changeForm() {
    $('.form').toggle();
    clearForm();
}

// clears all the forms
function clearForm() {
    $('input').not('.button').val('');
}

function draw(response) {

	// adding the index of the "source" array to each element in it so that the right one can be modified
	// even after the array gets sorted and the contents are moved around
	for (var i = 0; i < response.objectives.length; i++) {
		response.objectives[i].push(i);
	}
	for (var i = 0; i < response.projects.length; i++) {
		response.projects[i].push(i);
	}
	for (var i = 0; i < response.tasks.length; i++) {
		response.tasks[i].push(i);
	}

	drawme = {
		objectives: draw_objectives,
		projects: draw_projects,
		tasks: draw_tasks
	}

	drawme['objectives']();
	drawme['projects']();
	drawme['tasks']();

	function draw_objectives() {
		var objectives = sort_by_priority(response.objectives, 3);
		$('#objectives').html(table({
			minimum_lines: 18,
			titles: ['priority', 'objectives'],
			data: objectives,
			responseid: 4,
			cols: [3,2],
			col_width: ['75px', '100%'],
			edit_cols: [true, true]
		}));
		bind_listeners();
	}

	function draw_projects() {
		var projects = sort_by_priority(response.projects, 3);
		$('#projects').html(table({
			minimum_lines: 18,
			titles: ['priority', 'projects'],
			data: projects,
			responseid: 4,
			cols: [3,2],
			col_width: ['75px', '100%'],
			edit_cols: [true, true]
		}));
		bind_listeners();
	}

	function draw_tasks() {
		var tasks_all = sort_by_priority(response.tasks, 3);
		var tasks_week = sort_by_priority(response.tasks, 6);
		var tasks_day = sort_by_priority(response.tasks, 7);
		$('#all_tasks').html(table({
			minimum_lines: 18,
			titles: ['priority', 'description', 'objective', 'project'],
			data: tasks_all,
			responseid: 8,
			cols: [3,2,4,5],
			col_width: ['75px', '36%', '32%', '32%'],
			edit_cols: [true, true, true, true]
		}));
		$('#week_tasks_table').html(table({
			minimum_lines: 18,
			titles: ['priority', 'tasks'],
			data: tasks_all,
			responseid: 8,
			cols: [3,2],
			col_width: ['75px', '100%', '45px'],
			edit_cols: [false, false],
			button: '<td><span class="move button" data-target="week">>>></span></td>'
		}));
		$('#week_tasks').html(table({
			minimum_lines: 18,
			titles: ['priority', 'tasks'],
			data: tasks_week,
			responseid: 8,
			cols: [6,2],
			col_width: ['75px', '100%'],
			edit_cols: [true, false]
		}));
		$('#day_tasks_table').html(table({
			minimum_lines: 18,
			titles: ['priority', 'tasks'],
			data: tasks_week,
			responseid: 8,
			cols: [6,2],
			col_width: ['75px', '100%', '45px'],
			edit_cols: [false, false],
			button: '<td><span class="move button" data-target="day">>>></span></td>'
		}));
		$('#day_tasks').html(table({
			minimum_lines: 18,
			titles: ['priority', 'tasks'],
			data: tasks_day,
			responseid: 8,
			cols: [7,2],
			col_width: ['75px', '100%', '45px'],
			edit_cols: [true, false],
			button: '<td><span class="move button" data-target="timeline">>>></span></td>'
		}));
		bind_listeners();
	}

	function bind_listeners() {
		// moves the task to week or day (by giving it a week/day priority)
		$('.move').off().on('click', function() {
			var $row = $(this).closest('tr');
			var id = $row.attr('data-responseid');
			var target = $(this).attr('data-target');
			if (target == 'week') {
				response.tasks[id][6] = response.tasks[id][3];
			} else if (target == 'day') {
				response.tasks[id][7] = response.tasks[id][6] || null;
			}
			drawme['tasks']();
		});

		// allows the user to live edit the contents of the tables when the cells are doubleclicked
		$('.editable').off().on('dblclick', function() {
			// storing some values
			var element = $(this);
			var oldvalue = element.html();
			var type = element.parent().closest('div').attr('data-source');
			var index = element.closest('tr').attr('data-responseid');
			var position = element.closest('td').attr('data-datapos');
			// replacing the text inside the clicked div with a text input element
			element.closest('td').html('<input type="text" id="live_edit"></input>');
			// setting focus to the new input and adding a blur listener to store the value
			var live_edit = $('#live_edit');
			live_edit.focus();
			live_edit.val(oldvalue); // setting after to have cursor at the end
			live_edit.on('blur', function() {
				var newvalue = live_edit.val();
				// redraws if the new value is not empty and has been changed
				if (newvalue && newvalue != oldvalue) {
					response[type][index][position] = newvalue;
					drawme[type]();
				} else {
					live_edit.closest('td').html('<div class="editable">' + oldvalue + '</div>');
					bind_listeners();
				}
			});
		});
	}
}

/* creates html table
	settings = {
		minimum_lines: #	> minimum number of lines to show (for formatting)
		titles: []			> the header names
		data: [][]			> the data to be formatted
		responseid: #		> the index of the id
		cols: []			> columns to be displayed
		col_width: []		> the width of each column being created
		edit_cols: []		> whether or not the column is editable
		button: ""			> additional html code appended to the end of each row
	}*/
function table(settings) {
	var table = '<table cellspacing="0">';
	// column widths
	for (var i = 0; i < (settings.col_width && settings.col_width.length); i++) {
		table += '<col width=' + settings.col_width[i] + '/>';
	}
	// headers
	if (settings.titles) {
		table += '<tr>';
		for (var i = 0; i < settings.titles.length; i++) {
			table += '<th>' + settings.titles[i] + '</th>';
		}
		table += '<th></th></tr>';
	}
	// rows with data
	var data_rows = settings.data.length || 0;
	var columns = settings.cols.length || 0;
	for (var i = 0; i < data_rows; i++) {
		table += '<tr data-responseid="' + settings.data[i][settings.responseid] + '">';
		for (var j = 0; j < columns; j++) {
			table += '<td data-datapos="' + settings.cols[j] + '"><div ' + (settings.edit_cols[j] && 'class="editable"' || '') + '>' + settings.data[i][settings.cols[j]] + '</div></td>';
		}
		table += (settings.button || '') + '</tr>';
	}
	// empty rows
	var empty_rows = settings.minimum_lines - data_rows + 3;
	var row = '';
	columns = Math.max(columns, settings.titles.length, settings.cols.length, settings.col_width.length);
	for (var j = 0; j < columns; j++) {
		row += '<td></td>';
	}
	for (var i = 0; i < empty_rows; i++) {
		table += '<tr>' + row + '</tr>';
	}
	table += '</table>';
	return table;
}

// sorts the source array according to the value of each element at the index
// this function might seem unnecessarily complicated, but since it is being called so many times,
// I wanted to avoid using nested loops to keep it quick on large arrays
function sort_by_priority(source_array, index) {
	// initializing some variables at the start rather than in the loop
	var week_temp_tasks = {};
	var current_priority = 0;
	var highest_priority = 0;
	// loop through all items and store them in an array at the index of their priority within an object
	for (var i = 0; i < source_array.length; i++) {
		current_priority = source_array[i][index]
		// not adding to the object if the index is null
		if (!current_priority) {
			continue;
		}
		// changing the highest priority if the current one is a bigger number
		highest_priority = Math.max(highest_priority, current_priority);
		// pushing to the object at the index if it exists, or creating and array if it doesn't
		if (week_temp_tasks[current_priority]) {
			week_temp_tasks[current_priority].push(source_array[i]);
		} else {
			week_temp_tasks[current_priority] = [source_array[i]];
		}
	}
	// concatenating all the arrays into one
	var sorted_array = [];
	for (var i = 0; i <= highest_priority; i++) {
		// check if there is a value at the index
		if (week_temp_tasks[i]) {
			sorted_array = sorted_array.concat(week_temp_tasks[i]);
		}
	}
	return sorted_array;
}

$(function() {
	// requests all the information for the user
	$.post('../php_helper/retreive.php', {}, function(response) {
		console.log(response);
		if (response.status) {
			draw(response);
		} else {
			message(response.status);
		}
	}, 'JSON');

    // click listener for the utility buttons
    $('.utility').on('click', function() {
        // toggle which form is shown
        changeForm();
    });

    // click listener for the signin button
    $('#signin').on('click', function() {
        // storing the values of the fields
        var info = {
            identifier: $(this).siblings('#identifier').val().trim(),
            password: $(this).siblings('#password').val().trim()
        };
        // check that the fields are filled
        for (var key in info) {
            if (info.hasOwnProperty(key)) {
                if (info[key] === '') {
                    message('please fill in all the fields');
                    return;
                }
            }
        }
        // check that the format of the identifier fields matches either the username or remail one
        if (!info.identifier.match(emailRegEx) && !info.identifier.match(usernameRegEx)) {
            message('invalid username/email');
            return;
        }
        // sending a post request to the specified file with the info object
        $.post('../php_helper/login.php', info, function(login_response) {
            if (login_response == 'success') {
                location.reload();
            } else {
                message(login_response);
            }
        }, 'text');
    });

    // click listener for the register button
    $('#register').on('click', function() {
        // storing the values of the fields
        var info = {
            username: $(this).siblings('#user').val().trim(),
            email: $(this).siblings('#email').val().trim(),
            password: $(this).siblings('#password').val().trim(),
            checkpassword: $(this).siblings('#password2').val().trim()
        };
        //checking that all fields are filled
        for (var key in info) {
            if (info.hasOwnProperty(key)) {
                if (info[key] === '') {
                    message('please fill in all the fields');
                    return;
                }
            }
        }
        // checking that each of the field inputs are in the correct format
        if (!info.username.match(usernameRegEx)) {
            message('wrong username format');
            return;
        }
        if (!info.email.match(emailRegEx)) {
            message('wrong email format');
            return;
        }
        if (!info.password.match(passwordRegEx)) {
            message('wrong password format');
            return;
        }
        // checking that the passwords match
        if (info.password != info.checkpassword) {
            message('passwords do not match');
            return;
        }
        // removing the password check variable
        delete info.checkpassword;
        // sending a post request to the specified file with the info object
        $.post('../php_helper/register.php', info, function(register_response) {
            // testing if the user has been successfully added
            if (register_response == 'success') {
                changeForm();
                message('account created!');
            } else {
                message(register_response);
            }
        }, 'text');
    });

	// click listener for the tab buttons
	$('.tab').on('click', function() {
		// changing the class of the buttons
		var $tab = $(this);
		$tab.siblings().removeClass('current');
		$tab.addClass('current');
		// changing the class of the content divs
		var $content = $tab.parent().siblings();
		$content.removeClass('current');
		$content.filter('#' + $tab.attr('data-content')).addClass('current');
		// moving the tab slider
		var position = $tab.attr('data-contentid');
		$tab.parent().siblings('#tab_slider').animate({
			left: (position*25) + '%'
		}, 175);
	});

	$('.add, #darken').on('click', function() {
		var type = $(this).attr('data-source');
		console.log(type);
		add_window = $('#darken');
		add_window.toggle();
		//add_window.children('#add_objectives').toggle();
		add_window.children().filter('#add_' + type).addClass('this');
		// add_window.first().children('#add_' + type).show();
		// add_window.first().children().not('#add_' + type).hide();
		// drawme[type]();
	});
});
