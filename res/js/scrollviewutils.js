var scrollviewutils = (function () {
    return {
        ito: ito,
        cto: cto
    };
    function ito(id) {
        document.getElementById(id).scrollIntoView();
    }
    function cto(c) {
        document.querySelector(c).scrollIntoView();
    }
}());