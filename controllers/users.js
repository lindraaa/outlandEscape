const User = require("../models/user");
module.exports.renderregister = (req, res) => {
    res.render("users/register")
}
module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username })
        const registerUser = await User.register(user, password)
        //after register it automtatic sign in 
        req.login(registerUser, error => {
            if (error) {
                return next(error)
            }
            console.log(registerUser);
            req.flash("success", `Welcome, ${registerUser.username}! Explore breathtaking destinations and let your next adventure begin!`)
            res.redirect("/campgrounds")
        })
    } catch (error) {
        req.flash("error", error.message)
        res.redirect('/register')
    }

}
module.exports.renderlogin = (req, res) => {
    res.render("users/login")
}

module.exports.login = (req, res) => {
    const name = req.body.username;
    req.flash( "success",`Hello ${name}, Welcome back!`);
    //to redirect in currenct path
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logout Successfully")
        res.redirect("/campgrounds")
    })
}