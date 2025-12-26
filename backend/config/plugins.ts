export default ({ env }) => {
  // Först försök använda CLOUDINARY_URL (Cloudinarys rekommenderade format)
  // Format: cloudinary://api_key:api_secret@cloud_name
  const cloudinaryUrl = env('CLOUDINARY_URL')?.trim();
  
  if (cloudinaryUrl) {
    try {
      // Parse CLOUDINARY_URL format: cloudinary://api_key:api_secret@cloud_name
      const match = cloudinaryUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
      if (match) {
        const [, apiKey, apiSecret, cloudName] = match;
        
        if (cloudName && apiKey && apiSecret) {
          console.log('Använder CLOUDINARY_URL för konfiguration');
          return {
            upload: {
              config: {
                provider: 'cloudinary',
                providerOptions: {
                  cloud_name: cloudName,
                  api_key: apiKey,
                  api_secret: apiSecret,
                },
                actionOptions: {
                  upload: {},
                  uploadStream: {},
                  delete: {},
                },
                breakpoints: false,
              },
            },
          };
        }
      }
    } catch (error) {
      console.error('Fel vid parsing av CLOUDINARY_URL:', error);
    }
  }

  // Fallback till separata environment variables
  const cloudinaryName = env('CLOUDINARY_NAME')?.trim();
  const cloudinaryKey = env('CLOUDINARY_KEY')?.trim();
  const cloudinarySecret = env('CLOUDINARY_SECRET')?.trim();

  // Verifiera att alla credentials finns
  if (!cloudinaryName || !cloudinaryKey || !cloudinarySecret) {
    console.error('Cloudinary credentials saknas! Kontrollera environment variables.');
    console.error('CLOUDINARY_URL:', cloudinaryUrl ? 'OK' : 'SAKNAS');
    console.error('CLOUDINARY_NAME:', cloudinaryName ? 'OK' : 'SAKNAS');
    console.error('CLOUDINARY_KEY:', cloudinaryKey ? 'OK' : 'SAKNAS');
    console.error('CLOUDINARY_SECRET:', cloudinarySecret ? 'OK' : 'SAKNAS');
  }

  return {
    upload: {
      config: {
        provider: 'cloudinary',
        providerOptions: {
          cloud_name: cloudinaryName,
          api_key: cloudinaryKey,
          api_secret: cloudinarySecret,
        },
        actionOptions: {
          upload: {},
          uploadStream: {},
          delete: {},
        },
        breakpoints: false, // Inaktiverar sharp-resizing för att undvika konflikter
      },
    },
  };
};
