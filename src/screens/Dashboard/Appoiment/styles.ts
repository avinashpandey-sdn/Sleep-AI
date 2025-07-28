import { StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";

export const styles = StyleSheet.create({
    container: { flex: 1, marginHorizontal: moderateScale(24) },

    text: {
        fontSize: 16,
        color: '#333',
    },
    background: {
        flex: 1,
        resizeMode: 'cover',
        backgroundColor: 'black',

    },
})