import generatecard from "./generatecard.js";
import language from "./language.js";
import scrollview from "./scrollview.js";
import comments from "./comments.js";

const main = (async () => {
  const languageType = {
    zh_tw: 'zh-TW',
    en_za: 'en-ZA'
  }
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
    dynamicontent.init(["Hello, I'm BytemeBear!", "Welcome!"], document.querySelector('h1'), '#36f', 5000);

    motionbackground.initdotliner('#00000070', '#00000010');

    let isMouseDown = false;
    let lastExecution = 0;
    const interval = 100;
    document.querySelector('#textarea').addEventListener("input", () => {
      if (document.querySelector('#textarea').textContent === "" || document.querySelector('#textarea').textContent === null) {
        document.querySelector('#textarea').innerHTML = "";
      }
    });
    document.querySelector('.tools-size.plus').addEventListener("mousedown", () => {
      isMouseDown = true;
      function continuousAction(timestamp) {
        if (isMouseDown) {
          if (timestamp - lastExecution > interval) {
            if (parseInt(document.querySelector('.tools-size-num').innerHTML) <= 71) {
              changeSelectedTextFontSize((parseInt(document.querySelector('.tools-size-num').innerHTML) + 1) + 'px');
            }
            lastExecution = timestamp;
          }
          requestAnimationFrame(continuousAction);
        }
      }

      requestAnimationFrame(continuousAction);
    });
    document.querySelector('.tools-size.minus').addEventListener("mousedown", () => {
      isMouseDown = true;
      function continuousAction(timestamp) {
        if (isMouseDown) {
          if (timestamp - lastExecution > interval) {
            if (parseInt(document.querySelector('.tools-size-num').innerHTML) > 0) {
              changeSelectedTextFontSize((parseInt(document.querySelector('.tools-size-num').innerHTML) - 1) + 'px');
            }
            lastExecution = timestamp;
          }
          requestAnimationFrame(continuousAction);
        }
      }

      requestAnimationFrame(continuousAction);
    });
    document.addEventListener('mouseup', function (event) {
      isMouseDown = false;
    });

    function getSelectedTextFontSize() {
      let selection = window.getSelection();
      if (selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);

        // Get the container node of the selected range
        let container = range.commonAncestorContainer;

        // Check if the container is a text node, if so, get its parent element
        if (container.nodeType === Node.TEXT_NODE) {
          container = container.parentElement;
        }

        // Find the deepest element containing the whole selection
        while (container.childNodes.length === 1 && container.firstChild.nodeType === Node.ELEMENT_NODE) {
          container = container.firstChild;
        }

        // Get the computed style of the deepest element to retrieve font-size
        let fontSize = window.getComputedStyle(container).fontSize;
        return fontSize;
      } else {
        document.querySelector('.tools-size-num').innerText = "";
        return null;
      }
    }
    function changeSelectedTextFontSize(newSize) {
      let selection = window.getSelection();
      if (selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);
        let selectedText = range.toString();
        let startNode = range.startContainer;
        let endNode = range.endContainer;

        let spanElement = document.createElement('span');
        spanElement.textContent = selectedText;
        spanElement.style.fontSize = newSize;

        // Extract the selected text
        range.deleteContents();
        range.insertNode(spanElement);

        // Re-select the original range
        let newRange = document.createRange();
        if (startNode.nodeType === Node.TEXT_NODE) {
          newRange.setStart(spanElement.firstChild, 0);
          newRange.setEnd(spanElement.firstChild, selectedText.length);
        } else {
          newRange.selectNodeContents(spanElement);
        }

        selection.removeAllRanges();
        selection.addRange(newRange);

        document.querySelector('#textarea').childNodes.forEach(span => {
          if (span.innerText === "" || null) {
            span.remove();
          }
        });
      }
    }

    document.addEventListener("selectionchange", () => {
      if (!isNaN(parseInt(getSelectedTextFontSize()))) {
        document.querySelector('.tools-size-num').innerText = parseInt(getSelectedTextFontSize());
      }
      if (!isStrong()) {
        document.querySelector('.tools-blod').classList.remove('tools-active');
      } else {
        document.querySelector('.tools-blod').classList.add('tools-active');
      }
      if (!isEm()) {
        document.querySelector('.tools-i').classList.remove('tools-active');
      } else {
        document.querySelector('.tools-i').classList.add('tools-active');
      }
    });

    document.querySelectorAll('.textarea-tools > *').forEach(c => {
      c.addEventListener('click', function () {
        document.querySelectorAll('.textarea-tools > *').forEach(otherc => {
          if (otherc !== this) {
            //otherc.classList.remove('tools-active');
          }
        });
        this.classList.remove('tools-hover');
        this.classList.toggle('tools-active');
        if (c === document.querySelectorAll('.tools-size')[0] ||
          c === document.querySelectorAll('.tools-size')[1] ||
          c === document.querySelector('.tools-size-num')) {
          c.classList.remove('tools-active');
        }

        if (this.classList.contains('tools-blod') && this.classList.contains('tools-active')) {
          if (!document.querySelector('#textarea').contains(document.querySelector("strong"))) {
            document.querySelector('#textarea').appendChild(document.createElement("strong"));
          }
          moveTextInsideStrong();
        } else if (this.classList.contains('tools-blod') && !this.classList.contains('tools-active')) {
          moveTextOutsideStrong();
        }
        if (this.classList.contains('tools-i') && this.classList.contains('tools-active')) {
          if (!document.querySelector('#textarea').contains(document.querySelector("em"))) {
            document.querySelector('#textarea').appendChild(document.createElement("em"));
          }
          moveTextInsideEm();
        } else if (this.classList.contains('tools-i') && !this.classList.contains('tools-active')) {
          moveTextOutsideEm();
        }
      });
      c.addEventListener('mousedown', function (e) {
        e.preventDefault();
      });
      c.addEventListener('mouseenter', function () {
        if (!this.classList.contains('tools-active')) {
          this.classList.toggle('tools-hover');
        }
      });
      c.addEventListener('mouseleave', function () {
        this.classList.remove('tools-hover');
      });
    });
    function moveTextInsideStrong() {
      let selection = window.getSelection();
      if (selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);
        let selectedText = range.toString();
        let startNode = range.startContainer;
        let endNode = range.endContainer;

        let strongElement = document.createElement('strong');
        strongElement.textContent = selectedText;

        // Extract the selected text
        range.deleteContents();
        range.insertNode(strongElement);

        // Re-select the original range
        let newRange = document.createRange();
        if (startNode.nodeType === Node.TEXT_NODE) {
          newRange.setStart(strongElement.firstChild, 0);
          newRange.setEnd(strongElement.firstChild, selectedText.length);
        } else {
          newRange.selectNodeContents(strongElement);
        }

        selection.removeAllRanges();
        selection.addRange(newRange);

        document.querySelector('#textarea').childNodes.forEach(strong => {
          if (strong.innerText === "" || null) {
            strong.remove();
          }
        });
      }
    }
    function moveTextOutsideStrong() {
      let selection = window.getSelection();
      if (selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);

        let selectedText = range.toString();
        let strongElements = document.querySelectorAll('#textarea strong');

        strongElements.forEach(strongElement => {
          let strongRange = document.createRange();
          strongRange.selectNode(strongElement);

          if (
            strongRange.compareBoundaryPoints(Range.START_TO_START, range) <= 0 &&
            strongRange.compareBoundaryPoints(Range.END_TO_END, range) >= 0
          ) {
            let parent = strongElement.parentNode;
            let content = strongElement.innerHTML;

            let startOffset = range.startOffset;
            let endOffset = range.endOffset;

            let beforeContent = content.substring(0, startOffset);
            let selectedContent = content.substring(startOffset, endOffset);
            let afterContent = content.substring(endOffset);

            if (beforeContent !== '') {
              let beforeStrong = document.createElement('strong');
              beforeStrong.innerHTML = beforeContent;
              parent.insertBefore(beforeStrong, strongElement);
            }

            if (selectedContent !== '') {
              let selectedStrong = document.createElement('span');
              selectedStrong.innerHTML = selectedContent;
              parent.insertBefore(selectedStrong, strongElement);
              var spanToRemove = parent.querySelector('span');
              var textNode = document.createTextNode(spanToRemove.textContent);
              var parentElement = spanToRemove.parentElement;
              parentElement.replaceChild(textNode, spanToRemove);
            }

            if (afterContent !== '') {
              strongElement.innerHTML = afterContent;
            } else {
              parent.removeChild(strongElement);
            }

            range.deleteContents();
          } else {
            console.log('Selection includes whole strong element');
          }
        });
      }
    }
    function isStrong() {
      let selection = window.getSelection();
      if (selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);
        let startNode = range.startContainer;
        let endNode = range.endContainer;

        let strongElements = document.querySelectorAll('#textarea strong');

        for (let i = 0; i < strongElements.length; i++) {
          const strongElement = strongElements[i];
          if (strongElement) {
            let isInStrong = strongElement.contains(startNode) && strongElement.contains(endNode);
            if (isInStrong) {
              return true;
            }
          }
        }
      }
      return false;
    }
    function moveTextInsideEm() {
      let selection = window.getSelection();
      if (selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);
        let selectedText = range.toString();
        let startNode = range.startContainer;
        let endNode = range.endContainer;

        let emElement = document.createElement('em');
        emElement.textContent = selectedText;

        // Extract the selected text
        range.deleteContents();
        range.insertNode(emElement);

        // Re-select the original range
        let newRange = document.createRange();
        if (startNode.nodeType === Node.TEXT_NODE) {
          newRange.setStart(emElement.firstChild, 0);
          newRange.setEnd(emElement.firstChild, selectedText.length);
        } else {
          newRange.selectNodeContents(emElement);
        }

        selection.removeAllRanges();
        selection.addRange(newRange);

        document.querySelector('#textarea').childNodes.forEach(em => {
          if (em.innerText === "" || null) {
            em.remove();
          }
        });
      }
    }
    function moveTextOutsideEm() {
      let selection = window.getSelection();
      if (selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);

        let selectedText = range.toString();
        let emElements = document.querySelectorAll('#textarea em');

        emElements.forEach(emElement => {
          let emRange = document.createRange();
          emRange.selectNode(emElement);

          if (
            emRange.compareBoundaryPoints(Range.START_TO_START, range) <= 0 &&
            emRange.compareBoundaryPoints(Range.END_TO_END, range) >= 0
          ) {
            let parent = emElement.parentNode;
            let content = emElement.innerHTML;

            let startOffset = range.startOffset;
            let endOffset = range.endOffset;

            let beforeContent = content.substring(0, startOffset);
            let selectedContent = content.substring(startOffset, endOffset);
            let afterContent = content.substring(endOffset);

            if (beforeContent !== '') {
              let beforeem = document.createElement('em');
              beforeem.innerHTML = beforeContent;
              parent.insertBefore(beforeem, emElement);
            }

            if (selectedContent !== '') {
              let selectedem = document.createElement('span');
              selectedem.innerHTML = selectedContent;
              parent.insertBefore(selectedem, emElement);
              var spanToRemove = parent.querySelector('span');
              var textNode = document.createTextNode(spanToRemove.textContent);
              var parentElement = spanToRemove.parentElement;
              parentElement.replaceChild(textNode, spanToRemove);
            }

            if (afterContent !== '') {
              emElement.innerHTML = afterContent;
            } else {
              parent.removeChild(emElement);
            }

            range.deleteContents();
          } else {
            console.log('Selection includes whole em element');
          }
        });
      }
    }
    function isEm() {
      let selection = window.getSelection();
      if (selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);
        let startNode = range.startContainer;
        let endNode = range.endContainer;

        let emElements = document.querySelectorAll('#textarea em');

        for (let i = 0; i < emElements.length; i++) {
          const emElement = emElements[i];
          if (emElement) {
            let isInem = emElement.contains(startNode) && emElement.contains(endNode);
            if (isInem) {
              return true;
            }
          }
        }
      }
      return false;
    }
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
            <div class="mailto">
                <a href="mailto:bear90789078@gmail.com">
                    Gmail信箱
                </a>
            </div>
        </div>
    </div>
    `
  }
})();

export default main;