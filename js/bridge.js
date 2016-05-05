// three regex objects for username, password and email
var usernameRegEx = /^[a-zA-Z][a-zA-z0-9_]{2,19}$/g;
var emailRegEx = /^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/g;
var passwordRegEx = /^[a-zA-Z0-9!@#$%^&*()]{8,20}$/g;

// function to show errors to the user
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

// on document ready function for button listeners
$(function() {

    // click listener for the utility buttons
    $('.utility').on('click', function() {
        // toggle which form is shown
        changeForm();
    });

    // click listener for the signin button
    $('#signin').on('click', function() {

        console.log('SIGNIN');

        // storing the values of the fields
        var info = {
            identifier: $(this).siblings('#lidentifier').val().trim(),
            password: $(this).siblings('#lpassword').val().trim()
        };

        // check that the fields are filled
        for(var key in info) {
            if (info.hasOwnProperty(key)) {
                if(info[key] == '') {
                    message('please fill in all the fields');
                    return;
                }
            }
        }

        // check that the format of the identifier fields matches either the username or remail one
        if(!info.identifier.match(emailRegEx) && !info.identifier.match(usernameRegEx)) {
            message('invalid username/email');
            return;
        }

        // sending a post request to the specified file with the info object
        $.post('../php_helper/login.php', info, function(login_response) {
            if(login_response == 'success') {
                message('signed in!');
            } else {
                message(login_response);
            }
        }, 'text');
    });

    // click listener for the finish button
    $('#finish').on('click', function() {

        console.log('REGISTER');

        // storing the values of the fields
        var info = {
	          username: $(this).siblings('#ruser').val().trim(),
	          email: $(this).siblings('#remail').val().trim(),
            password: $(this).siblings('#rpassword').val().trim(),
            checkpassword: $(this).siblings('#rrpassword').val().trim()
        };

        //checking that all fields are filled
        for(var key in info) {
            if (info.hasOwnProperty(key)) {
                if(info[key] === '') {
                    message('please fill in all the fields');
                    return;
                }
            }
        }

        // checking that each of the field inputs are in the correct format
        if(!info.username.match(usernameRegEx)) {
            message('wrong username format');
            return;
        }
        if(!info.email.match(emailRegEx)) {
            message('wrong email format');
            return;
        }
        if(!info.password.match(passwordRegEx)) {
            message('wrong password format');
            return;
        }

        // checking that the passwords match
        if(info.password != info.checkpassword) {
            message('passwords do not match');
            return;
        }
				// removing the password check variable
        delete info.checkpassword;

        // sending a post request to the specified file with the info object
        $.post('../php_helper/register.php', info, function(register_response) {
            // testing if the user has been successfully added
            if(register_response == 'success') {
                changeForm();
                message('account created!');
            } else {
                message(register_response);
            }
        }, 'text');
    });
});
