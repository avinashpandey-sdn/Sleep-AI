import api from './api';
import CryptoJS from 'react-native-crypto-js';
import DeviceInfo from 'react-native-device-info';
import { clampRGBA } from 'react-native-reanimated/lib/typescript/Colors';
const fetchDeviceUUID = async () => {
  try {
    const uniqueId = await DeviceInfo.getUniqueId();
    return uniqueId;
  } catch (error) {
    console.error('Error fetching UUID:', error);
  }
};
const SECRET_KEY = 'cU9Do/i3blD8HPLtXnAVxlI6W4hu7BGwUuqx7rqeD6c=';
const checkEncryption = false;
const encryptData = data => {
  const stringifiedData = JSON.stringify(data);
  return CryptoJS.AES.encrypt(stringifiedData, SECRET_KEY).toString();
};

const decryptData = encryptedData => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);


  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
// Helper functions for API requests
export const getRequest = async (url, params = {}) => {
  console.log('url <><<>><><', url);
  console.log('params <><<>><><', params);
  console.log('await encryptData(data) <><<>><><', {
    encryptData: await encryptData(params),
  });
  try {
    const response = await api.get(url, {
      parencryptData: await encryptData(params),
    });

    return await decryptData(response?.data?.encryptData);
  } catch (error) {
    console.log('error while calling api', error?.response);
    throw decryptData(error?.response?.data?.encryptData);
  }
  // return api.get(url, {params});
};

export const postRequest = async (
  url,
  data,
  contentType = 'application/json',
) => {
  console.log('url <><<>><><', url);
  console.log('data <><<>><><', data);
  console.log('await encryptData(data) <><<>><><', {
    encryptData: await encryptData(data),
  });
  try {
    const response = await api.post(
      url,
      {
        encryptData: await encryptData(data),
      },
      {
        headers: {
          'Content-Type': contentType,
          uuid: await fetchDeviceUUID(),
        },
      },
    );

   console.log("check error >>>>", )
    return await decryptData(response?.data?.encryptData);

  } catch (error) {
    console.log('error while calling api', error?.response);
    throw decryptData(error?.response?.data?.encryptData);
  }
};

// export const postRequest = async (
//   url,
//   data,
//   contentType = 'application/json',
// ) => {

//   return api.post(url, data, {
//     headers: {
//       'Content-Type': contentType,
//     },
//   });
// };

export const postRequestWithProgress = (
  url,
  data,
  contentType = 'multipart/form-data',
  onUploadProgress,
) => {
  return api.post(url, data, {
    headers: {
      'Content-Type': contentType,
    },
    onUploadProgress: progressEvent => {
      if (onUploadProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        onUploadProgress(percentCompleted);
      }
    },
  });
};

export const putRequest = (url, data, contentType = 'application/json') => {
  return api.put(url, data, {
    headers: {
      'Content-Type': contentType,
    },
  });
};
export const patchRequest = (url, data, contentType = 'application/json') => {
  return api.patch(url, data, {
    headers: {
      'Content-Type': contentType,
    },
  });
};

export const deleteRequest = (
  url,
  data = {},
  contentType = 'application/json',
) => {
  return api.delete(url, {
    data,
    headers: {
      'Content-Type': contentType,
    },
  });
};
