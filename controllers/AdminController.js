// const User = require('../models/User') ;
const db = require('../database');
const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = {
    viewDashboard: (req, res) => {
        res.render('admin/dashboard/view_dashboard');
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
        const {email, password} = req.body;

        try {
            const user = await User.login(email);

            if(user) {
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
    }
}