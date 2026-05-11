const scrollview = (() => {
    return {
        init: async () => {
            clickutils.click(document.querySelectorAll('.navbtn')[0], 0, () => {
                scrollviewutils.cto('.about');
            });
            clickutils.click(document.querySelectorAll('.navbtn')[1], 0, () => {
                scrollviewutils.cto('.card');
            });
            clickutils.click(document.querySelectorAll('.navbtn')[2], 0, () => {
                scrollviewutils.cto('.contact');
            });
            clickutils.click(document.querySelector('.tech-notes-more>span'), 0, () => {
                scrollviewutils.cto('.daily-topic');
            });
            clickutils.click(document.querySelector('.daily-topic-more>span'), 0, () => {
                scrollviewutils.cto('.about');
            });
        }
    }
})();
export default scrollview;