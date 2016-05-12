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

// creates an html table from a databse query
// table_settings = {
//		type: one digit int
// 		columns: [] array of column names in the order that is wanted
// 		target:  dom element that the table will be sent to (to get around async post)
//		sort: string passed to mySQL with the 'ORDER BY' keyword if necessary
//		minimum_lines: minimum number of rows (extra will be blank)
//		caption: the title of the table
// }
function create_table(settings) {
    // do nothing if the target object is not specified or does not exist
    if (settings.target && $(settings.target).length && settings.columns && settings.columns.length) {
        $.post('../php_helper/find_event.php', settings, function(find_response) {
            console.log(find_response);
            // if the query is successful, build the table
            if (find_response.status == 'success') {
                // finding the number of rows to be drawn
                var rows = Math.max(find_response.length || 0, settings.minimum_lines || 0);
				// opening the table tag
                var table = '<table cellspacing="0">';
				// add a title/caption if it is specified
				table += (settings.caption && '<caption>' + settings.caption + '</caption>') || '';
				// adding the header row
				table += '<tr>';
				for (var i = 0; i < settings.columns.length; i++) {
					table += '<th>' + settings.columns[i] + '</th>';
				}
				table += '<th></th></tr>';
                // adding the other rows with the data in them
                for (var i = 0; i < rows; i++) {
					// adding an eventid data to the rows to identify which event they are representing
					table += '<tr data-eventid="' + (find_response[i] && find_response[i].id) + '">';
					// filling out the data in the rows
                    for (var j = 0; j < settings.columns.length; j++) {
                        // content of the cell will be the data from the response or an empty string
						var contents = (find_response[i] && find_response[i][settings.columns[j]]) || '';
                        table += '<td>' + contents + '</td>';
                    }
					table += '<td>';
					// adding a button to remove the event it is showing if the id is not zero
                    if(find_response[i]) {
						table += '<input value="X" type="button" class="remove button">';
					}
					table += '</td></tr>';
                }
                table += '</table>';
				// sending the html code to the specified container
				$(settings.target).html(table);
				// adding the listeners to the buttons in the table after they have been added to the document
                rem_listener();
            } else {
				// log the status if the query is not successful
                console.log(find_response.status);
            }
        }, 'json');
    } else {
        console.log('invalid settings (target missing/doesn\'t exist or no columns)');
    }
}

function rem_listener() {
	// adding the button listener
    $('.remove').on('click', function() {
		// storing the parent row and its id for future use
		var $row = $(this).closest('tr');
        var id = $row.attr('data-eventid') || '';
        console.log('removing event #' + id);
		// server request to remove the event with the specific id
		$.post('../php_helper/remove_event.php', {id: id}, function(remove_response) {
			if(remove_response == 'success') {
				// send the row to the bottom of the table
				$row.appendTo($row.parent());
				// empty the row's content
				$row.children().html('');
				// set the eventid to 0
				$row.attr('data-eventid', 0);
			} else {
				console.log(remove_response);
			}
        }, 'text');
    });
}

// on document ready function for button listeners
$(function() {
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
});
