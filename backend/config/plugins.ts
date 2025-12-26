export default ({ env }) => {
  // Parse CLOUDINARY_URL format: cloudinary://api_key:api_secret@cloud_name
  const cloudinaryUrl = env('CLOUDINARY_URL')?.trim();
  
  if (!cloudinaryUrl) {
    throw new Error('CLOUDINARY_URL environment variable is required');
  }

  const match = cloudinaryUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (!match) {
    throw new Error('Invalid CLOUDINARY_URL format. Expected: cloudinary://api_key:api_secret@cloud_name');
  }

  const [, apiKey, apiSecret, cloudName] = match;

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
};
