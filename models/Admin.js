const db = require('../database');
const bcrypt = require('bcrypt');

module.exports = {
    register: async (name, email, password) => {
        // var sqlQuery = ;
        // db.query(`INSERT INTO user (name, identity, phone_number, address, province, city, postal_code, email, password) VALUES ('${firstName} ${lastName}', '${identity}'  , '${phoneNumber}', '${address}', '${province}', '${city}', '${postalCode}', '${email}', '${password}')`);

        const hash = await bcrypt.hash(password, 10);
        // console.log(hash);
        await db('admin').insert({
            name: name,
            email: email,
            password: hash
        });
    },

    login: async (email) => {
        const admin = await db('admin').first("*").where({
            email: email
        });
        return admin;
    },

    getHistoryLog: async () => {
        const logHistory = await db('history_log').join('user', 'history_log.user_id', '=', 'user.id')
            .select('history_log.id', 'name', 'history_log.donor_date', 'user.uuid', 'history_log.location', 'history_log.status');
        return logHistory;
    },

    addNewDonor: async (email, location, date) => {
        const id = (await db('user')
            .where({
                email: email
            })
            .select('id'))[0].id;
        await db('history_log').insert({
            user_id: id,
            location: location,
            status: "NO",
            donor_date: date
        })
    },

    verify: async (historyId) => {
        await db('history_log')
            .where({
                id: historyId
            })
            .update({
                status: "YES"
            });
    }

}