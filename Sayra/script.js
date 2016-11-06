// code when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    
    // fade in menu
    setTimeout(function() {
        document.getElementById('menu').style.opacity = 1;
    }, 0);

    // scrolls to the begining of content
    document.getElementById('more').addEventListener('click', function() {
        scrollTo(window.innerHeight, 1000);
    });

    // send for data back to server
    document.getElementById('logo_main').addEventListener('click', function() {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'mail.php', true);
        xhr.setRequestHeader('Content-Type', 'text/plain');
        xhr.onload = function() {
            console.log(xhr.status, xhr.responseText);
        };
        xhr.send('john');
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

});

// scrolls to target in duration with easing
function scrollTo(target, duration) {
    // defaults
    duration = duration || 1000;
    target = target || 0;
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
