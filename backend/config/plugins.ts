export default ({ env }) => {
  // Trimma whitespace från environment variables för att undvika problem
  const cloudinaryName = env('CLOUDINARY_NAME')?.trim();
  const cloudinaryKey = env('CLOUDINARY_KEY')?.trim();
  const cloudinarySecret = env('CLOUDINARY_SECRET')?.trim();

  // Verifiera att alla credentials finns
  if (!cloudinaryName || !cloudinaryKey || !cloudinarySecret) {
    console.error('Cloudinary credentials saknas! Kontrollera environment variables.');
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
