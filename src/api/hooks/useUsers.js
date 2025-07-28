import {useQuery} from '@tanstack/react-query';
import {getRequest} from '../apiService';
import {APIS} from '../apiSheet';

export const useUsers = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const RESPONSE = await getRequest(APIS.REGISTER);
      console.log('RESPONSE<><><', RESPONSE);
      return RESPONSE.data;
    },
  });
};

// export const registerUser = async payload => {
//   return useMutation({
//     // queryKey: ['registerUser'],
//     mutationFn: postRequest(APIS.REGISTER, payload),
//     onSuccess: data => {
//       // Invalidate and refetch
//       console.log('User registered successfully:', data);
//     },
//     onError: error => {
//       console.error('Error registering user:', error);
//       Alert.alert(
//         'Registration Error',
//         'Failed to register user. Please try again.',
//       );
//     },
//   });
// };
