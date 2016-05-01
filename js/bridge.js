//variable to remove form validation for easier testing
var validate = true;

//salt added to the passwords
var salt = '691f17c48fc12fc506188f063a5849562a6804c4af868aad72205bf54341fc67';

// three regex objects for username, password and email
var usernameRegEx = /^[a-zA-Z][a-zA-z0-9_]{2,19}$/g;
var emailRegEx = /^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/g;
var passwordRegEx = /^[a-zA-Z0-9!@#$%^&*()]{8,20}$/g;

// function to show errors to the user
function error(message) {
    $('#error').stop().html(message).slideToggle(50).delay(2000).slideToggle(50);
}

// changes the form being shown and clears the values from both
function changeForm() {
    $('.form').slideToggle(100);
    clearForm();
}

function clearForm() {
    $('input').not('.button').val('');
}

function hash(user) {
    // [[username + password] + [time + salt + password]]
    var part1 = sha3_256(user.username + user.password);
    var part2 = sha3_256(user.time + salt + user.password);
    return sha3_256(part1 + part2);
    /* for testing
    console.log(hash({
        username: 'oneu',
        time: '1',
        password: ''
    }));
    */
}

// on document ready function to set up the page and create button listeners
$(function() {
    // toggle which for is shown with the .utility buttons (signup and back)
    $('.utility').on('click', function() {
        changeForm();
    });

    // click listener for the signin button
    $('#signin').on('click', function() {
        var info = {
            identifier: $(this).siblings('#lidentifier').val().trim(),
            password: $(this).siblings('#lpassword').val().trim()
        };

        if(validate) {
            // check that the form is filled
            /*for(var key in info) {
                if (info.hasOwnProperty(key)) {
                    if(info[key] === '') {
                        error('please fill in all the fields');
                        return;
                    }
                }
            }*/
            //check that the format of the username/email is correct
            if(info.identifier.match(emailRegEx)) {
                info.email = info.identifier;
                info.username = null;
            } else if(info.identifier.match(usernameRegEx)) {
                info.email = null;
                info.username = info.identifier;
            } else {
                error('invalid username/email');
                return
            }
        }

        console.log(info);
        $.post('../phpSQL/login.php', info, function(response) {
            console.log(response);
            info.time = response.time;
            info.username = response.username;
            console.log(hash(info));
            if(response.status == 'success' && response.hash == hash(info)) {
                console.log('signed in!');
            } else {
                error('username/email and password do not match :: ' + response.status);
            }
        }, 'json');
    });

    // click listener for the finish button
    $('#finish').on('click', function() {
        var info = {
            username: $(this).siblings('#ruser').val().trim(),
            email: $(this).siblings('#remail').val().trim(),
            password: $(this).siblings('#rpassword').val().trim(),
            checkpassword: $(this).siblings('#rrpassword').val().trim()
        };

        if(validate) {
            //checking that all fields are filled (with characters)
            for(var key in info) {
                if (info.hasOwnProperty(key)) {
                    if(info[key] === '') {
                        error('please fill in all the fields');
                        return;
                    }
                }
            }
            // checking that the field inputs are in the correct format
            if(!info.username.match(usernameRegEx)) {
                error('wrong username format');
                return;
            }
            if(!info.email.match(emailRegEx)) {
                error('wrong email format');
                return;
            }
            if(!info.password.match(passwordRegEx)) {
                error('wrong password format');
                return;
            }
            // checking that the passwords match
            if(info.password != info.checkpassword) {
                error('passwords do not match');
                return;
            }
            delete info.checkpassword;
        }

        info.time = (new Date()).getMilliseconds();

        info.hash = hash(info);

        delete info.password;

        console.log(info);
        $.post('../phpSQL/register.php', info, function(response) {
            console.log(response);
            if(response.status == 'success') {
                changeForm();
            } else {
                error('username and/or email already taken :: ' + response.status);
            }
        }, 'json');
    });
});
