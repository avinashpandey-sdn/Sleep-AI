import {Alert} from 'react-native';
import {showMessage} from 'react-native-flash-message';

export const showError = (message = '', description = '') => {
  const formattedDescription = description
    ? description.charAt(0).toUpperCase() + description.slice(1).toLowerCase()
    : '';
  showMessage({
    type: 'danger',
    message: message,
    description: formattedDescription,
    duration: 5000,
  });
};
export const showInfo = (message = '', description = '') => {
  const formattedDescription = description
    ? description.charAt(0).toUpperCase() + description.slice(1).toLowerCase()
    : '';
  showMessage({
    type: 'info',
    message,
    description: formattedDescription,
  });
};

export const showSuccess = (message = '', description = '') => {
  const formattedDescription = description
    ? description.charAt(0).toUpperCase() + description.slice(1).toLowerCase()
    : '';

  showMessage({
    type: 'success',
    message,
    description: formattedDescription,
  });
};

export const alertWithTwoBtnCancel = (title, message, btn1Text, btn2Text) => {
  const formattedDescription = message
    ? message.charAt(0).toUpperCase() + message.slice(1).toLowerCase()
    : '';

  return new Promise(resolve => {
    Alert.alert(
      title,
      formattedDescription,
      [
        {
          text: btn1Text,
          onPress: () => resolve(false),
          style: 'cancel',
        },
        {
          text: btn2Text,
          onPress: () => resolve(true),
        },
      ],
      {cancelable: false},
    );
  });
};
