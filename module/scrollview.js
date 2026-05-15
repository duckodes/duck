const scrollview = (() => {
    return {
        init: async () => {
            clickutils.click(document.querySelectorAll('.navbtn')[0], 0, () => {
                scrollviewutils.cto('.noteest');
            });
            clickutils.click(document.querySelectorAll('.navbtn')[1], 0, () => {
                scrollviewutils.cto('.about');
            });
            clickutils.click(document.querySelectorAll('.navbtn')[2], 0, () => {
                scrollviewutils.cto('.card');
            });
            clickutils.click(document.querySelectorAll('.navbtn')[3], 0, () => {
                scrollviewutils.cto('.recommended');
            });
            clickutils.click(document.querySelectorAll('.navbtn')[4], 0, () => {
                scrollviewutils.cto('footer');
            });
            clickutils.click(document.querySelector('.noteest-logo-more'), 0, () => {
                scrollviewutils.cto('.noteest');
            });
            clickutils.click(document.querySelector('.noteest-more>span'), 0, () => {
                scrollviewutils.cto('.daily-topic');
            });
            clickutils.click(document.querySelector('.daily-topic-more>span'), 0, () => {
                scrollviewutils.cto('.about');
            });
        }
    }
})();
export default scrollview;