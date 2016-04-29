<?php include('header.php') ?>

<img src='res/hero_login.jpg' id="background_image">

<div id='login_form' class='form'>
    <label>LOGIN</label><br/>
    <input type='text' id='lidentifier' class='login' placeholder='username or email'><br/>
    <input type='password' id='lpassword' class='login' placeholder='password'><br/>
    <input type='button' value='SIGN UP' id='signup' class='login button utility'>
    <div id='spacer'></div>
    <input type='button' value='SIGN IN' id='signin' class='login button'>
</div>
<div id='register_form' class='form'>
    <label>REGISTER</label><br/>
    <input type='text' id='ruser' class='login' placeholder='username' title='starts with a letter and is 3 to 20 characters long (can contain underscores)'><br/>
    <input type='text' id='remail' class='login' placeholder='email address'><br/>
    <input type='password' id='rpassword' class='login' placeholder='password' title='8 to 20 characters (can include !@#$%^()&*)'><br/>
    <input type='password' id='rrpassword' class='login' placeholder='re-type password'><br/>
    <input type='button' value='< BACK' id='back' class='login button utility'>
    <div id='spacer'></div>
    <input type='button' value='FINISH' id='finish' class='login button'>
</div>

<script type="text/javascript">

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
        $('input').not('.button').val('');
    }

    // on document ready function to set up the page and create button listeners
    $(function() {

        // toggle which for is shown with the .utility buttons (signup and back)
        $('.utility').on('click', function() {
            changeForm();
        });

        // click listener for the signin button
        $('#signin').on('click', function() {
            var credentials = {
                identifier: $(this).siblings('#lidentifier').val().trim(),
                password: $(this).siblings('#lpassword').val().trim()
            };
            // check that the form is filled
            for(var key in credentials) {
                if (credentials.hasOwnProperty(key)) {
                    if(credentials[key] === '') {
                        error('please fill in all the fields');
                        return;
                    }
                }
            }
            //check that the format of the username/email is correct
            if(credentials.identifier.match(emailRegEx)) {
                credentials.email = credentials.identifier;
                credentials.username = null;
            } else if(credentials.identifier.match(usernameRegEx)) {
                credentials.email = null;
                credentials.username = credentials.identifier;
            } else {
                error('invalid username/email');
                return
            }
            // remove the repeated key and call the login function
            delete credentials.identifier;
            login(credentials);
        });

        // click listener for the finish button
        $('#finish').on('click', function() {
            var valid = true;
            var info = {
                username: $(this).siblings('#ruser').val().trim(),
                email: $(this).siblings('#remail').val().trim(),
                password: $(this).siblings('#rpassword').val().trim(),
                checkpassword: $(this).siblings('#rrpassword').val().trim()
            };
            //checking that all fields are filled (with characters)
            for(var key in info) {
                if (info.hasOwnProperty(key)) {
                    if(info[key] === '' && valid) {
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
            if(info.password != info.checkpassword && valid) {
                error('passwords do not match');
                return;
            }
            // call the register function if all fields are entered correctly and removing unnecessary info
            // return to login form if registration is successful
            delete info.checkpassword;
            if(register(info)) {
                changeForm();
            }
        });
    });
</script>

<?php include('footer.php') ?>
