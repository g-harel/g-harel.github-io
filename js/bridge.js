var salt = '691f17c48fc12fc506188f063a5849562a6804c4af868aad72205bf54341fc67';

function login(user) {
    console.log(user);

    return true;
}

function register(new_user) {
    console.log(new_user);

    new_user.time = (new Date()).getMilliseconds();

    // [[username + password] + [time + salt + password]]
    var part1 = sha3_256(new_user.username + new_user.password);
    var part2 = sha3_256(new_user.time + salt + new_user.password);
    new_user.hash = sha3_256(part1 + part2);
    delete new_user.password;

    // TODO confirm user is not duplicate/try to add to db
    $.ajax({
        type: 'POST',
        url: 'sql.php',
        data: new_user,
        success: function(data) {
            console.log(data);
        }
    });

    return true;
}
