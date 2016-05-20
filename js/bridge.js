// three regex objects for username, password and email
var usernameRegEx = /^[a-zA-Z][a-zA-z0-9_]{2,19}$/g;
var emailRegEx = /^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/g;
var passwordRegEx = /^[a-zA-Z0-9!@#$%^&*()]{8,20}$/g;

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
	$('#tasks').append(table({
		minimum_lines: 18,
		titles: ['priority', 'description', 'objective', 'project'],
		data: response.tasks,
		cols: [3,2,4,5],
		col_width: ['75px', '36%', '32%', '32%', '45px'],
		button: '<span class="edit button">edit</span>'
	}));
	$('#objectives').append(table({
		minimum_lines: 18,
		titles: ['priority', 'objectives'],
		data: response.objectives,
		cols: [3,2],
		col_width: ['75px', '100%', '45px'],
		button: '<span class="edit button">edit</span>'
	}));
	$('#projects').append(table({
		minimum_lines: 18,
		titles: ['priority', 'projects'],
		data: response.projects,
		cols: [3,2],
		col_width: ['75px', '100%', '45px'],
		button: '<span class="edit button">edit</span>'
	}));
	$('#week_tasks_table').append(table({
		minimum_lines: 18,
		titles: ['priority', 'tasks'],
		data: response.tasks,
		cols: [3,2],
		col_width: ['75px', '100%', '45px'],
		button: '<span class="edit button">>>></span>'
	}));
	$('#day_tasks_table').append(table({
		minimum_lines: 18,
		titles: ['priority', 'tasks'],
		data: response.tasks,
		cols: [3,2],
		col_width: ['75px', '100%', '45px'],
		button: '<span class="edit button">>>></span>'
	}));
	rem_listener();
}

// creates html table
/*
settings = {
	minimum_lines: #
	titles: []
	data: [][]
	cols: []
	col_width: []
	button: ""
}
*/
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
		table += '<tr data-taskid="' + settings.data[i][0] + '">';
		for (var j = 0; j < columns; j++) {
			table += '<td>' + settings.data[i][settings.cols[j]] + '</td>';
		}
		table += '<td>' + settings.button + '</td></tr>';
	}
	// empty rows
	var empty_rows = settings.minimum_lines - data_rows + 3;
	var row = '';
	for (var j = 0; j <= columns; j++) {
		row += '<td></td>';
	}
	for (var i = 0; i < empty_rows; i++) {
		table += '<tr>' + row + '</tr>';
	}
	table += '</table>';
	return table;
}

function rem_listener() {
    $('.remove').on('click', function() {
		// storing the parent row and its id for future use
		var $row = $(this).closest('tr');
        var id = $row.attr('data-taskid') || '';
        console.log('removing task #' + id);
		// server request to remove the task with the specific id
		$.post('../php_helper/remove.php', {id: id, table: 'tasks'}, function(remove_response) {
			if(remove_response == 'success') {
				// send the row to the bottom of the table
				$row.appendTo($row.parent());
				// empty the row's content
				$row.children().html('');
				// set the taskid to 0
				$row.attr('data-taskid', 0);
			} else {
				console.log(remove_response);
			}
        }, 'text');
    });
}

// on document ready function for button listeners
$(function() {
	// fills the divs on the page
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
});
