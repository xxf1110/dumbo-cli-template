module.exports = {
    'GET /user': {name: 'eova'},
    'POST /login/account': (req, res) => {
        const { password, username } = req.body
        if (password === '888888' && username === 'admin') {
            return res.send({
                status: 'ok',
                code: 0,
                token: 'sdfsdfsdfdsf',
                data: { id: 1, name: 'eova' }
            })
        } else {
            return res.send({ status: 'error', code: 403 })
        }
    }
} 