import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, onValue, ref, set, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import fetcher from "./fetcher.js";
import language from "./language.js";

const comments = (() => {
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
    function renderDeleteButton(database, dataKeys, i, commentsContainer, localUserData) {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        const button = document.createElement('button');
        button.textContent = '刪除';
        commentsContainer.appendChild(buttonContainer);
        buttonContainer.appendChild(button);
        button.addEventListener('click', () => {
            if (confirm('確定要刪除?')) {
                remove(ref(database, `duckode/comments/public/${dataKeys[i]}`));
                let index = localUserData.indexOf(dataKeys[i]);
                if (index !== -1) {
                    localUserData.splice(index, 1);
                }
                localStorage.setItem('ANONYMOUS_USER_DATA', JSON.stringify(localUserData));
                JSON.parse(localStorage.getItem('ANONYMOUS_USER_DATA')).length === 0 && localStorage.removeItem('ANONYMOUS_USER_DATA');
            }
        });
    }
    async function autoUpdateData(database) {
        const languageData = await language.cache(document.documentElement.lang);
        const dataRef = ref(database, 'duckode/comments/public');
        const getFrontSection = (hash) => {
            const index = hash.indexOf("?id=");
            if (index !== -1) {
                return hash.substring(0, index);
            }
            return hash;
        }
        onValue(dataRef, (snapshot) => {
            document.querySelector('#comments').innerHTML = languageData.comments;
            let data = snapshot.val();
            if (data !== null) {
                let dataKeys = Object.keys(data);
                let dataVals = Object.values(data);
                for (let i = 0; i < dataKeys.length; i++) {
                    const keys = dataKeys[i].split('?id=')[1];
                    const name = getFrontSection(dataKeys[i]);
                    const comment = dataVals[i];
                    const commentsContainer = render(name, comment);
                    setTimeout(() => {
                        let localUserData = JSON.parse(localStorage.getItem('ANONYMOUS_USER_DATA')) || [];
                        localUserData.includes(dataKeys[i]) && renderDeleteButton(database, dataKeys, i, commentsContainer, localUserData);
                    }, 200);
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
                validate(name, textarea, errorNameTxt, errorTextareaTxt);
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
                validate(name, textarea, errorNameTxt, errorTextareaTxt);
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
        let localUserData = JSON.parse(localStorage.getItem('ANONYMOUS_USER_DATA')) || [];
        const hash = dateutils.ToHash();
        const dataRef = ref(database, `duckode/comments/public/${name.value}?id=${hash}`);
        validate(name, textarea, errorNameTxt, errorTextareaTxt).then((message) => {
            if (!confirm('確定要送出?'))
                return;
            set(dataRef, textarea.innerHTML);
            localUserData.push(`${name.value}?id=${hash}`);
            localStorage.setItem('ANONYMOUS_USER_DATA', JSON.stringify(localUserData));
            alert(`感謝 ${name.value} 的留言~~😊❤️❤️`);
            name.value = "";
            textarea.textContent = "";
        });
    }
    function postPrivateData(database, name, textarea, errorNameTxt, errorTextareaTxt) {
        const dataRef = ref(database, `duckode/comments/private/${name.value}`);
        validate(name, textarea, errorNameTxt, errorTextareaTxt).then((message) => {
            if (!confirm('確定要送出?'))
                return;
            set(dataRef, textarea.textContent);
            alert(`感謝 ${name.value} 的私信~~😊💕❤️`);
            name.value = "";
            textarea.textContent = "";
        });
    }
    return {
        init: async (languageData) => {
            const firebaseConfig = await fetcher.load('../config/firebaseConfig.json');
            const app = initializeApp(firebaseConfig);
            const database = getDatabase();

            const name = document.getElementById('name');
            const textarea = document.getElementById('textarea');
            const btnStatus = document.getElementById('btn-status');
            const post = document.getElementById('post');
            const errorNameTxt = document.getElementById('error-name-txt');
            const errorTextareaTxt = document.getElementById('error-textarea-txt');

            const statusStruct = {
                public: languageData.contact.public,
                private: languageData.contact.private
            }
            let status = statusStruct.public;

            btnStatus.addEventListener('click', () => {
                if (status === statusStruct.public) {
                    status = statusStruct.private;
                    btnStatus.style.color = '#f36f6f';
                } else {
                    status = statusStruct.public;
                    btnStatus.style.color = '';
                }
                btnStatus.textContent = status;
            });
            post.addEventListener('click', () => {
                status === statusStruct.public ?
                    postPublicData(database, name, textarea, errorNameTxt, errorTextareaTxt) :
                    postPrivateData(database, name, textarea, errorNameTxt, errorTextareaTxt);
            });
            autoUpdateData(database);
        }
    }
})();
export default comments;