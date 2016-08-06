var
    // the user object that will store all the user data
    user = {
        meetings: [],
        objectives: [],
        projects: [],
        tasks: []
    },
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
                button: '<td><span class="remove button">X</span></td>'
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
                button: '<td><span class="remove button">X</span></td>'
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
                col_width: ['75px', '36%', '32%', '32%', '30px', '30px'],
                edit_cols: [true, true, true, true],
                button: '<td><span class="strike button">--</span></td><td><span class="remove button">X</span></td>'
            }));
            $('#tasks_week_source').html(table({
                titles: ['priority', 'tasks'],
                data: tasks_all,
                responseid: 8,
                cols: [3,2],
                col_width: ['75px', '100%', '29px'],
                edit_cols: [false, false],
                button: '<td><span class="move button" data-target="week">></span></td>'
            }));
            $('#tasks_week').html(table({
                titles: ['priority', 'week tasks'],
                data: tasks_week,
                responseid: 8,
                cols: [6,2],
                col_width: ['75px', '100%', '30px', '30px'],
                edit_cols: [true, false],
                button: '<td><span class="strike button">--</span></td><td><span class="remove_shallow button" data-source="week_priority">X</span></td>'
            }));
            $('#tasks_day_source').html(table({
                titles: ['priority', 'week tasks'],
                data: tasks_week,
                responseid: 8,
                cols: [6,2],
                col_width: ['75px', '100%', '29px'],
                edit_cols: [false, false],
                button: '<td><span class="move button" data-target="day">></span></td>'
            }));
            $('#tasks_day').html(table({
                titles: ['priority', 'day tasks'],
                data: tasks_day,
                responseid: 8,
                cols: [7,2],
                col_width: ['75px', '100%', '30px', '30px', '30px'],
                edit_cols: [true, false],
                button: '<td><span class="strike button">--</span></td><td><span class="remove_shallow button" data-source="day_priority">X</span></td><td><span class="move_task button" data-target="timeline">></span></td>'
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
                col_width: ['60px', '60px', '50%', '25%', '25%', '30px', '30px'],
                edit_cols: [true, true, true, true, true],
                button: '<td><span class="remove button">X</span></td><td><span class="move_meeting button" data-target="timeline">></span></td>'
            }));
            return function() {
                bind.edit();
                bind.remove();
                bind.move_meeting();
            };
        },
        events: function() {
            for (var i = 0; i < events.length; i++) {
                if (events[i]) {
                    events[i].key = i;
                    draw.event(events[i]);
                }
            }
            return function() {
                bind.remove_event();
            };
        },
        event: function(event) {
            var contents = '<div class="event dropshadow" data-key="' + (event.key || '0') + '" ';
            contents += 'style="top:' + (event.position || 46 ) + 'px;height:' + (event.height || 46) + 'px">';
            contents += '<span class="event_title">' + (event.title || '') + '</span>';
            contents += '<span class="event_description">' + (event.description || '') + '</span>';
            contents += '</div>';
            $('#schedule_wrapper').append(contents);
            return function() {
                events.push({
                    'title':event.title,
                    'description':event.description,
                    'height':event.height,
                    'position':event.position,
                    'key': events.length
                });
                bind.remove_event();
                $('#schedule_wrapper').scrollTop(event.position-100);
                localStorage.events = JSON.stringify(events);
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
            bind.move_task();
            bind.move_meeting();
            bind.strike();
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
                user.tasks[index][target_index] = user.tasks[index][source_index];
                update_user_cookie();
                draw.tasks()();
            });
        },
        edit: function() {
            $('.editable').off().on('click', function() {
                var element = $(this),
                    oldvalue = element.html();
                if (oldvalue.match('^<s>') && oldvalue.match('</s>$')) {
                    message('cannot edit completed task description');
                    return;
                }
                var type = element.parent().closest('div').attr('data-source'),
                    index = element.closest('tr').attr('data-responseid'),
                    position = element.closest('td').attr('data-datapos');
                // replacing the text inside the clicked div with a text input element
                element.closest('td').html('<input type="text" id="live_edit"></input>');
                // setting focus to the new input and adding a blur listener to store the value
                var live_edit = $('#live_edit');
                live_edit.focus();
                live_edit.val(oldvalue).select();
                live_edit.on('blur', function() {
                    var newvalue = live_edit.val().trim();
                    // resets if the new value is empty or has not been changed
                    if (!newvalue || newvalue == oldvalue) {
                        live_edit.closest('td').html('<div class="editable">' + oldvalue + '</div>');
                        bind.edit();
                        return;
                    }
                    // resets if the number entered should be a number but isnt
                    if ((type != 'meetings' && position == 3) && !Number(newvalue)) {
                        live_edit.closest('td').html('<div class="editable">' + oldvalue + '</div>');
                        message('invalid number');
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
                    user[type][index][position] = newvalue;
                    update_user_cookie();
                    draw[type]()();
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
                element.closest('tr').remove();
                delete user[type][index];
                update_user_cookie();
                draw.all()();
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
                user.tasks[index][((type == 'week_priority')?6:7)] = undefined;
                update_user_cookie();
                draw.tasks()();
            });
        },
        remove_event: function() {
            $('.event').off().on('dblclick', function() {
                delete events[$(this).attr('data-key')];
                localStorage.events = JSON.stringify(events);
                $(this).hide();
            });
        },
        move_task: function() {
            $('.move_task').off().on('click', function() {
                var index = $(this).closest('tr').attr('data-responseid');
                console.log(index);
                $('#darken').toggle();
                $('.add_dialog').hide();
                $('#add_task_event').show();
                $('#add_task_event').off().on('submit', function(e) {
                    e.preventDefault();
                    var starth = $('#add_task_event #start_hour').val(),
                        startm = $('#add_task_event #start_min').val() || 0,
                        endh = $('#add_task_event #end_hour').val(),
                        endm = $('#add_task_event #end_min').val() || 0;
                    draw.event({
                        title: 'Task',
                        description: user.tasks[index][2],
                        height: (endh*60 + Number(endm) - starth*60 - Number(startm))/15*23,
                        position: (starth*60 + Number(startm) - 360)/15*23
                    })();
                    $('input').not('input[type="button"], input[type="submit"]').val('');
                    $('#darken').hide();
                });
            });
        },
        move_meeting: function() {
            $('.move_meeting').off().on('click', function() {
                var meeting = user.meetings[$(this).closest('tr').attr('data-responseid')],
                    starth = meeting[5].split(':')[0],
                    startm = meeting[5].split(':')[1],
                    endh = meeting[6].split(':')[0],
                    endm = meeting[6].split(':')[1];
                draw.event({
                    title: 'Meeting',
                    description: meeting[2],
                    height: (endh*60 + Number(endm) - starth*60 - Number(startm))/15*23,
                    position: (starth*60 + Number(startm) - 360)/15*23
                })();
            });
        },
        strike: function() {
            $('.strike').off().on('click', function() {
                var element = $(this),
                    type = element.parent().closest('div').attr('data-source'),
                    index = element.closest('tr').attr('data-responseid'),
                    value = user[type][index][2];
                if (value.match('<s>') && value.match('</s>')) {
                    user[type][index][2] = value.replace('<s>', '').replace('</s>', '');
                } else {
                    user[type][index][2] = '<s>' + value + '</s>';
                }
                update_user_cookie();
                draw.all()();
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
            table += '<td data-datapos="' + settings.cols[j] + '"><div class=' + (settings.edit_cols[j]?'"editable"':'"not_editable"') + '>' + settings.data[i][settings.cols[j]] + '</div></td>';
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

function update_user_cookie() {
    console.log('saved');
    localStorage.user = JSON.stringify(user);
}

// on ready
$(function() {

    // reads the document cookie to find the stored values for the schedule
    (function(){
        try {
            events = JSON.parse(localStorage.events);
        } catch(e) {
            events = [];
        }
        try {
            user = JSON.parse(localStorage.user);
        } catch(e) {
            user= {meetings:[], objectives:[], projects:[], tasks:[]};
        }
        draw.events()();
        draw.all()();
    }());

    // fills the time column on the scheduling window
    (function() {
        var contents = '',
            // values in minutes since 0 am
            start = 360,
            end = 1200,
            // in minutes
            increment = 15,
            current = start;
        while(current <= end) {
            contents += '<tr><td>' + Math.floor(current/60) + ':' + (current%60 || '00') + '</td></tr>';
            current += increment;
        }
        $('#times').html(contents + '<tr><td></tr></td>');
        $('#schedule_wrapper').scrollTop(184);
    }());

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
        $('input').not('input[type="button"], input[type="submit"]').val('');
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
        var target = user.objectives;
        $('#darken').toggle();
        target.push([1, '', info.description, info.priority, target.length]);
        update_user_cookie();
        draw.objectives()();
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
        var target = user.projects;
        $('#darken').toggle();
        target.push([1, '', info.description, info.priority, target.length]);
        update_user_cookie();
        draw.projects()();
    });

    // submit listener for the form that adds a new task
    $('#add_task_form').on('submit', function(e) {
        e.preventDefault();
        var info = {
            type: tasks,
            description: $('#task_description').val().trim(),
            priority: $('#task_priority').val().trim()
        };
        for (var key in info) {
            if (info.hasOwnProperty(key)) {
                if (!info[key]) {
                    message('please fill in all the fields');
                    return;
                }
            }
        }
        info.objective = $('#dropdown_objectives_task').val() || '-- not specified --';
        info.project = $('#dropdown_projects_task').val() || '-- not specified --';
        var target = user.tasks;
        $('#darken').toggle();
        target.push([1, '', info.description, info.priority, info.objective, info.project, null, null, target.length || 0]);
        update_user_cookie();
        draw.tasks()();
    });

    // submit listener for the form that adds a new meeting
    $('#add_meeting_form').on('submit', function(e) {
        e.preventDefault();
        var starth = $('#add_meetings #start_hour').val(),
            startm = $('#add_meetings #start_min').val(),
            endh = $('#add_meetings #end_hour').val(),
            endm = $('#add_meetings #end_min').val(),
            info = {
                description: $('#meeting_description').val().trim(),
                start: starth + ':' + startm,
                end: endh + ':' + endm
            };
        for (var key in info) {
            if (info.hasOwnProperty(key)) {
                if (!info[key]) {
                    message('please fill in all the fields');
                    return;
                }
            }
        }
        info.objective = $('#dropdown_objectives_meeting').val() || '-- not specified --';
        info.project = $('#dropdown_projects_meeting').val() || '-- not specified --';
        var target = user.meetings,
            length = target.length;
        $('#darken').toggle();
        target.push([1, '',info.description, info.objective, info.project, info.start, info.end]);
        target[length].push(length);
        update_user_cookie();
        draw.meetings()();
        draw.event({
            title: 'Meeting',
            description: info.description,
            height: (endh*60 + Number(endm) - starth*60 - Number(startm))/15*23,
            position: (starth*60 + Number(startm) - 360)/15*23
        })();
    });
});
