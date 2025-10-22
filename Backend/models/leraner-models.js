// const { Storage } = require('@google-cloud/storage');
// const fs = require('fs');

// const getStudyMaterials = async (learnerId) => {

//     try {
       

//         if (!learnerId) {
//             throw new Error('learnerId is required.');
//         }

//         // Check if key file exists
//         if (!fs.existsSync(process.env.KEYFILENAME)) {
//             throw new Error(`Service account key file not found at ${process.env.KEYFILENAME}`);
//         }

       
//         const storage = new Storage({
//             projectId: process.env.PROJECT_ID,
//             keyFilename: process.env.KEYFILENAME,
//         });

//         const bucketName = process.env.BUCKET_NAME;
//         const bucket = storage.bucket(bucketName);

        
//         const [files] = await bucket.getFiles();

        
//         const fileList = files.map(file => ({
//             name: file.name,
//             url: `https://storage.googleapis.com/${bucketName}/${file.name}`,
//             size: file.metadata.size,
//             created: file.metadata.timeCreated
//         }));

        
//         return fileList;
//     } catch (error) {
//         console.error('Error in getStudyMaterials:', error.message);
//         console.error('Full error:', error);
//         throw error;
//     }
// }

// module.exports = {
//     getStudyMaterials
// };

// const supabase = require('../config/database')

// const supabase = {};

// module.exports =  supabase;