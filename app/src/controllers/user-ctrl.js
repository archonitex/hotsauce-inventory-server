const User = require('../models/user-model')
const https = require('https')

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

contactRequest = async (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success:false,
            error: 'Missing data.'
        })
    }

    console.log(body)
    console.log(Buffer.byteLength(JSON.stringify(body)))
  
    const options = {
        hostname: 'maker.ifttt.com',
        port: 443,
        path: '/trigger/volamtar_request/with/key/-UepuVqrKX0TOvsRPx0mJ',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(body))
        }
    }
      
    const ifttreq = https.request(options, ifttres => {
            console.log(`statusCode: ${ifttres.statusCode}`)
            ifttres.on('data', d => {
            process.stdout.write(d)
        })
    })
      
    ifttreq.on('error', error => {
        console.error(error)
    })
      
    ifttreq.write(JSON.stringify(body))
    ifttreq.end()

    return res.status(200).json({ success: true })
}

module.exports = {
    login,
    contactRequest
}