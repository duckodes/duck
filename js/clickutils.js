var clickutils = (function () {
    return {
        click: click,
        nClick: nClick
    };
    function click(element, button, func) {
        let start = false;
        element.addEventListener("mousedown", (e) => {
            if (e.button === button) {
                start = true;
            } else {
                start = false;
            }
            function mouseUp() {
                start = false;
                window.removeEventListener('mouseup', mouseUp);
            }
            window.addEventListener('mouseup', mouseUp);
        });
        element.addEventListener("mouseup", () => {
            if (start) {
                func();
            }
        });
        element.addEventListener("touchstart", (e) => {
            start = true;
            function touchEnd() {
                start = false;
                window.removeEventListener('touchend', touchEnd);
            }
            window.addEventListener('touchend', touchEnd);
        });
        element.addEventListener("touchend", () => {
            if (start) {
                func();
            }
        });
    }
    function nClick(element, button) {
        return new Promise((resolve) => {
            let start = false;
            element.addEventListener("mousedown", (e) => {
                if (e.button === button) {
                    start = true;
                } else {
                    start = false;
                }
                function mouseUp() {
                    start = false;
                    window.removeEventListener('mouseup', mouseUp);
                }
                window.addEventListener('mouseup', mouseUp);
            });
            element.addEventListener("mouseup", () => {
                if (start) {
                    resolve();
                }
            });
            element.addEventListener("touchstart", (e) => {
                start = true;
                function touchEnd() {
                    start = false;
                    window.removeEventListener('touchend', touchEnd);
                }
                window.addEventListener('touchend', touchEnd);
            });
            element.addEventListener("touchend", () => {
                if (start) {
                    resolve();
                }
            });
        });
    }
}());