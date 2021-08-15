// const User = require('../models/User') ;
const db = require('../database');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Blood = require('../models/Blood');
const bcrypt = require('bcrypt');
const {
    v1: uuidv1
} = require('uuid');

module.exports = {
    // NOTE: AUTHENTICATION
    viewLogin: (req, res) => {
        console.log(uuidv1());
        res.render('admin/auth/login');
    },

    registerAdmin: async (req, res) => {
        const {
            name,
            email,
            password
        } = req.body;

        if (name == undefined ||
            email == undefined ||
            password == undefined) {
            return res.status(400).json({
                message: "Lengkapi semua field"
            });
        }

        try {
            const checkAdmin = await db('admin').first("*").where({
                email: email
            });

            if (checkAdmin) {
                return res.status(403).json({
                    message: "Email yang sama telah terdaftar, silahkan coba email lainnya!"
                });
            } else {
                await Admin.register(name, email, password);

                res.status(201).json({
                    message: "Akun admin Anda berhasil ter-registrasi!",
                    data: {
                        name: name,
                        email: email
                    }
                })
            }

        } catch (err) {
            console.log("ERROR for Register ADMIN API: ", err)
            res.status(500).json({
                message: "Terjadi kesalahan, silahkan kontak developer Donorun!"
            });
        }
    },

    loginAdmin: async (req, res) => {
        const {
            email,
            password
        } = req.body;

        try {
            const admin = await Admin.login(email);

            if (admin) {
                const validPass = await bcrypt.compare(password, admin.password);
                if (validPass) {
                    res.redirect('/admin/dashboard');
                } else {
                    res.redirect('/admin');
                }
            } else {
                res.send('admin not found');
            }
        } catch (e) {
            console.log(e);
            res.send('Kesalahan Sistem, kontak developer donorun');
        }
    },

    // NOTE: DASHBOARD
    viewDashboard: (req, res) => {
        res.render('admin/dashboard/view_dashboard', {
            title: "Dashboard"
        });
    },

    viewAuthUser: (req, res) => {
        res.render('admin/auth_user/register_user');
    },

    registerUser: async (req, res) => {
        const {
            firstName,
            lastName,
            identity,
            phoneNumber,
            address,
            province,
            postalCode,
            city,
            email,
            password
        } = req.body;
        // console.log(firstName + lastName);

        if (firstName && lastName && identity && phoneNumber && address && province && postalCode && city && email && password) {
            try {
                await User.register(firstName, lastName, identity, phoneNumber, address, province, postalCode, city, email, password);
            } catch (error) {
                console.log(error);
            }
            res.redirect('/admin/auth-user')
        }
    },

    loginUser: async (req, res) => {
        const {
            email,
            password
        } = req.body;

        try {
            const user = await User.login(email);

            if (user) {
                const validPass = await bcrypt.compare(password, user.password);
                if (validPass) {
                    res.redirect('/admin/auth-user');
                } else {
                    res.send('password salah');
                }
            } else {
                res.send('user not found');
            }
        } catch (e) {
            console.log(e);
            res.send('gagal')
        }
    },

    // NOTE: USER
    viewUser: (req, res) => {
        res.render('admin/user/view_user', {
            title: "User"
        });
    },

    // NOTE: POST
    viewArticle: (req, res) => {
        res.render('admin/article/view_article', {
            title: "Posting"
        });
    },

    // NOTE: BLOOD
    viewBlood: async (req, res) => {
        const giver = await Blood.getDataGiver();
        res.render('admin/blood/view_blood', {
            title: "Darah",
            giver: giver
        });
    },

    // NOTE: HISTORY
    viewHistory: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {
                message: alertMessage,
                status: alertStatus
            };

            const logHistory = await Admin.getHistoryLog();

            res.render('admin/history/view_history', {
                alert: alert,
                title: "History Log",
                logHistory: logHistory
            });
        } catch (error) {
            console.log(error);
        }
    },
    addNewDonor: async (req, res) => {
        const {
            email,
            location,
            date
        } = req.body;

        if (email && location && date) {
            try {
                await Admin.addNewDonor(email, location, date);
                req.flash('alertMessage', "Data donor baru telah ditambahkan!");
                req.flash('alertStatus', 'success');
                res.redirect('/admin/history-page');
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log("GAGAL");
        }
    },

    verify: async (req, res) => {
        const { historyId } = req.body;
        try {
            await Admin.verify(historyId);
            res.redirect('/admin/history-page');
        } catch (error) {
            console.log(error);
        }
    }
}