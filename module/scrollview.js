const scrollview = (() => {
    return {
        init: async () => {
            clickutils.click(document.querySelectorAll('.navbtn')[0], 0, () => {
                scrollviewutils.cto('.home');
            });
            clickutils.click(document.querySelectorAll('.navbtn')[1], 0, () => {
                scrollviewutils.cto('.card');
            });
            clickutils.click(document.querySelectorAll('.navbtn')[2], 0, () => {
                scrollviewutils.cto('.contact');
            });
        }
    }
})();
export default scrollview;