// code when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {

    // replacement DOM when js is enabled
    document.querySelector('#menu').innerHTML =
        '<li data-scrollto="hero_banner">HOME</li>' +
        '<li data-scrollto="need">WHY YOU NEED US</li>' +
        '<li data-scrollto="what">WHAT WE DO</li>' +
        '<li data-scrollto="who">SAYRA WHO?</li>' +
        '<li data-scrollto="gossip">THE GOSSIP</li>' +
        '<li data-scrollto="price">THE PRICE</li>' +
        '<li data-scrollto="hotline">THE HOTLINE</li>';
    document.querySelector('#more').outerHTML =
        '<div id="more" data-scrollto="need">EXPLORE</div>';

    // add click event to all scroll buttons
    var scroll = document.querySelectorAll('[data-scrollto]');
    for (var i = 0; i < scroll.length; ++i) {
        (function(i) {
            scroll[i].addEventListener('click', function() {
                scrollTo(scroll[i].getAttribute('data-scrollto'), 1000);
            });
        }(i))
    }

    // scrolls to target in duration with easing
    scrollTo = function(target, duration) {
        var element = document.getElementById(target);
        if (!element) {
            return 0;
        }
        target = (element.getBoundingClientRect().top + window.pageYOffset || document.documentElement.scrollTop) - 40;
        duration = duration || 1000;
        if (!window.requestAnimationFrame && !(window.scrollY || document.documentElement.scrollTop)) {
            console.log('please update your browser for best experience');
            if (window.scoll) {
                window.scroll(Xscroll, target);
            }
            return;
        }
        var Xscroll = window.scrollX || document.documentElement.scrollLeft || 0,
            Yscroll = window.scrollY || document.documentElement.scrollTop || 0,
            startTime;
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
