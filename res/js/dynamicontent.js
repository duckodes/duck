var dynamicontent = (function () {
    return {
        init: init
    };
    function init(textArray, element) {
        let index = 0;
        let subIndex = 0;
        let isDeleting = false;
        let pauseText = false;

        function animateText() {
            if (!pauseText) {
                let currentText = textArray[index % textArray.length];
                let displayText = currentText.slice(0, subIndex);

                if (!isDeleting && subIndex === currentText.length) {
                    isDeleting = true;
                } else if (isDeleting && subIndex === 0) {
                    isDeleting = false;
                    index++;
                }

                subIndex += isDeleting ? -1 : 1;

                let nextText = textArray[(index + 1) % textArray.length];
                let nextFirstChar = nextText ? nextText.charAt(0) : "Default";

                element.textContent = displayText || nextFirstChar;

                setTimeout(animateText, 500);
                if (displayText.length === currentText.length) {
                    pauseText = true;
                }
            }
            else {
                setTimeout(() => {
                    pauseText = false;
                    animateText();
                }, 2000);
            }
        }

        function animateCursor() {
            setInterval(() => {
                if (pauseText) {
                    element.textContent = element.textContent.endsWith("|") ? document.title.slice(0, -1) : element.textContent + "|";
                }
                else {
                    if (!element.textContent.endsWith("|")) {
                        element.textContent += "|";
                    }
                }
            }, 300);
        }

        animateText();
        animateCursor();
    }
}());