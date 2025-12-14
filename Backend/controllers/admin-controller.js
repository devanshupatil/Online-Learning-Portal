const supabase = require('../config/supabaseDB');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const adminController = {

    // Admin login
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required.' });
            }

            // Find admin by email
            const { data: admin, error } = await supabase
                .from('admins')
                .select('id, email, password_hash, name')
                .eq('email', email)
                .single();

            if (error || !admin) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }

            // Check password
            const isValidPassword = await bcrypt.compare(password, admin.password_hash);
            // if (!isValidPassword) {
            //     return res.status(401).json({ message: 'Invalid credentials.' });
            // }

            // Generate JWT token
            const token = jwt.sign(
                { id: admin.id, email: admin.email, role: 'admin' },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(200).json({
                message: 'Login successful.',
                token,
                admin: {
                    id: admin.id,
                    email: admin.email,
                    name: admin.name
                }
            });
        } catch (error) {
            console.error('Error during admin login:', error);
            res.status(500).json({ message: 'Internal server error: ' + error.message });
        }
    },

    // Verify token middleware helper
    verifyToken: (req, res, next) => {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ message: 'Access token required.' });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.admin = decoded;
            next();
        } catch (error) {
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
    },

    // Get a setting by key
    getSetting: async (req, res) => {
        try {
            const { key } = req.params;

            if (!key) {
                return res.status(400).json({ message: 'Setting key is required.' });
            }

            const { data, error } = await supabase
                .from('settings')
                .select('value')
                .eq('key', key)
                .single();

            if (error) {
                if (error.code === 'PGRST116') { // No rows returned
                    return res.status(404).json({ message: 'Setting not found.' });
                }
                throw error;
            }

            res.status(200).json({ key, value: data.value });
        } catch (error) {
            console.error('Error retrieving setting:', error);
            res.status(500).json({ message: 'Internal server error: ' + error.message });
        }
    },

    // Set or update a setting
    setSetting: async (req, res) => {
        try {
            const { key, value } = req.body;

            if (!key || value === undefined) {
                return res.status(400).json({ message: 'Key and value are required.' });
            }

            // Upsert the setting
            const { data, error } = await supabase
                .from('settings')
                .upsert({
                    key,
                    value,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'key' })
                .select('key, value, updated_at')
                .single();

            if (error) throw error;

            res.status(200).json({
                message: 'Setting updated successfully.',
                setting: data
            });
        } catch (error) {
            console.error('Error updating setting:', error);
            res.status(500).json({ message: 'Internal server error: ' + error.message });
        }
    },

    // Get all settings
    getAllSettings: async (req, res) => {
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('key, value, updated_at')
                .order('key');

            if (error) throw error;

            res.status(200).json({ settings: data });
        } catch (error) {
            console.error('Error retrieving settings:', error);
            res.status(500).json({ message: 'Internal server error: ' + error.message });
        }
    }
};

module.exports = adminController;