const db = require('../database');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Blood = require('../models/Blood')

module.exports = {
    //NOTE: AUTH register
    registerUser: async (req, res) => {
        const {
            full_name,
            identity,
            gender,
            blood_type,
            phone_number,
            address,
            province,
            city,
            postal_code,
            email,
            password
        } = req.body;

        if (full_name == undefined ||
            identity == undefined ||
            gender == undefined ||
            blood_type == undefined ||
            phone_number == undefined ||
            address == undefined ||
            province == undefined ||
            city == undefined ||
            postal_code == undefined ||
            email == undefined ||
            password == undefined) {
            return res.status(404).json({
                message: "Lengkapi semua field"
            });
        }

        try {
            const checkUser = await db('user').first("*").where({
                email: email
            });

            if (checkUser) {
                return res.status(404).json({
                    message: "Email yang sama telah terdaftar, silahkan coba email lainnya!"
                });
            } else {
                await User.registerApi(full_name, identity, gender.toUpperCase(), blood_type.toUpperCase(), phone_number, address, province, postal_code, city, email, password)

                const getIdAfterRegistered = await db('user').first().where({
                    email: email
                }).select('id');
                await db('available').insert({
                    user_id: getIdAfterRegistered.id,
                    status: "no".toUpperCase()
                });

                res.status(201).json({
                    message: "Akun Anda berhasil ter-registrasi!",
                    data: {
                        name: full_name,
                        identity: identity,
                        gender: gender.toLowerCase(),
                        blood_type: blood_type.toUpperCase(),
                        phone_number: phone_number,
                        address: address,
                        province: province,
                        city: city,
                        postal_code: postal_code,
                        email: email,
                        available: "no".toUpperCase()
                    }
                })
            }

        } catch (err) {
            console.log("ERROR for Register API: ", err)
            res.status(500).json({
                message: "Terjadi kesalahan, silahkan kontak admin Donorun!"
            });
        }

    },

    // NOTE: AUTH login
    loginUser: async (req, res) => {
        const {
            email,
            password
        } = req.body;
        // console.log(req.body);

        if (email == undefined ||
            password == undefined) {
            return res.status(404).json({
                message: "Lengkapi semua field!"
            });
        }

        try {
            const user = await User.login(email);

            if (user) {
                const validPass = await bcrypt.compare(password, user.password);
                if (validPass) {
                    const getStatusAvailable = (await db('available').first().where({
                        user_id: user.id
                    }).select('status')).status;

                    res.status(200).json({
                        message: "Berhasil login!",
                        data: {
                            name: user.name,
                            identity: user.identity,
                            phone_number: user.phone_number,
                            address: user.address,
                            province: user.province,
                            city: user.city,
                            postal_code: user.postal_code,
                            email: user.email,
                            available: getStatusAvailable
                        }
                    })
                } else {
                    return res.status(401).json({
                        message: "Password Anda tidak sesuai!"
                    });
                }
            } else {
                return res.status(404).json({
                    message: "Email Anda tidak terdaftar silahkan daftar terlebih dahulu!"
                });
            }
        } catch (e) {
            console.log("ERROR for Login API: ", e)
            res.status(500).json({
                message: "Terjadi kesalahan, silahkan kontak admin Donorun!"
            });
        }
    },

    // NOTE: volunteer list
    volunteerList: async (req, res) => {
        // select * from `user` inner join `available` on `user`.`id` = `available`.`user_id` WHERE `available`.`status` = 'YES'
        const allVolunteerList = await Blood.volunteerList();

        // console.log(allVolunteerList);

        res.status(200).json({
            message: "Berhasil mengambil data!",
            data: allVolunteerList
        });
    },

    // NOTE: patient add
    addPatient: async (req, res) => {
        const {
            blood_type,
            rhesus,
            amount_blood,
            patient_name,
            gender,
            patient_location,
            donor_location,
            contact
        } = req.body;

        if (blood_type == undefined ||
            rhesus == undefined ||
            amount_blood == undefined ||
            patient_name == undefined ||
            gender == undefined ||
            patient_location == undefined ||
            donor_location == undefined ||
            contact == undefined) {
            return res.status(404).json({
                message: "Lengkapi semua field"
            });
        }

        try {
            await Blood.addPatient(blood_type.toUpperCase(), rhesus.toLowerCase(), amount_blood, patient_name, gender.toLowerCase(), patient_location, donor_location, contact);
            // FIXME: location and rhesus
            // https://maps.google.com/?q=<lat>,<lng>
            res.status(201).json({
                message: "Pasien baru telah terdaftar!",
                data: {
                    blood_type: blood_type.toUpperCase(),
                    rhesus: rhesus.toLowerCase(),
                    amount_blood: amount_blood,
                    patient_name: patient_name,
                    gender: gender.toLowerCase(),
                    patient_location: patient_location,
                    donor_location: donor_location,
                    contact: contact,
                }
            })
        } catch (error) {
            console.log("ERROR for ADD PATIENT API: ", err)
            res.status(500).json({
                message: "Terjadi kesalahan, silahkan kontak admin Donorun!"
            });
        }
    }

}