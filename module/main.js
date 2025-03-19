import generatecard from "./generatecard.js";
import language from "./language.js";
import scrollview from "./scrollview.js";
import comments from "./comments.js";
import commentsutils from "./commentsutils.js";

const main = (async () => {
    const languageType = {
        zh_tw: 'zh-TW',
        en_za: 'en-ZA'
    }
    document.documentElement.lang = navigator.language;
    let languageData = await language.cache(navigator.language);
    init(languageData);

    async function init(languageData) {
        document.body.innerHTML = render(languageData);

        await comments.init(languageData);
        await scrollview.init();
        await generatecard.init(languageData);

        dynamicontent.inititle(["Duckode", "Hello", "Quack, quack!"], document.querySelector('title'));
        dynamicontent.init(["Hello, I'm BytemeBear!", "Welcome!"], document.querySelector('h1'), '#36f', 5000);

        motionbackground.initdotliner('#00000070', '#00000010');
        (await commentsutils).init();
        registEvents();
    }

    function registEvents() {
        clickutils.click(document.querySelector('.language-switch'), 0, async () => {
            if (document.documentElement.lang === languageType.zh_tw) {
                document.documentElement.lang = languageType.en_za;
            } else {
                document.documentElement.lang = languageType.zh_tw;
            }
            language.clear();
            document.querySelector('title').remove();
            document.querySelector('head').appendChild(document.createElement('title'));
            languageData = await language.cache(document.documentElement.lang);
            init(languageData);
        });
    }

    function render(languageData) {
        return `
    <div class="duck">
        <div class="language-switch">
            en繁
        </div>
        <div class="nav">
            <div class="navbtn">
                ${languageData.nav.home ?? 'home'}
            </div>
            <div class="navbtn">
                ${languageData.nav.topic ?? 'topic'}
            </div>
            <div class="navbtn">
                ${languageData.nav.contact ?? 'contact'}
            </div>
        </div>
        <div class="content">
            <div class="home">
                <h1 class="title">Hello</h1>
            </div>
            <div class="card">
                <div class="card-area"></div>
            </div>
            <div class="contact">
                <h1>${languageData.contact.contact ?? 'Contact'}</h1>
                <div class="field">
                    <div>
                        ${languageData.contact.poststatus ?? 'post status:'}
                        <button id="btn-status">${languageData.contact.public ?? '公開'}</button>
                        ${languageData.contact.clicktochange ?? '(click to change)'}
                    </div>
                    <div class="name-field">
                        <input placeholder="${languageData.contact.placeholder.name ?? 'name..'}" type="text" id="name"/>
                        <div id="error-name-txt"></div>
                    </div>
                    <div id="textarea" contenteditable="true" data-content="${languageData.contact.placeholder.textarea ?? 'comments..'}"></div>
                    <div id="error-textarea-txt"></div>
                    <div class="textarea-tools">
                        <div class="tools-blod">
                            B
                        </div>
                        <div class="tools-i">
                            <em style="font-family: 'Times New Roman', Times, serif;">I</em>
                        </div>
                        <div class="tools-size-num" contenteditable="true"></div>
                        <div class="tools-size plus">
                            &#43;
                        </div>
                        <div class="tools-size minus">
                            &#8722;
                        </div>
                    </div>
                </div>
                <div>
                    <button id="post">${languageData.contact.post ?? '送出留言'}</button>
                </div>
                <div id="comments"></div>
            </div>
            <div class="other-info">
                <a href="mailto:bear90789078@gmail.com">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 100 100">
                        <path d="M71.5,87c-3.584,0-6.5-2.916-6.5-6.5V64.571l-9.1,6.825c-1.119,0.839-2.504,1.3-3.9,1.3s-2.781-0.461-3.898-1.298 L39,64.571V80.5c0,3.584-2.916,6.5-6.5,6.5H19.857C13.319,87,8,81.681,8,75.143v-44.09c0-7.85,6.387-14.236,14.236-14.236 c3.059,0,6.092,1.011,8.539,2.846L52,35.723L73.2,19.68c2.471-1.852,5.505-2.863,8.563-2.863c7.85,0,14.236,6.386,14.236,14.236 v44.09C96,81.681,90.681,87,84.143,87H71.5z" opacity=".35"></path><path fill="#f2f2f2" d="M69.5,85c-3.584,0-6.5-2.916-6.5-6.5V62.571l-9.1,6.825c-1.119,0.839-2.504,1.3-3.9,1.3 s-2.781-0.461-3.898-1.298L37,62.571V78.5c0,3.584-2.916,6.5-6.5,6.5H17.857C11.319,85,6,79.681,6,73.143v-44.09 c0-7.85,6.387-14.236,14.236-14.236c3.059,0,6.092,1.011,8.539,2.846L50,33.723L71.2,17.68c2.471-1.852,5.505-2.863,8.563-2.863 c7.85,0,14.236,6.386,14.236,14.236v44.09C94,79.681,88.681,85,82.143,85H69.5z"></path><path fill="#96c362" d="M87.5,36l-9,4.911l-9,8.482V78.5h12.643c2.959,0,5.357-2.398,5.357-5.357V36z"></path><path fill="#70bfff" d="M12.5,36l6.505,3.054L30.5,49.393V78.5H17.857c-2.959,0-5.357-2.398-5.357-5.357V36z"></path><polygon fill="#ff7575" points="69.643,27.143 50,41.875 30.357,27.143 28.571,37.5 30.357,49.464 50,64.196 69.643,49.464 71.429,37.5"></polygon><path fill="#f4665c" d="M12.5,29.053v7.024l18,13.5v-22.5l-5.623-4.214c-1.339-1.004-2.966-1.546-4.64-1.546l0,0 C15.963,21.316,12.5,24.78,12.5,29.053z"></path><path fill="#ffc571" d="M87.5,29.053v7.024l-18,13.5v-22.5l5.623-4.214c1.339-1.004,2.966-1.546,4.64-1.546l0,0 C84.037,21.316,87.5,24.78,87.5,29.053z"></path><path fill="#40396e" d="M82.143,80H69.5c-0.828,0-1.5-0.671-1.5-1.5V52.571L50.9,65.396c-0.533,0.399-1.268,0.399-1.801,0 L32,52.571V78.5c0,0.829-0.672,1.5-1.5,1.5H17.857C14.076,80,11,76.924,11,73.143v-44.09c0-5.093,4.144-9.236,9.236-9.236 c1.984,0,3.952,0.656,5.54,1.846L50,39.994l24.218-18.327c1.594-1.194,3.562-1.85,5.546-1.85c5.093,0,9.236,4.144,9.236,9.236 v44.09C89,76.924,85.924,80,82.143,80z M71,77h11.143C84.27,77,86,75.27,86,73.143v-44.09c0-3.438-2.798-6.236-6.236-6.236 c-1.34,0-2.669,0.443-3.741,1.247L50.905,43.071c-0.535,0.405-1.275,0.405-1.811,0L23.972,24.059 c-1.066-0.8-2.396-1.243-3.735-1.243c-3.438,0-6.236,2.798-6.236,6.236v44.09C14,75.27,15.73,77,17.857,77H29V49.571 c0-0.568,0.321-1.087,0.829-1.342c0.508-0.253,1.117-0.199,1.571,0.142L50,62.321l18.6-13.95c0.454-0.341,1.063-0.396,1.571-0.142 C70.679,48.484,71,49.003,71,49.571V77z"></path>
                    </svg>
                    ${languageData.otherinfo.mailto ?? 'Gmail'}
                </a>
                <a href="https://github.com/duckodes">
                    <svg viewBox="0 0 100 100" width="39.2" height="38.4" xmlns="http://www.w3.org/2000/svg">
                        <path width="100%" height="100%" fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#24292f"/>
                    </svg>
                </a>
            </div>
        </div>
    </div>
    `
    }
})();

export default main;