// const { Storage } = require('@google-cloud/storage');
const supabase = require('../config/supabaseDB')
const { createClient } = require('@supabase/supabase-js');
const { get } = require('../routes/teachers-routes');
// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Initialize Google Cloud Storage
// const storage = new Storage({
//   projectId: process.env.PROJECT_ID,
//   keyFilename: process.env.KEYFILENAME,
// });

// const bucketName = process.env.BUCKET_NAME;
// const bucket = storage.bucket(bucketName);


// // Main function to handle study material upload
// const UploadStudyMaterial = async (category, course, files, teacherId) => {
//   try {
//     // Validate input
//     if (!category || !course || !teacherId) {
//       throw new Error('Category, course, and teacherId are required.');
//     }

//     if (!files || !Array.isArray(files) || files.length === 0) {
//       throw new Error('Files are required and must be an array.');
//     }

//     // Upload each file to GCS with course and category organization
//     const uploadPromises = files.map(async (file) => {
//       if (!file.originalname) {
//         console.warn('Skipping invalid file:', file);
//         throw new Error('Invalid file: missing originalname');
//       }

//       // Create destination path: category/course/filename
//       const destination = `${category}/${course}/${file.originalname}`;

//       // Upload options
//       const options = {
//         destination: destination,
//         metadata: {
//           contentType: file.mimetype,
//         },
//       };

//       // Upload the file
//       const [fileUpload] = await bucket.upload(file.path || file.buffer, options);

//       return fileUpload;
//     });

//     const uploadResults = await Promise.all(uploadPromises);

//     // Check if all uploads were successful
//     if (!uploadResults || uploadResults.length === 0) {
//       throw new Error('No files were uploaded successfully');
//     }


//     console.log(`Successfully uploaded files for teacher ${teacherId}`);
//     return { success: true };

//   } catch (error) {
//     console.error('Error in UploadStudyMaterial:', error);
//     throw error;
//   }
// };

// const getStudyMaterials = async (category, course) => {
//   try {
//     // If category or course is null, fetch all files
//     const prefix = (category && course) ? `${category}/${course}/` : '';

//     // List files in the specified category/course folder or all files
//     const [files] = await bucket.getFiles({ prefix });

//     if (!files || files.length === 0) {
//       return []; // No files found
//     }

//     // Generate signed URLs for each file (valid for 1 hour) and include creation date
//     const urlPromises = files.map(async (file) => {
//       const [url] = await file.getSignedUrl({
//         action: 'read',
//         expires: Date.now() + 60 * 60 * 1000, // 1 hour
//       });
//       return {
//         name: file.name,
//         url: url,
//         createdDate: file.metadata.timeCreated,
//         size: file.metadata.size
//       };
//     });

//     const materials = await Promise.all(urlPromises);
//     return materials;

//   } catch (error) {
//     console.error('Error in getStudyMaterials:', error);
//     throw error;
//   }
// };

// const deleteStudyMaterial = async (fileName) => {
//   try {
//     if (!fileName) {
//       throw new Error('File name is required for deletion.');
//     }

//     const file = bucket.file(fileName);
//     const [exists] = await file.exists();
//     if (!exists) {
//       throw new Error(`File ${fileName} does not exist.`);
//     }

//     await storage.bucket(bucketName).file(fileName).delete();

//     console.log(`gs://${bucketName}/${fileName} deleted.`);
//     console.log(`File ${fileName} deleted successfully.`);
//     return true;

//   } catch (error) {
//     console.error('Error in deleteStudyMaterial:', error);
//     throw error;
//   }
// };


// module.exports = {
//   UploadStudyMaterial,
//   getStudyMaterials,
//   deleteStudyMaterial, 

// };

const teacher = {

  getAllStudentsCount: async () => {

    const { count, error } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error fetching student count:', error);
      throw error;
    }

    // console.log(count);  // Logs the total count (e.g., 150)
    return count;  // Returns the total number of students
  },

  getAllUploadedMaterialscount: async (teacherId) => {
    const { count, error } = await supabase
      .from('study_materials')
      .select('*', { count: 'exact', head: true })
      .eq('teacher_id', teacherId);

    if (error) {
      console.error('Error fetching uploaded materials count:', error);
      throw error;
    }

    return count;
  },

  UploadStudyMaterial: async (category, course, files, teacherId) => {
    const uploadPromises = files.map(async (file) => {
      // Insert binary data directly into the study_materials table
      const { data, error } = await supabase
        .from('study_materials')
        .insert({
          teacher_id: teacherId,
          category,
          course,
          file_name: `${category}/${course}/${file.originalname}`,
          file_data: file.buffer,  // Use file.buffer for binary data from memory storage
          file_size: file.size,
          mime_type: file.mimetype
        })
        .select('id')  // Get the inserted row ID for URL generation
        .single();

      if (error) throw error;

      // Generate a "public URL" pointing to your API endpoint
      const fileUrl = `${process.env.BACKEND__LOCALHOST_URL || 'http://localhost:3000'}/api/getFile/${data.id}`;

      return { id: data.id, url: fileUrl };
    });

    const results = await Promise.all(uploadPromises);
    return { success: true, files: results };
  },


  // getAllStudyMaterials: async (teacherId) => {
  //   // Query the study_materials table for the teacher's files
  //   const { data, error } = await supabase
  //     .from('study_materials')
  //     .select('*')
  //     .eq('teacher_id', teacherId)
  //     .order('uploaded_at', { ascending: false });  // Most recent first

  //   if (error) {
  //     console.error('Error fetching study materials:', error);
  //     throw error;
  //   }

  //   // Return the metadata (including URLs)
  //   return data.map(material => ({
  //     id: material.id,
  //     name: material.file_name,
  //     url: material.file_url,
  //     category: material.category,
  //     course: material.course,
  //     size: material.file_size,
  //     mime_type: material.mime_type,
  //     uploaded_at: material.uploaded_at
  //   }));
  // },

  getAllStudyMaterials: async (teacherId) => {
    const { data, error } = await supabase
      .from('study_materials')
      .select('id, teacher_id, category, course, file_name, file_size, mime_type, uploaded_at')
      .eq('teacher_id', teacherId)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;

    // Generate URLs pointing to the API endpoint
    const backendUrl = process.env.BACKEND__LOCALHOST_URL || 'http://localhost:3000';
    return data.map(material => ({
      id: material.id,
      name: material.file_name,
      url: `${backendUrl}/api/getFile/${material.id}`,  // API URL for viewing/downloading
      category: material.category,
      course: material.course,
      size: material.file_size,
      mime_type: material.mime_type,
      uploaded_at: material.uploaded_at
    }));
  },


  deleteStudyMaterial: async (fileName) => {
    const { data, error } = await supabase.storage
      .from('study-materials')
      .remove([fileName]);

    if (error) {
      console.error('Error deleting study material:', error);
      throw error;
    }

    return data;
  },
}

module.exports = teacher;





