index = (function () {
  let active = true;
  function status() {
    return active;
  }
  return {
    init: init,
    status: status,
    pID: pID,
    rcasc: rcasc
  };
  function init() {
    window.addEventListener('resize', function () {
      const navHeight = document.querySelector('.nav').offsetHeight;
      document.querySelector('.home').style.marginTop = (navHeight + 30) + 'px';
    });

    document.addEventListener("selectionchange", () => {
      if (!isStrong()) {
        document.querySelector('.tools-blod').classList.remove('tools-active');
      } else {
        document.querySelector('.tools-blod').classList.add('tools-active');
      }
    });

    document.querySelectorAll('.comment-tools > *').forEach(c => {
      c.addEventListener('click', function () {
        document.querySelectorAll('.comment-tools > *').forEach(otherc => {
          if (otherc !== this) {
            //otherc.classList.remove('tools-active');
          }
        });
        this.classList.remove('tools-hover');
        this.classList.toggle('tools-active');
        if (this.classList.contains('tools-blod') && this.classList.contains('tools-active')) {
          if (!document.querySelector('#comment').contains(document.querySelector("strong"))) {
            document.querySelector('#comment').appendChild(document.createElement("strong"));
          }
          moveTextInsideStrong();
        } else if (this.classList.contains('tools-blod') && !this.classList.contains('tools-active')) {
          moveTextOutsideStrong();
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

        document.querySelector('#comment').childNodes.forEach(strong => {
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
        let strongElement = document.querySelector('#comment strong');

        let strongRange = document.createRange();
        strongRange.selectNode(strongElement);

        if (strongRange.compareBoundaryPoints(Range.START_TO_START, range) <= 0 && strongRange.compareBoundaryPoints(Range.END_TO_END, range) >= 0) {
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
            var spanToRemove = document.getElementById('comment').querySelector('span');
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
      }
    }
    function isStrong() {
      let selection = window.getSelection();
      if (selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);
        let startNode = range.startContainer;
        let endNode = range.endContainer;

        let strongElements = document.querySelectorAll('#comment strong');

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
    const pbtn = document.getElementById("btn-status");
    pbtn.addEventListener("click", () => {
      if (!active) {
        pbtn.textContent = "private";
        pbtn.removeAttribute("style");
        active = true;
      } else {
        pbtn.textContent = "public";
        pbtn.style.color = "rgb(0, 224, 138)";
        active = false;
      }
    });
  }
  function pID() {
    const now = new Date();
    const uniqueCode = `${now.getFullYear()}${now.getMonth()}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}${now.getMilliseconds()}${Math.random() * 10000}`;
    const hashedCode = btoa(uniqueCode).replace(/=/g, '');
    return hashedCode;
  }
  function rcasc(is) {
    const index = is.indexOf("?id=");
    if (index !== -1) {
      return is.substring(0, index);
    }
    return is;
  }
}());
index.init();