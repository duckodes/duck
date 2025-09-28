const commentsutils = (async () => {
    return {
        init: () => {
            let isMouseDown = false;
            let lastExecution = 0;
            const interval = 100;
            const editor = document.querySelector('#textarea');

            editor.addEventListener("input", () => {
                if (editor.textContent === "" || editor.textContent === null) {
                    editor.innerHTML = "";
                }
            });

            document.querySelector('.tools-size.plus').addEventListener("pointerdown", () => {
                isMouseDown = true;
                function continuousAction(timestamp) {
                    if (isMouseDown) {
                        if (timestamp - lastExecution > interval) {
                            const currentSize = parseInt(document.querySelector('.tools-size-num').innerHTML);
                            if (currentSize <= 71) {
                                changeSelectedTextFontSize((currentSize + 1) + 'px');
                            }
                            lastExecution = timestamp;
                        }
                        requestAnimationFrame(continuousAction);
                    }
                }
                requestAnimationFrame(continuousAction);
            });

            document.querySelector('.tools-size.minus').addEventListener("pointerdown", () => {
                isMouseDown = true;
                function continuousAction(timestamp) {
                    if (isMouseDown) {
                        if (timestamp - lastExecution > interval) {
                            const currentSize = parseInt(document.querySelector('.tools-size-num').innerHTML);
                            if (currentSize > 1) { // 設定最小字體為 1px
                                changeSelectedTextFontSize((currentSize - 1) + 'px');
                            }
                            lastExecution = timestamp;
                        }
                        requestAnimationFrame(continuousAction);
                    }
                }
                requestAnimationFrame(continuousAction);
            });

            document.addEventListener('pointerup', function () {
                isMouseDown = false;
            });

            function getSelectedTextFontSize() {
                let selection = window.getSelection();
                if (selection.rangeCount > 0 && editor.contains(selection.anchorNode)) {
                    let range = selection.getRangeAt(0);
                    let container = range.commonAncestorContainer;

                    if (container.nodeType === Node.TEXT_NODE) {
                        container = container.parentElement;
                    }

                    // 從選區開始處向上查找，直到找到 #textarea 或帶有字體大小的 span
                    while (container && container !== editor && !container.style.fontSize) {
                        container = container.parentElement;
                    }

                    if (container && container !== editor) {
                        return window.getComputedStyle(container).fontSize;
                    }
                }
                // 如果沒有選區或找不到特定樣式，返回編輯器本身的字體大小
                return window.getComputedStyle(editor).fontSize;
            }

            function changeSelectedTextFontSize(newSize) {
                let selection = window.getSelection();
                if (!selection.rangeCount) return;

                let range = selection.getRangeAt(0);
                if (range.collapsed) {
                    return;
                }

                const savedRange = {
                    startContainer: range.startContainer,
                    startOffset: range.startOffset,
                    endContainer: range.endContainer,
                    endOffset: range.endOffset
                };

                document.execCommand('fontSize', false, '1'); // 使用 execCommand 產生 <font> 標籤

                const fontElements = editor.getElementsByTagName('font');
                let firstNewSpan = null;

                while (fontElements.length > 0) {
                    let fontElement = fontElements[0];
                    let span = document.createElement('span');
                    span.style.fontSize = newSize;

                    if (!firstNewSpan) {
                        firstNewSpan = span;
                    }

                    while (fontElement.firstChild) {
                        span.appendChild(fontElement.firstChild);
                    }

                    fontElement.parentNode.replaceChild(span, fontElement);
                }

                normalizeSpans(editor);

                selection.removeAllRanges();
                try {
                    const newRange = document.createRange();
                    newRange.setStart(savedRange.startContainer, savedRange.startOffset);
                    newRange.setEnd(savedRange.endContainer, savedRange.endOffset);
                    selection.addRange(newRange);
                } catch (e) {
                    console.warn("Could not restore original selection. Falling back to selecting the new content.", e);
                    if (firstNewSpan) {
                        const newRange = document.createRange();
                        newRange.selectNodeContents(firstNewSpan);
                        selection.addRange(newRange);
                    }
                }
                // 手動更新字體大小顯示
                document.querySelector('.tools-size-num').innerText = parseInt(newSize);
            }

            function normalizeSpans(parentElement) {
                let spans = parentElement.querySelectorAll('span[style*="font-size"]');
                for (let i = 0; i < spans.length - 1; i++) {
                    let currentSpan = spans[i];
                    let nextSpan = spans[i + 1];

                    if (currentSpan.nextSibling === nextSpan && currentSpan.style.cssText === nextSpan.style.cssText) {
                        currentSpan.innerHTML += nextSpan.innerHTML;
                        nextSpan.remove();
                        normalizeSpans(parentElement); // 重新開始檢查
                        return;
                    }
                }
            }

            function updateToolbarState() {
                // 更新字體大小
                const size = getSelectedTextFontSize();
                if (size && !isNaN(parseInt(size))) {
                    document.querySelector('.tools-size-num').innerText = parseInt(size);
                }

                // 更新粗體按鈕狀態
                if (document.queryCommandState('bold')) {
                    document.querySelector('.tools-blod').classList.add('tools-active');
                } else {
                    document.querySelector('.tools-blod').classList.remove('tools-active');
                }

                // 更新斜體按鈕狀態
                if (document.queryCommandState('italic')) {
                    document.querySelector('.tools-i').classList.add('tools-active');
                } else {
                    document.querySelector('.tools-i').classList.remove('tools-active');
                }
            }

            document.addEventListener("selectionchange", () => {
                // 只有當選區在編輯器內時才更新工具列
                const selection = window.getSelection();
                if (selection.rangeCount > 0 && editor.contains(selection.anchorNode)) {
                    updateToolbarState();
                }
            });

            editor.addEventListener('focus', updateToolbarState);


            document.querySelectorAll('.textarea-tools > *').forEach(c => {
                c.addEventListener('mousedown', function (e) {
                    // 防止點擊工具按鈕時編輯器失去焦點
                    e.preventDefault();
                });

                c.addEventListener('click', function () {
                    if (this.classList.contains('tools-blod')) {
                        document.execCommand('bold');
                    } else if (this.classList.contains('tools-i')) {
                        document.execCommand('italic');
                    }
                    // 點擊後立即更新工具列狀態
                    updateToolbarState();
                });

                c.addEventListener('mouseenter', function () {
                    if (!this.classList.contains('tools-active')) {
                        this.classList.add('tools-hover');
                    }
                });
                c.addEventListener('mouseleave', function () {
                    this.classList.remove('tools-hover');
                });
            });
        }
    }
})();
export default commentsutils;