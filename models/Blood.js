const db = require('../database');

module.exports = {
    volunteerList: async () => {
        const list = await db('available').join('user', 'available.user_id', '=', 'user.id').where({
            status: "YES"
        }).select('name', 'blood_type', 'status');
        return list;
    },

    addPatient: async (blood_type, rhesus, amount_blood, patient_name, gender, patient_location, donor_location, contact) => {
        await db('patient').insert({
            blood_type: blood_type,
            rhesus: rhesus,
            amount_blood: amount_blood,
            patient_name: patient_name,
            gender: gender,
            latitude: patient_location[0],
            longitude: patient_location[1],
            donor_location: donor_location,
            contact: contact
        });
    }
}