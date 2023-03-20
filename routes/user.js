const express = require('express');
const router = express.Router();

router.all('/', (req, res) => {
    return res.status(200).json({
        message: "Welcome to the user endpoint of the ecommerce api"
    })
});

router.post('/signup', (req, res) => {
})

module.exports = router;
