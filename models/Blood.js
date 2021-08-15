const db = require('../database');

module.exports = {
    volunteerList: async () => {
        const list = await db('available').join('user', 'available.user_id', '=', 'user.id').where({
            status: "YES"
        }).select('name', 'blood_type', 'status');
        return list;
    },

    addPatient: async (user_id, blood_type, rhesus, patient_name, gender) => {
        await db('patient').insert({
            user_id: user_id,
            blood_type: blood_type,
            rhesus: rhesus,
            patient_name: patient_name,
            gender: gender,

        });
    },

    needBlood: async (patient_id, amount_blood, patient_location, donor_location, contact) => {
        await db('blood').insert({
            patient_id: patient_id,
            amount_blood: amount_blood,
            latitude: patient_location[0],
            longitude: patient_location[1],
            donor_location: donor_location,
            contact: contact
        });
    },

    getDataGiver: async () => {
        const listGiver = await db('available').join('user', 'available.user_id', '=', 'user.id').where({
            status: "YES"
        }).select('user.id', 'name', 'identity', 'phone_number', 'address', 'city', 'postal_code', 'blood_type', 'gender', 'status', 'rhesus');
        return listGiver;
    }
}