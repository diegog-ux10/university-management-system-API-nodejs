const jwt = require('jsonwebtoken');

exports.generateToken = (req, res) => {
    const user = req.user;

    const token = jwt.sign(
        { id: user.id, username: user.username },  
        process.env.JWT_SECRET,                    
        { expiresIn: '1h' }                        
    );

    res.json({ token });
};
