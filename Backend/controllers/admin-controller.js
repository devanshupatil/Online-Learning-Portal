const supabase = require('../config/supabaseDB');

const adminController = {
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