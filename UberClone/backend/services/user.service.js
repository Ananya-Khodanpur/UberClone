const userModel = require('../models/user.model');

module.exports.createUsers = async ({ firstname, lastname, email, password }) => {
    if (!firstname || !email || !password) {
        throw new Error('All fields are required');
    }
    
    try {
        const user = new userModel({ 
            fullname: { 
                firstname: firstname, 
                lastname: lastname || '' 
            }, 
            email, 
            password 
        });
        
        const savedUser = await user.save();
        console.log('User saved to database:', savedUser._id);
        
        return savedUser;
        
    } catch (error) {
        console.error('Service error creating user:', error.message);
        // Don't wrap the error, just throw it directly
        throw error;
    }
}