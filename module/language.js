import fetcher from "./fetcher.js";

const language = (() => {
    let data = null;

    async function cache(lang) {
        data ||= await fetcher.load(`../lan/${lang}.json`).catch(() => fetcher.load(`../lan/zh-TW.json`));
        return data;
    }

    return {
        cache,
        clear: () => data = null
    }
})();

export default language;