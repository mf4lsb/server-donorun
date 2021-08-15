const db = require('../database');
const bcrypt = require('bcrypt');
const { v1: uuidv1 } = require('uuid');

module.exports = {
    register: async (firstName, lastName, identity, phoneNumber, address, province, postalCode, city, email, password) => {
        // var sqlQuery = ;
        // db.query(`INSERT INTO user (name, identity, phone_number, address, province, city, postal_code, email, password) VALUES ('${firstName} ${lastName}', '${identity}'  , '${phoneNumber}', '${address}', '${province}', '${city}', '${postalCode}', '${email}', '${password}')`);

        const hash = await bcrypt.hash(password, 10);
        // console.log(hash);
        await db('user').insert({
            name: firstName + " " + lastName,
            identity: identity,
            phone_number: phoneNumber,
            address: address,
            province: province,
            city: city,
            postal_code: postalCode,
            email: email,
            password: hash
        });
    },

    login: async (email) => {
        const user = await db('user').first("*").where({
            email: email
        });
        return user;
    },

    // REGISTER API USER
    registerApi: async (full_name, identity, gender, blood_type, phone_number, address, province, postal_code, city, email, password) => {

        const hash = await bcrypt.hash(password, 10);
        await db('user').insert({
            name: full_name,
            identity: identity,
            phone_number: phone_number,
            gender: gender,
            blood_type: blood_type,
            address: address,
            province: province,
            city: city,
            postal_code: postal_code,
            email: email,
            uuid: uuidv1(),
            password: hash
        });
    }


}