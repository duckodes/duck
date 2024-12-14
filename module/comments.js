import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, child, get, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import fetcher from "./fetcher.js";

const comments = (() => {
    return {
        init: async () => {
            window.addEventListener('scroll', sie);
            async function sie() {
                let init = false;
                let maxpost = 2;

                if (scrollviewutils.sie("#comments") && !init) {
                    // Your web app's Firebase configuration
                    const firebaseConfig = await fetcher.load('../config/firebaseConfig.json');

                    // Initialize Firebase
                    const app = initializeApp(firebaseConfig);

                    const database = getDatabase();

                    let name = document.getElementById("name");
                    let comment = document.getElementById("comment");
                    let comments = document.getElementById("comments");
                    let btn_status = document.getElementById("btn-status");
                    let post = document.getElementById("post");
                    let reply = document.getElementById("reply");
                    let reply_x = document.getElementById("reply-x");
                    let showmore = document.getElementById("showmore");

                    const status = {
                        private: 0,
                        public: 1,
                        reply: 2
                    };
                    let postatus = status.private;
                    let posting = false;
                    let postsize = 0;

                    clickutils.click(post, 0, () => {
                        POST_STATUSWITCH();
                    });
                    showmore.addEventListener("click", () => {
                        if (maxpost < postsize) {
                            maxpost += 2;
                            comments.innerHTML = "";
                            G_POST();
                        }
                        if (maxpost >= postsize) {
                            maxpost = postsize;
                            showmore.style.display = "none";
                        }
                    });
                    btn_status.addEventListener("click", (e) => {
                        contextmenuutils.init(btn_status.parentElement, (b, c) => {
                            c.style.paddingTop = "5px";
                            c.style.paddingBottom = "5px";
                            ToMouse(c)
                        });
                        contextmenuutils.addItem("選擇留言方式", (c) => {});
                        contextmenuutils.addItem("private", (c) => {
                            defaultset(c, status.private);
                        });
                        contextmenuutils.addItem("public", (c) => {
                            defaultset(c, status.public);
                        });
                        function defaultset(c, s) {
                            c.addEventListener("click", () => {
                                reply_x.click();
                                postatus = s;
                                BTN_STATUSWITCH();
                                contextmenuutils.remove();
                            });
                            c.addEventListener("mouseenter", () => {
                                c.style.background = "#202020";
                            });
                            c.addEventListener("mouseleave", () => {
                                c.style.background = "";
                            });
                        }
                        function ToMouse(c) {
                            c.style.left = (e.clientX) + "px";
                            c.style.top = (e.clientY) + "px";
                        }
                    });
                    function POST_STATUSWITCH() {
                        switch (postatus) {
                            case 0:
                                POST('duckode/comments/private/' + name.value + "?id=" + dateutils.ToHash());
                                break;
                            case 1:
                                POST('duckode/comments/public/' + name.value + "?id=" + dateutils.ToHash());
                                break;
                            default:
                                break;
                        }
                    }
                    function BTN_STATUSWITCH() {
                        switch (postatus) {
                            case 0:
                                btn_status.textContent = "private";
                                btn_status.removeAttribute("style");
                                break;
                            case 1:
                                btn_status.textContent = "public";
                                btn_status.style.color = "rgb(0, 224, 138)";
                                break;
                            case 2:
                                btn_status.textContent = "reply";
                                btn_status.style.color = "#96C8C8";
                                break;
                            default:
                                break;
                        }
                    }

                    function POST(path) {
                        validate()
                            .then((message) => {
                                if (!posting) {
                                    set(ref(database, path), {
                                        comment: comment.innerHTML,
                                    })
                                        .then(() => {
                                            alert("Post Successed");
                                            posting = false;
                                            comments.innerHTML = "";

                                            G_POST();
                                            name.value = "";
                                            comment.innerHTML = "";
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        })
                                    posting = true;
                                }
                            })
                    }
                    function REPLY_POST(e) {
                        validate()
                            .then((message) => {
                                if (!posting) {
                                    set(ref(database, 'duckode/comments/public/' + e.key + '/' + name.value + "?id=" + dateutils.ToHash()), {
                                        comment: comment.innerHTML,
                                    })
                                        .then(() => {
                                            alert("Post Successed");
                                            posting = false;
                                            comments.innerHTML = "";

                                            G_POST();
                                            name.value = "";
                                            comment.innerHTML = "";
                                            reply_x.click();
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        })
                                    posting = true;
                                }
                            })
                    }
                    function validate() {
                        function name_checker(t) {
                            document.getElementById("error-name-txt").innerText = t;
                            name.classList.add('error');
                            name.addEventListener("keyup", () => {
                                if (!/^\s+$/.test(name.value)) {
                                    name.classList.remove('error');
                                }
                                validate();
                            });
                        }
                        function comment_checker(t) {
                            document.getElementById("error-comment-txt").innerText = t;
                            comment.style.border = "1px solid #d93025";
                            comment.classList.add('error');
                            comment.addEventListener("keyup", () => {
                                if (!/^\s+$/.test(comment.value)) {
                                    comment.classList.remove('error');
                                    comment.style.border = "";
                                }
                                validate();
                            });
                        }
                        return new Promise((resolve, reject) => {
                            if (/^\s+$/.test(comment.textContent)) {
                                comment_checker("comment cannot consist solely of spaces");
                            } else if (comment.textContent.trim() === "") {
                                comment_checker("comment cannot be blank");
                            }
                            if (/^\s+$/.test(name.value)) {
                                name_checker("name cannot consist solely of spaces");
                            } else if (name.value.includes('?id=')) {
                                name_checker('name cannot include "?id="');
                            } else if (name.value.trim() === "") {
                                name_checker("name cannot be blank");
                            }
                            if (comment.textContent.trim() !== "" &&
                                !/^\s+$/.test(name.value) &&
                                !name.value.includes('?id=') &&
                                name.value.trim() !== "") {
                                resolve("Inputs are valid");
                            }
                        });
                    }
                    G_POST();
                    function G_POST() {
                        let countpost = 0;
                        const dbref = ref(database);
                        get(child(dbref, 'duckode/comments/public/'))
                            .then((cmts) => {
                                if (cmts.exists()) {
                                    postsize = cmts.size;
                                    cmts.forEach(e => {
                                        countpost++;
                                        if (countpost > maxpost) {
                                            return;
                                        } else if (maxpost < postsize) {
                                            showmore.style.display = "";
                                        }
                                        get(child(dbref, 'duckode/comments/public/' + e.key))
                                            .then((cmts) => {
                                                if (cmts.exists()) {
                                                    cmts.forEach(c => {

                                                        if (!c.key.includes('?id=')) {
                                                            const container = document.createElement('div');
                                                            container.id = e.key;
                                                            comments.appendChild(container);

                                                            const h1 = document.createElement('h1');
                                                            h1.innerText = index.rcasc(e.key);
                                                            h1.style.textShadow = "5px 5px 10px rgba(0, 0, 0, 0.5)";
                                                            container.appendChild(h1);

                                                            const h3 = document.createElement('div');
                                                            h3.innerHTML = c.val();
                                                            container.appendChild(h3);

                                                            const btn = document.createElement('button');
                                                            btn.innerHTML = "Reply";
                                                            btn.style.fontFamily = "Poiret_One";
                                                            btn.style.fontWeight = "900";
                                                            btn.addEventListener("click", () => {

                                                                let restatus = postatus;
                                                                postatus = status.reply;
                                                                BTN_STATUSWITCH();

                                                                comment.focus();

                                                                const navBtns = document.querySelectorAll('.navbtn');
                                                                const lastNavBtn = navBtns[navBtns.length - 1];
                                                                if (lastNavBtn) {
                                                                    lastNavBtn.click();
                                                                }

                                                                comment.setAttribute('data-content', '𝙍𝙀𝙋𝙇𝙔 ＠ ″ ' +
                                                                    index.rcasc(e.key).replace(/a/g, '𝙖').replace(/A/g, '𝘼').replace(/b/g, '𝙗').replace(/B/g, '𝘽').replace(/c/g, '𝙘').replace(/C/g, '𝘾').replace(/d/g, '𝙙').replace(/D/g, '𝘿').replace(/e/g, '𝙚').replace(/E/g, '𝙀').replace(/f/g, '𝙛').replace(/F/g, '𝙁').replace(/g/g, '𝙜').replace(/G/g, '𝙂').replace(/h/g, '𝙝').replace(/H/g, '𝙃').replace(/i/g, '𝙞').replace(/I/g, '𝙄').replace(/j/g, '𝙟').replace(/J/g, '𝙅').replace(/k/g, '𝙠').replace(/K/g, '𝙆').replace(/l/g, '𝙡').replace(/L/g, '𝙇').replace(/m/g, '𝙢').replace(/M/g, '𝙈').replace(/n/g, '𝙣').replace(/N/g, '𝙉').replace(/o/g, '𝙤').replace(/O/g, '𝙊').replace(/p/g, '𝙥').replace(/P/g, '𝙋').replace(/q/g, '𝙦').replace(/Q/g, '𝙌').replace(/r/g, '𝙧').replace(/R/g, '𝙍').replace(/s/g, '𝙨').replace(/S/g, '𝙎').replace(/t/g, '𝙩').replace(/T/g, '𝙏').replace(/u/g, '𝙪').replace(/U/g, '𝙐').replace(/v/g, '𝙫').replace(/V/g, '𝙑').replace(/w/g, '𝙬').replace(/W/g, '𝙒').replace(/x/g, '𝙭').replace(/X/g, '𝙓').replace(/y/g, '𝙮').replace(/Y/g, '𝙔').replace(/z/g, '𝙯').replace(/Z/g, '𝙕').replace(/0/g, '０').replace(/1/g, '１').replace(/2/g, '２').replace(/3/g, '３').replace(/4/g, '４').replace(/5/g, '５').replace(/6/g, '６').replace(/7/g, '７').replace(/8/g, '８').replace(/9/g, '９') +
                                                                    ' ″ ➠ ' + c.val().replace(/a/g, '𝙖').replace(/A/g, '𝘼').replace(/b/g, '𝙗').replace(/B/g, '𝘽').replace(/c/g, '𝙘').replace(/C/g, '𝘾').replace(/d/g, '𝙙').replace(/D/g, '𝘿').replace(/e/g, '𝙚').replace(/E/g, '𝙀').replace(/f/g, '𝙛').replace(/F/g, '𝙁').replace(/g/g, '𝙜').replace(/G/g, '𝙂').replace(/h/g, '𝙝').replace(/H/g, '𝙃').replace(/i/g, '𝙞').replace(/I/g, '𝙄').replace(/j/g, '𝙟').replace(/J/g, '𝙅').replace(/k/g, '𝙠').replace(/K/g, '𝙆').replace(/l/g, '𝙡').replace(/L/g, '𝙇').replace(/m/g, '𝙢').replace(/M/g, '𝙈').replace(/n/g, '𝙣').replace(/N/g, '𝙉').replace(/o/g, '𝙤').replace(/O/g, '𝙊').replace(/p/g, '𝙥').replace(/P/g, '𝙋').replace(/q/g, '𝙦').replace(/Q/g, '𝙌').replace(/r/g, '𝙧').replace(/R/g, '𝙍').replace(/s/g, '𝙨').replace(/S/g, '𝙎').replace(/t/g, '𝙩').replace(/T/g, '𝙏').replace(/u/g, '𝙪').replace(/U/g, '𝙐').replace(/v/g, '𝙫').replace(/V/g, '𝙑').replace(/w/g, '𝙬').replace(/W/g, '𝙒').replace(/x/g, '𝙭').replace(/X/g, '𝙓').replace(/y/g, '𝙮').replace(/Y/g, '𝙔').replace(/z/g, '𝙯').replace(/Z/g, '𝙕').replace(/0/g, '０').replace(/1/g, '１').replace(/2/g, '２').replace(/3/g, '３').replace(/4/g, '４').replace(/5/g, '５').replace(/6/g, '６').replace(/7/g, '７').replace(/8/g, '８').replace(/9/g, '９'));
                                                                post.style.display = "none";


                                                                reply.style.display = "";
                                                                clickutils.nClick(reply, 0).then(() => {
                                                                    REPLY_POST(e);
                                                                });
                                                                reply_x.style.display = "";
                                                                reply_x.addEventListener("click", () => {
                                                                    postatus = restatus;
                                                                    BTN_STATUSWITCH();

                                                                    post.style.display = "";
                                                                    reply.style.display = "none";
                                                                    reply_x.style.display = "none";
                                                                    comment.setAttribute('data-content', "comments..");
                                                                });
                                                            });
                                                            container.appendChild(btn);
                                                            const clpsebtn = document.createElement('button');
                                                            clpsebtn.id = "clpse";
                                                            clpsebtn.innerHTML = "&#9652;";
                                                            clpsebtn.style.display = "none";
                                                            clpsebtn.addEventListener("click", () => {
                                                                if (clpsebtn.innerHTML !== "▴") {
                                                                    clpsebtn.innerHTML = "&#9652;";
                                                                    clpsebtn.parentElement.querySelectorAll('.replys').forEach(re => {
                                                                        re.style.display = "none";
                                                                    });
                                                                } else {
                                                                    clpsebtn.innerHTML = "&#9662;";
                                                                    clpsebtn.parentElement.querySelectorAll('.replys').forEach(re => {
                                                                        re.removeAttribute('style');
                                                                    });
                                                                }
                                                            });
                                                            container.appendChild(clpsebtn);
                                                        } else {
                                                            get(child(dbref, 'duckode/comments/public/' + e.key + "/" + c.key))
                                                                .then((cmts) => {
                                                                    if (cmts.exists()) {
                                                                        cmts.forEach(r => {
                                                                            if (document.getElementById(e.key)) {
                                                                                const ccontainer = document.createElement('div');
                                                                                ccontainer.className = "replys";
                                                                                ccontainer.style.display = "none";
                                                                                document.getElementById(e.key).appendChild(ccontainer);

                                                                                const h3 = document.createElement('h3');
                                                                                h3.innerText = index.rcasc(c.key);
                                                                                ccontainer.appendChild(h3);

                                                                                const div = document.createElement('div');
                                                                                div.innerHTML = r.val();
                                                                                ccontainer.appendChild(div);
                                                                            }
                                                                        });
                                                                    }
                                                                })
                                                        }
                                                        setTimeout(() => {
                                                            prekey();
                                                        }, 500);
                                                        function prekey() {
                                                            if (document.getElementById(e.key)) {
                                                                document.getElementById(e.key).removeAttribute('id');
                                                            }
                                                            comments.childNodes.forEach(element => {
                                                                if (!element.contains(element.querySelector('.replys'))) {
                                                                    element.childNodes.forEach(e => {
                                                                        if (e.id === "clpse") {
                                                                            e.remove();
                                                                        }
                                                                    });
                                                                } else {
                                                                    element.childNodes.forEach(e => {
                                                                        if (e.id === "clpse") {
                                                                            e.style.display = "";
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            })
                                    });
                                } else {
                                    const h6 = document.createElement('h3');
                                    h6.innerText = "none comments";
                                    h6.style.opacity = "0.5";
                                    comments.appendChild(h6);
                                    showmore.style.display = "none";
                                }
                            })
                    }
                    init = true;
                    window.removeEventListener('scroll', sie);
                }
            }
        }
    }
})();
comments.init();