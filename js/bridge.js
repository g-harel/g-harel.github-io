//variable to remove form validation for easier testing
var validate = true;

//salt added to the passwords
var salt = '691f17c48fc12fc506188f063a5849562a6804c4af868aad72205bf54341fc67';

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
    $('.form').toggle(0);
    clearForm();
}

// clears all the forms
function clearForm() {
    $('input').not('.button').val('');
}

// hashes the contents of the object being passed to it
function hash(user) {
    // [[username + password] + [time + salt + password]] where the hash of x is shown as [x]
    var part1 = sha3_256(user.username + user.password);
    var part2 = sha3_256(user.time + salt + user.password);
    return sha3_256(part1 + part2);
}

// on document ready function for buton listeners
$(function() {

    // toggle which for is shown with the .utility buttons
    $('.utility').on('click', function() {
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

        // store the password client side and delete it in the object being sent
        var password = info.password;
        delete info.password;

        // sending a post request to the specified file with the info object
        $.post('../phpSQL/login.php', info, function(response) {
            // adding back the password to the received JSON object
            response.password = password;
            // testing if the user has been found
            if(response.status == 'success') {
                // testing if the hash using the password corresponds to the one in the database
                if(response.hash == hash(response)) {
                    message('signed in!');
                } else {
                    message('username/email and password do not match');
                }
            } else {
                message(response.status);
            }
        }, 'json');
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

        // creating a pseudorandom integer to salt the hash
        info.time = (new Date()).getMilliseconds();

        // hashing the info object
        info.hash = hash(info);

        // removing the password information before sending a request to the server
        delete info.password;
        delete info.checkpassword;

        // sending a post request to the specified file with the info object
        $.post('../phpSQL/register.php', info, function(response) {
            // testing if the user has been successfully added
            if(response.status == 'success') {
                changeForm();
                message('account created!');
            } else {
                message(response.status);
            }
        }, 'json');
    });
});
