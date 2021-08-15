const db = require('../database');

module.exports = {
    getArticle: async () => {
        const list = await db('article').limit(5).select();
        return list;
    }

}