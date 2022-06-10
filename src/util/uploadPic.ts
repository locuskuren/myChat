import axios from 'axios';

export const uploadPicture = async (img: File) => {
  try {
    const getBase64 = (img: File) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
      });
    };

    const image = await getBase64(img);

    const {
      data: { url },
    } = await axios.post<{ url: string }>(
      'https://api.cloudinary.com/v1_1/locuskuren/image/upload',
      {
        file: image,
        upload_preset: 'nokeyup',
        cloud_name: 'locuskuren',
      }
    );

    return url;
  } catch (err: any) {
    return 'error';
  }
};
