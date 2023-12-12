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