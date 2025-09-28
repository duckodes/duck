const commentsutils = (async () => {
    return {
        deprecatedInit: () => {
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
        },
        init: () => {
            let isMouseDown = false;
            let lastExecution = 0;
            const interval = 100;
            const editor = document.querySelector('#textarea');

            editor.addEventListener("input", () => {
                if (editor.textContent.trim() === "") {
                    editor.innerHTML = "";
                }
            });

            document.querySelector('.tools-size.plus').addEventListener("pointerdown", () => {
                isMouseDown = true;
                function continuousAction(timestamp) {
                    if (isMouseDown && timestamp - lastExecution > interval) {
                        const currentSize = parseInt(document.querySelector('.tools-size-num').innerHTML);
                        if (currentSize <= 71) {
                            changeSelectedTextFontSize((currentSize + 1) + 'px');
                        }
                        lastExecution = timestamp;
                    }
                    if (isMouseDown) requestAnimationFrame(continuousAction);
                }
                requestAnimationFrame(continuousAction);
            });

            document.querySelector('.tools-size.minus').addEventListener("pointerdown", () => {
                isMouseDown = true;
                function continuousAction(timestamp) {
                    if (isMouseDown && timestamp - lastExecution > interval) {
                        const currentSize = parseInt(document.querySelector('.tools-size-num').innerHTML);
                        if (currentSize > 1) {
                            changeSelectedTextFontSize((currentSize - 1) + 'px');
                        }
                        lastExecution = timestamp;
                    }
                    if (isMouseDown) requestAnimationFrame(continuousAction);
                }
                requestAnimationFrame(continuousAction);
            });

            document.addEventListener('pointerup', () => {
                isMouseDown = false;
            });

            function getSelectedTextFontSize() {
                const selection = window.getSelection();
                if (selection.rangeCount > 0 && editor.contains(selection.anchorNode)) {
                    let container = selection.getRangeAt(0).commonAncestorContainer;
                    if (container.nodeType === Node.TEXT_NODE) container = container.parentElement;
                    while (container && container !== editor && !container.style.fontSize) {
                        container = container.parentElement;
                    }
                    if (container && container !== editor) {
                        return window.getComputedStyle(container).fontSize;
                    }
                }
                return window.getComputedStyle(editor).fontSize;
            }

            function changeSelectedTextFontSize(newSize) {
                const selection = window.getSelection();
                if (!selection.rangeCount || selection.isCollapsed) return;

                const range = selection.getRangeAt(0);
                const span = document.createElement('span');
                span.style.fontSize = newSize;
                span.appendChild(range.extractContents());
                range.insertNode(span);
                selection.removeAllRanges();
                const newRange = document.createRange();
                newRange.selectNodeContents(span);
                selection.addRange(newRange);
                normalizeSpans(editor);
                document.querySelector('.tools-size-num').innerText = parseInt(newSize);
            }

            function toggleStyle(styleType) {
                const selection = window.getSelection();
                if (!selection.rangeCount || selection.isCollapsed) return;

                const range = selection.getRangeAt(0);
                const container = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
                    ? range.commonAncestorContainer.parentElement
                    : range.commonAncestorContainer;

                const tag = styleType === 'bold' ? 'strong' : 'em';
                const isActive = container.closest(tag);

                if (isActive) {
                    const parent = isActive.parentNode;
                    while (isActive.firstChild) {
                        parent.insertBefore(isActive.firstChild, isActive);
                    }
                    parent.removeChild(isActive);
                } else {
                    const wrapper = document.createElement(tag);
                    wrapper.appendChild(range.extractContents());
                    range.insertNode(wrapper);
                    selection.removeAllRanges();
                    const newRange = document.createRange();
                    newRange.selectNodeContents(wrapper);
                    selection.addRange(newRange);
                }
                updateToolbarState();
            }

            function normalizeSpans(parentElement) {
                const spans = parentElement.querySelectorAll('span[style*="font-size"]');
                for (let i = 0; i < spans.length - 1; i++) {
                    const current = spans[i];
                    const next = spans[i + 1];
                    if (current.nextSibling === next && current.style.cssText === next.style.cssText) {
                        current.innerHTML += next.innerHTML;
                        next.remove();
                        normalizeSpans(parentElement);
                        return;
                    }
                }
            }

            function updateToolbarState() {
                const size = getSelectedTextFontSize();
                if (size && !isNaN(parseInt(size))) {
                    document.querySelector('.tools-size-num').innerText = parseInt(size);
                }

                const selection = window.getSelection();
                if (!selection.rangeCount || selection.isCollapsed) return;

                const container = selection.getRangeAt(0).commonAncestorContainer;
                const parent = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;

                const isBold = !!parent.closest('strong');
                const isItalic = !!parent.closest('em');

                document.querySelector('.tools-blod').classList.toggle('tools-active', isBold);
                document.querySelector('.tools-i').classList.toggle('tools-active', isItalic);
            }

            document.addEventListener("selectionchange", () => {
                const selection = window.getSelection();
                if (selection.rangeCount > 0 && editor.contains(selection.anchorNode)) {
                    updateToolbarState();
                }
            });

            editor.addEventListener('focus', updateToolbarState);

            document.querySelectorAll('.textarea-tools > *').forEach(c => {
                c.addEventListener('mousedown', e => e.preventDefault());

                c.addEventListener('click', function () {
                    if (this.classList.contains('tools-blod')) {
                        toggleStyle('bold');
                    } else if (this.classList.contains('tools-i')) {
                        toggleStyle('italic');
                    }
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