const index = (function () {
  init();
  return {
    rcasc: rcasc,
    gcard: gcard
  };
  function init() {
    document.querySelector("#textarea").setAttribute('data-content', 'comments..');

    homeprefix();
    window.addEventListener('resize', homeprefix);
    function homeprefix() {
      const navHeight = document.querySelector('.nav').offsetHeight;
      document.querySelector('.home').style.paddingTop = (navHeight + 325) + 'px';
      document.querySelector('.home').style.paddingBottom = (navHeight + 300) + 'px';
      document.querySelector('.card').style.paddingTop = (navHeight + 150) + 'px';
    }

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
  function rcasc(hash) {
    const index = hash.indexOf("?id=");
    if (index !== -1) {
      return hash.substring(0, index);
    }
    return hash;
  }
  function gcard(t, i, l) {
    const cardarea = document.querySelector('.card-area');
    const cardbase = document.createElement('div');
    cardbase.className = "card-base";
    cardarea.appendChild(cardbase);
    if (t.trim() !== '') {
      const span = document.createElement('span');
      span.textContent = t;
      cardbase.appendChild(span);
    }
    checkImageSrc(i)
      .then((isValid) => {
        if (isValid) {
          const img = document.createElement('img');
          cardbase.appendChild(img);
          img.setAttribute("src", i);
          img.setAttribute("alt", "");
          img.setAttribute("draggable", "false");
        } else if (!isValid && t.trim() === '') {
          cardbase.remove();
        }
        const basebtn = document.createElement('div');
        basebtn.className = "card-btn-base";
        cardbase.appendChild(basebtn);
        const btn = document.createElement('button');
        btn.className = 'card-btn';
        btn.textContent = "Read More";
        basebtn.appendChild(btn);
      });
    function checkImageSrc(src) {
      return new Promise((resolve) => {
        var img = new Image();
        img.onload = function () {
          resolve(true);
        };
        img.onerror = function () {
          resolve(false);
        };
        img.src = src;
      });
    }
    if (l !== null && l !== undefined && l.trim() !== '') {
      clickutils.click(cardbase, 0, () => {
        const a = document.createElement('a')
        a.href = l;
        a.click();
      });
    }
  }
}());

export default index;