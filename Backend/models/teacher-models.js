const { Storage } = require('@google-cloud/storage');

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: process.env.KEYFILENAME,
});

const bucketName = process.env.BUCKET_NAME;
const bucket = storage.bucket(bucketName);


// Main function to handle study material upload
const UploadStudyMaterial = async (category, course, files, teacherId) => {
  try {
    // Validate input
    if (!category || !course || !teacherId) {
      throw new Error('Category, course, and teacherId are required.');
    }

    if (!files || !Array.isArray(files) || files.length === 0) {
      throw new Error('Files are required and must be an array.');
    }

    // Upload each file to GCS with course and category organization
    const uploadPromises = files.map(async (file) => {
      if (!file.originalname) {
        console.warn('Skipping invalid file:', file);
        throw new Error('Invalid file: missing originalname');
      }

      // Create destination path: category/course/filename
      const destination = `${category}/${course}/${file.originalname}`;

      // Upload options
      const options = {
        destination: destination,
        metadata: {
          contentType: file.mimetype,
        },
      };

      // Upload the file
      const [fileUpload] = await bucket.upload(file.path || file.buffer, options);

      return fileUpload;
    });

    const uploadResults = await Promise.all(uploadPromises);

    // Check if all uploads were successful
    if (!uploadResults || uploadResults.length === 0) {
      throw new Error('No files were uploaded successfully');
    }


    console.log(`Successfully uploaded files for teacher ${teacherId}`);
    return { success: true };

  } catch (error) {
    console.error('Error in UploadStudyMaterial:', error);
    throw error;
  }
};

const getStudyMaterials = async (category, course) => {
  try {
    // If category or course is null, fetch all files
    const prefix = (category && course) ? `${category}/${course}/` : '';

    // List files in the specified category/course folder or all files
    const [files] = await bucket.getFiles({ prefix });

    if (!files || files.length === 0) {
      return []; // No files found
    }

    // Generate signed URLs for each file (valid for 1 hour) and include creation date
    const urlPromises = files.map(async (file) => {
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000, // 1 hour
      });
      return {
        name: file.name,
        url: url,
        createdDate: file.metadata.timeCreated,
        size: file.metadata.size
      };
    });

    const materials = await Promise.all(urlPromises);
    return materials;

  } catch (error) {
    console.error('Error in getStudyMaterials:', error);
    throw error;
  }
};

const deleteStudyMaterial = async (fileName) => {
  try {
    if (!fileName) {
      throw new Error('File name is required for deletion.');
    }

    const file = bucket.file(fileName);
    const [exists] = await file.exists();
    if (!exists) {
      throw new Error(`File ${fileName} does not exist.`);
    }

    await storage.bucket(bucketName).file(fileName).delete();

    console.log(`gs://${bucketName}/${fileName} deleted.`);
    console.log(`File ${fileName} deleted successfully.`);
    return true;

  } catch (error) {
    console.error('Error in deleteStudyMaterial:', error);
    throw error;
  }
};





module.exports = {
  UploadStudyMaterial,
  getStudyMaterials,
  deleteStudyMaterial,
  
};
