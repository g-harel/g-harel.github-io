<?php include('header.php') ?>

<img src='../res/hero_login.jpg' id="background_image">

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

<?php include('footer.php') ?>
