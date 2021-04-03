const User = require('../models/user-model')

login = async (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Missing data.',
        })
    }

    User.findOne({ username: body.username }, (err, user) => {
        if (err || !user) {
            return res.status(404).json({
                err,
                message: 'User not found!',
            })
        }

        if(user.password == body.password) {
            return res.status(200).json({ success: true, permissions: user.permissions })
        }else{
            return res.status(401).json({ success: false })
        }
    })
}

module.exports = {
    login
}