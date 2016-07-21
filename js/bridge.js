// TODO implement modular forms that are only associated to the table they represent

(function() {
    var
        // the user object that will store all the user data
        user = {},
        // the events object will keep track of all events on the schedule
        events = {},
        // regex patterns for form validation
        usernameRegEx = /^[a-zA-Z][a-zA-z0-9_]{2,19}$/g,
        emailRegEx = /^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/g,
        passwordRegEx = /^[a-zA-Z0-9!@#$%^&*()]{8,20}$/g,
        // table structure in object form
        db_struct = {
            tables: ['objectives', 'projects', 'tasks', 'meetings'],
            objectives: ['id', 'username', 'description', 'priority'],
            projects: ['id', 'username', 'description', 'priority'],
            tasks: ['id', 'username', 'description', 'priority', 'objective', 'project', 'week_priority', 'day_priority'],
            meetings: ['id', 'username', 'description', 'objective', 'project', 'start', 'end']
        },
        // functions that update the tables according to the contents of "user"
        draw = {
            all: function() {
                draw.objectives();
                draw.projects();
                draw.tasks();
                draw.meetings();
                return function() {
                    bind.all();
                };
            },
            objectives: function() {
                var objectives = sort_by_priority(user.objectives, 3);
                $('#objectives').html(table({
                    titles: ['priority', 'objectives'],
                    data: objectives,
                    responseid: 4,
                    cols: [3,2],
                    col_width: ['75px', '100%', '30px'],
                    edit_cols: [true, true],
                    button: '<td><span class="remove button">❌</span></td>'
                }));
                var dropdown = '';
                for (var i = 0; i < user.objectives.length; i++) {
                    if (!user.objectives[i]) {
                        continue;
                    }
                    dropdown += '<option value="' + user.objectives[i][2] + '">' + user.objectives[i][2] + '</option>';
                }
                $('.dropdown_objectives').html(dropdown);
                return function() {
                    bind.edit();
                    bind.remove();
                };
            },
            projects: function() {
                var projects = sort_by_priority(user.projects, 3);
                $('#projects').html(table({
                    titles: ['priority', 'projects'],
                    data: projects,
                    responseid: 4,
                    cols: [3,2],
                    col_width: ['75px', '100%', '30px'],
                    edit_cols: [true, true],
                    button: '<td><span class="remove button">❌</span></td>'
                }));
                var dropdown = '';
                for (var i = 0; i < user.projects.length; i++) {
                    if (!user.projects[i]) {
                        continue;
                    }
                    dropdown += '<option value="' + user.projects[i][2] + '">' + user.projects[i][2] + '</option>';
                }
                $('.dropdown_projects').html(dropdown);
                return function() {
                    bind.edit();
                    bind.remove();
                };
            },
            tasks: function() {
                var tasks_all = sort_by_priority(user.tasks, 3),
                    tasks_week = sort_by_priority(user.tasks, 6),
                    tasks_day = sort_by_priority(user.tasks, 7);
                $('#tasks_main').html(table({
                    titles: ['priority', 'description', 'objective', 'project'],
                    data: tasks_all,
                    responseid: 8,
                    cols: [3,2,4,5],
                    col_width: ['75px', '36%', '32%', '32%', '30px'],
                    edit_cols: [true, true, true, true],
                    button: '<td><span class="remove button">❌</span></td>'
                }));
                $('#tasks_week_source').html(table({
                    titles: ['priority', 'tasks'],
                    data: tasks_all,
                    responseid: 8,
                    cols: [3,2],
                    col_width: ['75px', '100%', '29px'],
                    edit_cols: [false, false],
                    button: '<td><span class="move button" data-target="week">➤</span></td>'
                }));
                $('#tasks_week').html(table({
                    titles: ['priority', 'tasks'],
                    data: tasks_week,
                    responseid: 8,
                    cols: [6,2],
                    col_width: ['75px', '100%', '30px'],
                    edit_cols: [true, false],
                    button: '<td><span class="remove_shallow button" data-source="week_priority">❌</span></td>'
                }));
                $('#tasks_day_source').html(table({
                    titles: ['priority', 'tasks'],
                    data: tasks_week,
                    responseid: 8,
                    cols: [6,2],
                    col_width: ['75px', '100%', '29px'],
                    edit_cols: [false, false],
                    button: '<td><span class="move button" data-target="day">➤</span></td>'
                }));
                $('#tasks_day').html(table({
                    titles: ['priority', 'tasks'],
                    data: tasks_day,
                    responseid: 8,
                    cols: [7,2],
                    col_width: ['75px', '100%', '30px', '29px'],
                    edit_cols: [true, false],
                    button: '<td><span class="remove_shallow button" data-source="day_priority">❌</span></td><td><span class="move2 button" data-target="timeline">➤</span></td>'
                }));
                if (tasks_week.length) {
                    $('#disable_day').hide();
                } else {
                    $('#disable_day').show();
                }
                return function() {
                    bind.all();
                };
            },
            meetings: function() {
                var meetings = sort_by_priority(user.meetings, 0);
                $('#meetings_table').html(table({
                    titles: ['start', 'end', 'description', 'objective', 'project'],
                    data: meetings,
                    responseid: 7,
                    cols: [5,6,2,3,4],
                    col_width: ['60px', '60px', '50%', '25%', '25%', '30px'],
                    edit_cols: [true, true, true, true, true],
                    button: '<td><span class="remove button">❌</span></td>'
                }));
                return function() {
                    bind.edit();
                    bind.remove();
                };
            },
            events: function() {
                console.log(events);
                window.events = events;
                for (var i in events) {
                    if (events.hasOwnProperty(i)) {
                        events[i].key = i;
                        draw.event(events[i]);
                    }
                }
                return function() {
                    bind.remove_event();
                };
            },
            event: function(event) {
                while (!event.key) {
                    event.key = Math.floor(Math.random()*10000) + 1;
                }
                var contents = '<div class="event dropshadow" data-key="' + event.key + '" ';
                contents += 'style="top:' + (event.position || 46 ) + 'px;height:' + (event.height || 46) + 'px">';
                contents += '<span class="event_title">' + (event.title || '') + '</span>';
                contents += '<span class="event_description">' + (event.description || '') + '</span>';
                contents += '</div>';
                $('#schedule_wrapper').append(contents);
                return function() {
                    events[event.key] = {
                        'title':event.title,
                        'description':event.description,
                        'height':event.height,
                        'position':event.position,
                        'key': event.key
                    };
                    bind.remove_event();
                    $('#schedule_wrapper').scrollTop(event.position-100);
                    document.cookie = 'events=' + JSON.stringify(events);
                };
            }
        },
        // collection of functions that add listeners to generated html elements
        bind =  {
            all: function() {
                bind.move();
                bind.edit();
                bind.remove();
                bind.remove_shallow();
                bind.remove_event();
            },
            move: function() {
                $('.move').off().on('click', function() {
                    var $row = $(this).closest('tr'),
                        index = $row.attr('data-responseid'),
                        target = $(this).attr('data-target'),
                        source_index,
                        target_index;
                    if (target == 'week') {
                        source_index = 3;
                        target_index = 6;
                    } else if (target == 'day') {
                        source_index = 6;
                        target_index = 7;
                    }
                    // execution stops if the tasks has already been moved
                    if (user.tasks[index][target_index]) {
                        message('task has already been moved');
                        return;
                    }
                    // creating in the object to be passed to backend
                    var data = {
                        type: 'tasks',
                        field: db_struct.tasks[target_index],
                        id: user.tasks[index][0],
                        value: user.tasks[index][source_index]
                    };
                    $.post('../php_helper/edit.php', data, function(edit_response) {
                        if (edit_response == 'success') {
                            user.tasks[index][target_index] = data.value;
                            draw.tasks()();
                        } else {
                            message(edit_response);
                        }
                    }, 'text');
                });
            },
            edit: function() {
                $('.editable').off().on('dblclick', function() {
                    var element = $(this),
                        oldvalue = element.html(),
                        type = element.parent().closest('div').attr('data-source'),
                        index = element.closest('tr').attr('data-responseid'),
                        position = element.closest('td').attr('data-datapos');
                    // replacing the text inside the clicked div with a text input element
                    element.closest('td').html('<input type="text" id="live_edit"></input>');
                    // setting focus to the new input and adding a blur listener to store the value
                    var live_edit = $('#live_edit');
                    live_edit.focus();
                    live_edit.val(oldvalue); // setting after to have cursor at the end
                    live_edit.on('blur', function() {
                        var newvalue = live_edit.val().trim();
                        // resets if the new value is empty or has not been changed
                        if (!newvalue || newvalue == oldvalue) {
                            live_edit.closest('td').html('<div class="editable">' + oldvalue + '</div>');
                            bind.edit();
                            return;
                        }
                        // resets if the time format is not proper for the meeting times
                        if (type == 'meetings' && (position == 5 || position == 6) && !newvalue.match(/^\d{1,2}:\d{2}$/)) {
                            live_edit.closest('td').html('<div class="editable">' + oldvalue + '</div>');
                            message('incorrect time format (HH:MM)');
                            bind.edit();
                            return;
                        }
                        // creating in the object to be passed to backend
                        var data = {
                            type: type,
                            field: db_struct[type][position],
                            id: user[type][index][0],
                            value: newvalue
                        };
                        $.post('../php_helper/edit.php', data, function(edit_response) {
                            if (edit_response == 'success') {
                                user[type][index][position] = newvalue;
                                draw[type]()();
                            } else {
                                message(edit_response);
                                live_edit.closest('td').html('<div class="editable">' + oldvalue + '</div>');
                                bind.edit();
                            }
                        }, 'text');
                    });
                });
            },
            remove: function() {
                $('.remove').off().on('click', function() {
                    var element = $(this),
                        type = element.parent().closest('div').attr('data-source'),
                        index = element.closest('tr').attr('data-responseid');
                    // execution stops if the task is used in week table
                    if (element.parent().closest('div').attr('id') == 'tasks_main' && user.tasks[index][6]) {
                        message('task is being used in week, cannot be removed');
                        return;
                    }
                    // creating in the object to be passed to backend
                    var data = {
                        type: type,
                        id: user[type][index][0],
                    };
                    $.post('../php_helper/remove.php', data, function(remove_response) {
                        if (remove_response == 'success') {
                            element.closest('tr').remove();
                            user[type][index] = undefined;
                            draw.tasks()();
                        } else {
                            message(remove_response);
                        }
                    }, 'text');
                });
            },
            remove_shallow: function() {
                $('.remove_shallow').off().on('click', function() {
                    var $row = $(this).closest('tr'),
                        index = $row.attr('data-responseid'),
                        type = $(this).attr('data-source');
                    // execution stops if the task is also in the day table
                    if (type == 'week_priority' && user.tasks[index][7]) {
                        message('task is being used in day, cannot be removed from week');
                        return;
                    }
                    // creating in the object to be passed to backend
                    var data = {
                        type: 'tasks',
                        field: type,
                        id: user.tasks[index][0],
                        value: 'NULL'
                    };
                    $.post('../php_helper/edit.php', data, function(edit_response) {
                        if (edit_response == 'success') {
                            user.tasks[index][((type == 'week_priority')?6:7)] = undefined;
                            draw.tasks()();
                        } else {
                            message(edit_response);
                        }
                    }, 'text');
                });
            },
            remove_event: function() {
                $('.event').off().on('dblclick', function() {
                    delete events[$(this).attr('data-key')];
                    document.cookie = 'events=' + JSON.stringify(events);
                    $(this).hide();
                });
            }
        };

    /* creates html table
        settings = {
            titles: []            > the header names
            data: [][]            > the data to be formatted
            responseid: #        > the index of the id
            cols: []            > columns to be displayed
            col_width: []        > the width of each column being created
            edit_cols: []        > whether or not the column is editable
            button: ""            > additional html code appended to the end of each row
        }*/
    function table(settings) {
        if(!settings) {
            return;
        }
        var table = '<table cellspacing="0">';
        // custom column widths
        for (var i = 0; i < (settings.col_width && settings.col_width.length); i++) {
            table += '<col width="' + settings.col_width[i] + '">';
        }
        // headers
        if (settings.titles) {
            table += '<tr>';
            for (i = 0; i < settings.titles.length; i++) {
                table += '<th>' + settings.titles[i] + '</th>';
            }
            table += '<th></th></tr>';
        }
        // rows with data
        var data_rows = settings.data.length || 0,
            columns = settings.cols.length || 0;
        for (i = 0; i < data_rows; i++) {
            table += '<tr data-responseid="' + settings.data[i][settings.responseid] + '">';
            for (var j = 0; j < columns; j++) {
                table += '<td data-datapos="' + settings.cols[j] + '"><div ' + (settings.edit_cols[j] && 'class="editable"' || '') + '>' + settings.data[i][settings.cols[j]] + '</div></td>';
            }
            table += (settings.button || '') + '</tr>';
        }
        table += '</table>';
        return table;
    }

    // sorts the source array according to the value of each element at the index
    function sort_by_priority(source_array, index) {
        if(!source_array || (!index && index !== 0)) {
            return;
        }
        // initializing some variables at the start rather than in the loop
        var week_temp_tasks = {},
            current_priority = 0,
            highest_priority = 0;
        // loop through all items and store them in an array at the index of their priority within an object
        for (var i = 0; i < source_array.length; i++) {
            if (!source_array[i]) {
                continue;
            }
            current_priority = source_array[i][index];
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
        for (i = 0; i <= highest_priority; i++) {
            // check if there is a value at the index
            if (week_temp_tasks[i]) {
                sorted_array = sorted_array.concat(week_temp_tasks[i]);
            }
        }
        return sorted_array;
    }

    // function to show messages to the user
    function message(message) {
        if(!message) {
            return;
        }
        $('#message').stop().html(message).slideToggle(20).delay(2000).slideToggle(20);
        console.log(message);
    }

    // on ready
    $(function() {

        // reads the document cookie to find the stored events for the schedule
        (function(){
            try {
                // regex pattern from https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
                events = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)events\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
                draw.events()();
            } catch(e) {
                document.cookie = 'events={}';
            }
        }());

        // test to add an event to the timeline each page load
        draw.event({
            title:"Meeting",
            description:"Going over the stuff for the thing",
            height:(Math.random()*200),
            position:(Math.random()*600)
        })();

        // fills the time column on the scheduling window
        (function() {
            var contents = '',
                // values in minutes since 0 am
                start = 480,
                end = 1200,
                // in minutes
                increment = 15,
                current = start;
            while(current <= end) {
                contents += '<tr><td>' + Math.floor(current/60) + ':' + (current%60 || '00') + '</td></tr>';
                current += increment;
            }
            $('#times').html(contents + '<tr><td></tr></td>');
        }());

        // requests all the information for the user
        $.post('../php_helper/retreive.php', {}, function(response) {
            console.log(response);
            if (response.status == 'success') {
                user = response;
                // adding an index to each element to reference it in the response object
                for (var i = 0; i < db_struct.tables.length; i++) {
                    var current_table = db_struct.tables[i];
                    for (var j = 0; j < user[current_table].length; j++) {
                        user[current_table][j].push(j);
                    }
                }
                draw.all()();
            } else {
                message(response.status);
            }
        }, 'JSON');

        // click listener for the utility buttons
        $('.utility').on('click', function() {
            // toggle which form is shown
            $('.form').toggle();
            $('input').not('.button').val('');
        });

        // click listener for the signin button
        $('#login_form').on('submit', function(e) {
            e.preventDefault();
            // storing the values of the fields
            var info = {
                identifier: $('#login_identifier').val().trim(),
                password: $('#login_password').val().trim()
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
        $('#register_form').on('submit', function(e) {
            e.preventDefault();
            // storing the values of the fields
            var info = {
                username: $('#register_user').val().trim(),
                email: $('#register_email').val().trim(),
                password: $('#register_password').val().trim(),
                checkpassword: $('#register_checkpassword').val().trim()
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
                    // toggle which form is shown
                    $('.form').toggle();
                    $('input').not('.button').val('');
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

        // click listener for add buttons
        $('.add, #cancel').on('click', function() {
            var type = $(this).attr('data-source');
            $('#darken').toggle();
            $('.add_dialog').hide();
            $('#add_' + type).show();
        });

        // submit listener for the form that adds a new objective
        $('#add_objective_form').on('submit', function(e) {
            e.preventDefault();
            var info = {
                type: 'objectives',
                description: $('#objective_description').val().trim(),
                priority: $('#objective_priority').val().trim()
            };
            for (var key in info) {
                if (info.hasOwnProperty(key)) {
                    if (!info[key]) {
                        message('please fill in all the fields');
                        return;
                    }
                }
            }
            $.post('../php_helper/objective.php', info, function(add_response) {
                if (add_response.status == 'success') {
                    var target = user.objectives;
                    $('#darken').toggle();
                    $('#add_objective_form').children('input').not('.button').val('');
                    target.push([add_response.id, '', info.description, info.priority, target.length]);
                    draw.objectives()();
                } else {
                    message(add_response.status);
                }
            }, 'JSON');
        });

        // submit listener for the form that adds a new objective
        $('#add_project_form').on('submit', function(e) {
            e.preventDefault();
            var info = {
                type: 'projects',
                description: $('#project_description').val().trim(),
                priority: $('#project_priority').val().trim()
            };
            for (var key in info) {
                if (info.hasOwnProperty(key)) {
                    if (!info[key]) {
                        message('please fill in all the fields');
                        return;
                    }
                }
            }
            $.post('../php_helper/project.php', info, function(add_response) {
                if (add_response.status == 'success') {
                    var target = user.projects;
                    $('#darken').toggle();
                    $('#add_project_form').children('input').not('.button').val('');
                    target.push([add_response.id, '', info.description, info.priority, target.length]);
                    draw.projects()();
                } else {
                    message(add_response.status);
                }
            }, 'JSON');
        });

        // submit listener for the form that adds a new task
        $('#add_task_form').on('submit', function(e) {
            e.preventDefault();
            var info = {
                type: tasks,
                description: $('#task_description').val().trim(),
                priority: $('#task_priority').val().trim(),
                objective: $('#dropdown_objectives_task').val(),
                project: $('#dropdown_projects_task').val()
            };
            for (var key in info) {
                if (info.hasOwnProperty(key)) {
                    if (!info[key]) {
                        message('please fill in all the fields');
                        return;
                    }
                }
            }
            $.post('../php_helper/task.php', info, function(add_response) {
                if (add_response.status == 'success') {
                    var target = user.tasks;
                    $('#darken').toggle();
                    $('#add_task_form').children('input').not('.button').val('');
                    target.push([add_response.id, '', info.description, info.priority, info.objective, info.project, null, null, target.lenght]);
                    draw.tasks()();
                } else {
                    message(add_response.status);
                }
            }, 'JSON');
        });

        // submit listener for the form that adds a new meeting
        $('#add_meeting_form').on('submit', function(e) {
            e.preventDefault();
            var info = {
                description: $('#meeting_description').val().trim(),
                objective: $('#dropdown_objectives_meeting').val(),
                project: $('#dropdown_projects_meeting').val(),
                start: $('#start_hour').val() + ':' + $('#start_min').val(),
                end: $('#end_hour').val() + ':' + $('#end_min').val()
            };
            for (var key in info) {
                if (info.hasOwnProperty(key)) {
                    if (!info[key]) {
                        message('please fill in all the fields');
                        return;
                    }
                }
            }
            $.post('../php_helper/meeting.php', info, function(add_response) {
                if (add_response.status == 'success') {
                    var target = user.meetings,
                        length = target.length;
                    $('#darken').toggle();
                    $('#add_meeting_form').children('input').not('.button').val('');
                    target.push([add_response.id, '',info.description, info.objective, info.project, info.start, info.end]);
                    target[length].push(length);
                    console.log(user);
                    draw.meetings()();
                } else {
                    message(add_response.status);
                }
            }, 'JSON');
        });
    });
}());
