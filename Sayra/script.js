// code when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {

    // fade in menu
    setTimeout(function() {
        document.getElementById('menu').style.opacity = 1;
    }, 0);

    // send form data back to server
    var form = document.getElementById('contactform');
    form.addEventListener('submit', function(e) {
        var body = '';
        var fields = ['Name', 'Email', 'Telephone', 'Gender', 'Location', 'Description', 'Referral'];
        for (let i = 0; i < fields.length; ++i) {
            body += fields[i] + ':\n';
            body += form.children[i].children[1].value || 'not specified';
            body += '\n\n';
        }
        e.preventDefault();
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/mail.php', true);
        xhr.setRequestHeader('Content-Type', 'text/plain');
        xhr.onload = function() {
            if (xhr.status === 200 && xhr.responseText === '1') {
                alert('Form submitted, I will be in contact with you shortly.');
                window.location.reload(false);
            }
        };
        xhr.send(body);
    });

    // services tab code
    document.getElementById('tab_content').children[0].style.display = 'inline-block';
    var tab = document.getElementById('services_tabs');
    tab.children[0].children[0].children[0].id = 'active_tab';
    tab.addEventListener('click', function(e) {
        var content = document.getElementById('tab_content'),
            tab_number = e.target.getAttribute('data-tab');
        if (tab_number) {
            for (var i = 0; i < content.children.length; i++) {
                tab.children[0].children[0].children[i].id = '';
                content.children[i].style.display = 'none';
            }
            tab.children[0].children[0].children[tab_number].id = 'active_tab';
            content.children[tab_number].style.display = 'inline-block';
        }
    });

    // scrolls to target in duration with easing
    window.scrollTo = function(target, duration) {
        // finding place to scroll to
        var element = document.getElementById(target);
        if (!element) {
            return 0;
        }
        target = (element.getBoundingClientRect().top + window.pageYOffset || document.documentElement.scrollTop) - 45;
        // defaults
        duration = duration || 1000;
        // does not use animations if browser is too old
        if (!window.requestAnimationFrame && !(window.scrollY || document.documentElement.scrollTop)) {
            console.log('please update your browser for best experience');
            if (window.scoll) {
                window.scroll(Xscroll, target);
            }
            return;
        }
        // variables
        var Xscroll = window.scrollX || document.documentElement.scrollLeft || 0,
            Yscroll = window.scrollY || document.documentElement.scrollTop || 0,
            startTime;
        // animates the scroll to the target value
        window.requestAnimationFrame(scrolldown);
        function scrolldown(time) {
            startTime = startTime || time;
            time -= startTime;
            var completion = (0.5 * Math.cos( Math.PI * (time/duration) + Math.PI ) + 0.5);
            window.scroll(Xscroll, Yscroll+(target-Yscroll)*completion);
            if (time < duration) {
                window.requestAnimationFrame(scrolldown);
            } else {
                window.scroll(Xscroll, target);
            }
        }
    }

});
