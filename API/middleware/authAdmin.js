const Users = require('../models/userModel');

const authAdmin = async (req, res, next) => {
    try {
        const user = await Users.findById(req.user._id);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        if (user.role !== 'admin') {
            return res.status(403).send({ error: 'Access denied. Admins only.' });
        }

        next();
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = authAdmin;
