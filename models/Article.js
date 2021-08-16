const db = require('../database');

module.exports = {
    getArticle: async () => {
        const list = await db('article').limit(5).select('title', 'image', 'body', 'created_at');
        const array = [];
        list.forEach((item) => {
            array.push({
                "body": item.body.replace(/\r\n\r\n/g, "<br>")
            })
        });
        return array;
    },

    insertArticle: async (title, image, body) => {
        await db('article').insert({
            title: title,
            image: `images/${image}`,
            body: body.trim()
        });
    }

}