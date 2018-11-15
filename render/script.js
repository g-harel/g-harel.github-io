var defaultHash = "#projects";
var activeClass = "hash-active";

function updateActive() {
    var hash = document.location.hash;
    hash = hash.replace(/^#/, "");

    if (hash === "") {
        return;
    }

    var active = document.querySelectorAll("." + activeClass);
    for (item of active) {
        item.classList.remove(activeClass);
    }

    var a = document.querySelectorAll("." + hash);
    for (item of a) {
        item.classList.add(activeClass);
    }
}

window.addEventListener("hashchange", updateActive);
window.addEventListener("load", updateActive);

document.location.hash = document.location.hash || defaultHash;
