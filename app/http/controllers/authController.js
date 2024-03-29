const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { info } = require('laravel-mix/src/Log');
function authController() {
    const __getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
    }
    return {
        login(req, res) {
            res.render("auth/login");
        },
        postLogin(req, res, next) {
            const { email, password } = req.body;
            // validate request
            if (!email || !password) {
                req.flash('error', 'All fields are required');
                return res.redirect('/login')
            }
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    req.flash('error', info.message)
                    return next(err)
                }
                if (!user) {
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if (err) {
                        req.flash('error', info.message)
                        return next(err)
                    }

                    return res.redirect(__getRedirectUrl(req))
                })
            })(req, res, next)
        },
        register(req, res) {
            res.render("auth/register");
        },
        async postRegister(req, res) {
            const { name, email, password } = req.body;

            // validate request
            if (!name || !email || !password) {
                req.flash('error', 'All fields are required');
                req.flash('name', name);
                req.flash('email', email);
                return res.redirect('/register')
            }

            //check if email exists
            User.exists({ email: email }, (err, result) => {
                // console.log(result)
                if (result) {
                    req.flash('error', 'Email already exists');
                    req.flash('name', name);
                    req.flash('email', email);
                    console.log(req.body)
                    return res.redirect('/')
                }
                // return res.redirect('/register')
            })

            //HASH psssword
            const hashedPassword = await bcrypt.hash(password, 10)
            //create A user

            const user = new User({
                name: name,
                email: email,
                password: hashedPassword
            })

            user.save().then((user) => {
                //login
                return res.redirect('/')
            }).catch(err => {
                req.flash('error', 'Something went wrong');
                return res.redirect('/register')
            })
        },
        logout(req, res) {
            req.logout(function (err) {
                if (err) { return next(err); }
                res.redirect('/login');
            });

        }
    }
}

module.exports = authController;