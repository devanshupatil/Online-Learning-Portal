// const { Storage } = require('@google-cloud/storage');
const supabase = require('../config/supabaseDB')
const { createClient } = require('@supabase/supabase-js');
const { get } = require('../routes/teachers-routes');
const OpenAI = require('openai');
const fs = require('fs');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
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
      const filePath = `${category}/${course}/${file.originalname}`;

      // Upload to Supabase storage bucket 'study-materials'
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('study-materials')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Insert metadata into the study_materials table
      const { data: insertData, error: insertError } = await supabase
        .from('study_materials')
        .insert({
          teacher_id: teacherId,
          category,
          course,
          file_name: filePath,
          file_size: file.size,
          mime_type: file.mimetype
        })
        .select('id')
        .single();

      if (insertError) throw insertError;

      // Generate public URL from bucket
      const { data: publicUrlData } = supabase.storage
        .from('study-materials')
        .getPublicUrl(filePath);

      return { id: insertData.id, url: publicUrlData.publicUrl };
    });

    const results = await Promise.all(uploadPromises);
    return { success: true, files: results };
  },

  UploadTestsMaterial: async (course, files, teacherId) => {
    const uploadPromises = files.map(async (file) => {
      const filePath = `${course}/${file.originalname}`;

      // Upload to Supabase storage bucket 'tests-materials'
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('tests-materials')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Check if file already exists in database, update or insert
      const { data: existingFile } = await supabase
        .from('tests_materials')
        .select('id')
        .eq('file_name', filePath)
        .single();

      let insertData;
      if (existingFile) {
        // Update existing record
        const { data, error: updateError } = await supabase
          .from('tests_materials')
          .update({
            file_size: file.size,
            mime_type: file.mimetype
          })
          .eq('id', existingFile.id)
          .select('id')
          .single();
        if (updateError) throw updateError;
        insertData = data;
      } else {
        // Insert new record
        const { data, error: insertError } = await supabase
          .from('tests_materials')
          .insert({
            teacher_id: teacherId,
            course,
            file_name: filePath,
            file_size: file.size,
            mime_type: file.mimetype
          })
          .select('id')
          .single();
        if (insertError) throw insertError;
        insertData = data;
      }

      // Generate public URL from bucket
      const { data: publicUrlData } = supabase.storage
        .from('tests-materials')
        .getPublicUrl(filePath);

      return { id: insertData.id, url: publicUrlData.publicUrl };
    });

    const results = await Promise.all(uploadPromises);
    return { success: true, files: results };
  },

  getTestsMaterials: async (teacherId) => {
    const { data, error } = await supabase
      .from('tests_materials')
      .select('id, teacher_id, course, file_name, file_size, mime_type, uploaded_at')
      .eq('teacher_id', teacherId)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;

    // Generate public URLs from bucket
    return data.map(material => {
      const { data: publicUrlData } = supabase.storage
      .from('tests-materials')
      .getPublicUrl(`${material.course}/${material.file_name.split('/').pop()}`);

      return {
        id: material.id,
        name: material.file_name,
        url: publicUrlData.publicUrl,
        course: material.course,
        size: material.file_size,
        mime_type: material.mime_type,
        uploaded_at: material.uploaded_at
      };
    });
  },

  deleteTestsMaterials: async (fileName) => {
    // Delete from storage bucket
    const { data: storageData, error: storageError } = await supabase.storage
      .from('tests-materials')
      .remove([fileName]);

    if (storageError) {
      console.error('Error deleting from storage:', storageError);
      throw storageError;
    }

    // Delete from database table
    const { data: dbData, error: dbError } = await supabase
      .from('tests_materials')
      .delete()
      .eq('file_name', fileName);

    if (dbError) {
      console.error('Error deleting from database:', dbError);
      throw dbError;
    }

    return { storageData, dbData };
  },

  updateTestMaterial: async (id, file_name, newCourse) => {
    // Fetch the current record to get the old file name
    const { data: currentData, error: fetchError } = await supabase
      .from('tests_materials')
      .select('file_name')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching current test material:', fetchError);
      throw fetchError;
    }

    const oldFileName = currentData.file_name;

    // Move the file in Supabase storage from old path to new path
    const { error: moveError } = await supabase.storage
      .from('tests-materials')
      .move(oldFileName, file_name);

    if (moveError) {
      console.error('Error moving file in storage:', moveError);
      throw moveError;
    }

    // Update the database record with new course and file_name
    const { data, error } = await supabase
      .from('tests_materials')
      .update({ course: newCourse, file_name: file_name })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating test material:', error);
      throw error;
    }

    return data;
  },

  getAllStudyMaterials: async (teacherId) => {
    const { data, error } = await supabase
      .from('study_materials')
      .select('id, teacher_id, category, course, file_name, file_size, mime_type, uploaded_at')
      .eq('teacher_id', teacherId)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;

    // Generate public URLs from bucket
    return data.map(material => {
      const { data: publicUrlData } = supabase.storage
        .from('study-materials')
        .getPublicUrl(material.file_name);

      return {
        id: material.id,
        name: material.file_name,
        url: publicUrlData.publicUrl,
        category: material.category,
        course: material.course,
        size: material.file_size,
        mime_type: material.mime_type,
        uploaded_at: material.uploaded_at
      };
    });
  },

  deleteStudyMaterial: async (fileName) => {
    // Delete from storage bucket
    const { data: storageData, error: storageError } = await supabase.storage
      .from('study-materials')
      .remove([fileName]);

    if (storageError) {
      console.error('Error deleting from storage:', storageError);
      throw storageError;
    }

    // Delete from database table
    const { data: dbData, error: dbError } = await supabase
      .from('study_materials')
      .delete()
      .eq('file_name', fileName);

    if (dbError) {
      console.error('Error deleting from database:', dbError);
      throw dbError;
    }

    return { storageData, dbData };
  },

  getAllstudentInfo: async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  },

  getAttendanceByDateAndClass: async (date, className) => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('date', date)
        .eq('class', className);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in getAttendanceByDateAndClass:', error);
      throw error;
    }
  },

  saveAttendance: async (attendanceData) => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .insert(attendanceData);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in saveAttendance:', error);
      throw error;
    }
  },

  getAttendanceRecords: async (teacherId, startDate, endDate) => {
    try {
      let query = supabase
        .from('attendance')
        .select('*')
        .eq('teacher_id', teacherId);

      if (startDate) {
        query = query.gte('date', startDate);
      }
      if (endDate) {
        query = query.lte('date', endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in getAttendanceRecords:', error);
      throw error;
    }
  },


  analyzeImage: async (imageURL) => {


    // const { data, error } = await supabase
    //   .from('tests_materials')
    //   .select('*')
    //   .eq('id', imageId)
    //   .single();

    //   console.log("Image Data:", data);

    // if (error || !data) {

    //   console.error('Error fetching image data:', error);
    //   throw new Error('Image not found');
    // }

    // const imageBuffer = Buffer.from(data.image_data, 'base64');
    // const mimeType = data.mime_type;
    // const base64Image = imageBuffer.toString('base64');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analyze this image and provide a detailed description in JSON format. Include key elements, objects, text if any, and overall context.' },
            { type: 'image_url', image_url: { url: imageURL } }
            // { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Image}` } }
          ]
        }
      ],
      max_tokens: 500
    });

    return response.choices[0].message.content;
  },
}

module.exports = teacher;





