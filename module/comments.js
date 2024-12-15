import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, onValue, ref, child, get, set, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import fetcher from "./fetcher.js";

const comments = (() => {
    const getKeysArray = () => {
        const keysArray = [];
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.getItem(`ANONYMOUS_USER_DATA_${i}`) !== null) {
                keysArray.push(localStorage.getItem(`ANONYMOUS_USER_DATA_${i}`));
            }
        }
        return keysArray;
    }
    function render(name, comment) {
        const commentsContainer = document.createElement('div');
        commentsContainer.className = 'comments-container';
        const id = document.createElement('div');
        id.className = 'comments-name';
        id.textContent = `@ ${name}`;
        const content = document.createElement('div');
        content.className = 'comments-content';
        content.innerHTML = comment;

        document.querySelector('#comments').appendChild(commentsContainer);
        commentsContainer.appendChild(id);
        commentsContainer.appendChild(content);
        return commentsContainer;
    }
    function renderDeleteButton(database, dataKeys, i, commentsContainer) {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        const button = document.createElement('button');
        button.textContent = '刪除';
        commentsContainer.appendChild(buttonContainer);
        buttonContainer.appendChild(button);
        button.addEventListener('click', () => {
            if (confirm('確定要刪除?')) {
                remove(ref(database, `duckode/comments/public/${dataKeys[i]}`));
            }
        });
    }
    function autoUpdateData(database) {
        const dataRef = ref(database, 'duckode/comments/public');
        onValue(dataRef, (snapshot) => {
            document.querySelector('#comments').innerHTML = "留言版";
            let data = snapshot.val();
            if (data !== null) {
                let dataKeys = Object.keys(data);
                let dataVals = Object.values(data);
                for (let i = 0; i < dataKeys.length; i++) {
                    const keys = dataKeys[i].split('?id=')[1];
                    const name = index.rcasc(dataKeys[i]);
                    const comment = dataVals[i];
                    const commentsContainer = render(name, comment);
                    setTimeout(() => {
                        getKeysArray().includes(dataKeys[i]) && renderDeleteButton(database, dataKeys, i, commentsContainer);
                    }, 0);
                }
            }
        });
    }
    const validate = (name, textarea, errorNameTxt, errorTextareaTxt) => {
        function name_checker(t) {
            errorNameTxt.innerText = t;
            name.classList.add('error');
            name.style.border = "1px solid #d93025";
            name.addEventListener("keyup", () => {
                if (!/^\s+$/.test(name.value)) {
                    name.classList.remove('error');
                    name.style.border = "";
                }
                validate();
            });
        }
        function comment_checker(t) {
            errorTextareaTxt.innerText = t;
            textarea.style.border = "1px solid #d93025";
            textarea.classList.add('error');
            textarea.addEventListener("keyup", () => {
                if (!/^\s+$/.test(textarea.value)) {
                    textarea.classList.remove('error');
                    textarea.style.border = "";
                }
                validate();
            });
        }
        return new Promise((resolve, reject) => {
            if (/^\s+$/.test(textarea.textContent)) {
                comment_checker("comment cannot consist solely of spaces");
            } else if (textarea.textContent.trim() === "") {
                comment_checker("comment cannot be blank");
            }
            if (/^\s+$/.test(name.value)) {
                name_checker("name cannot consist solely of spaces");
            } else if (name.value.includes('?id=')) {
                name_checker('name cannot include "?id="');
            } else if (name.value.trim() === "") {
                name_checker("name cannot be blank");
            }
            if (textarea.textContent.trim() !== "" &&
                !/^\s+$/.test(name.value) &&
                !name.value.includes('?id=') &&
                name.value.trim() !== "") {
                resolve("Inputs are valid");
            }
        });
    }
    function postPublicData(database, name, textarea, errorNameTxt, errorTextareaTxt) {
        const postCount = localStorage.getItem('postCount') === null ? 0 : localStorage.getItem('postCount');
        const hash = dateutils.ToHash();
        const dataRef = ref(database, `duckode/comments/public/${name.value}?id=${hash}`);
        validate(name, textarea, errorNameTxt, errorTextareaTxt).then((message) => {
            set(dataRef, textarea.innerHTML);
            localStorage.setItem(`ANONYMOUS_USER_DATA_${postCount}`, `${name.value}?id=${hash}`);
            localStorage.setItem('postCount', parseInt(postCount) + 1);
            alert(`感謝 ${name.value} 的留言~~😊❤️❤️`);
            name.value = "";
            textarea.textContent = "";
        });
    }
    function postPrivateData(database, name, textarea, errorNameTxt, errorTextareaTxt) {
        const dataRef = ref(database, `duckode/comments/private/${name.value}`);
        validate(name, textarea, errorNameTxt, errorTextareaTxt).then((message) => {
            set(dataRef, textarea.textContent);
            alert(`感謝 ${name.value} 的私信~~😊💕❤️`);
            name.value = "";
            textarea.textContent = "";
        });
    }
    return {
        init: async () => {
            const firebaseConfig = await fetcher.load('../config/firebaseConfig.json');
            const app = initializeApp(firebaseConfig);
            const database = getDatabase();

            const name = document.getElementById('name');
            const textarea = document.getElementById('textarea');
            const comments = document.getElementById("comments");
            const btnStatus = document.getElementById('btn-status');
            const post = document.getElementById('post');
            const reply = document.getElementById('reply');
            const reply_x = document.getElementById('reply-x');
            const showmore = document.getElementById('showmore');
            const errorNameTxt = document.getElementById('error-name-txt');
            const errorTextareaTxt = document.getElementById('error-textarea-txt');

            const statusStruct = {
                public: '公開',
                private: '私信'
            }
            let status = statusStruct.public;

            btnStatus.addEventListener('click', () => {
                if (status === "公開") {
                    status = statusStruct.private;
                    btnStatus.style.color = '#f36f6f';
                } else {
                    status = statusStruct.public;
                    btnStatus.style.color = '';
                }
                btnStatus.textContent = status;
            });
            post.addEventListener('click', () => {
                status === "公開" ?
                    postPublicData(database, name, textarea, errorNameTxt, errorTextareaTxt) :
                    postPrivateData(database, name, textarea, errorNameTxt, errorTextareaTxt);
            });
            autoUpdateData(database);
        }
    }
})();
comments.init();