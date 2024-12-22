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

    clickutils.click(document.querySelector('.language-switch'), 0, async () => {
      if (document.documentElement.lang === languageType.zh_tw) {
        document.documentElement.lang = languageType.en_za;
      } else {
        document.documentElement.lang = languageType.zh_tw;
      }
      document.body.innerHTML = null;
      language.clear();
      document.querySelector('title').remove();
      document.querySelector('head').appendChild(document.createElement('title'));
      languageData = await language.cache(document.documentElement.lang);
      init(languageData);
    });

    await comments.init(languageData);
    await scrollview.init();
    await generatecard.init(languageData);

    dynamicontent.inititle(["Duckode", "Hello", "Quack, quack!"], document.querySelector('title'));
    dynamicontent.init(["Hello, I'm BytemeBear!", "Welcome!"], document.querySelector('h1'), '#36f', 5000);

    motionbackground.initdotliner('#00000070', '#00000010');
    (await commentsutils).init();
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
                    ${languageData.otherinfo.mailto ?? 'Gmail'}
                </a>
            </div>
        </div>
    </div>
    `
  }
})();

export default main;