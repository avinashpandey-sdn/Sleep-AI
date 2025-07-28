import { APP_COLORS } from "@constants/color";
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
    backgroundColor: APP_COLORS.IMAGE_BACKGROUND_COLOR
  },
  button: {
    padding: 20,
    backgroundColor: '#6832C4',
    borderRadius: 24,
    width: '90%',
    borderColor: '#AB9BDD',
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  fullMaskStyle: {
    width: 68,
    height: 73
  },
  maskContainer: {
    flexDirection: 'row',
    backgroundColor: 'black',
    width: 320
  },
  heading: {
    fontWeight: 500,
    fontSize: 16,
    color: APP_COLORS.WHITE
  },



  // dashbord

  greeting: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  menuItem: { alignItems: 'center' },
  menuIconWrap: {
    backgroundColor: '#4444aa',
    // padding: 12,
    width: 47,
    height: 47,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 4,
  },
  menuLabel: { color: '#fff', fontSize: 12, fontWeight: '400' },

  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  infoCard: {
    backgroundColor: '#2D1E50',
    padding: 16,
    borderRadius: 12,
    width: moderateScale(156),
  },
  infoLabel: { color: '#aaa', fontSize: 12 },
  infoValue: { color: '#fff', fontSize: 22, fontWeight: '600' },

  statusRow: {
    flexDirection: 'row',
    backgroundColor: '#2E1655',
    padding: 12,
    marginTop: 8,
    borderRadius: 12,
    marginBottom: 24,
  },
  statusText: { color: '#fff', marginLeft: 8 },

  bannerCard: {
    backgroundColor: '#6D40C7',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
  },
  bannerTitle: { fontSize: 20, fontWeight: '500', color: '#fff' },
  bannerText: { color: '#FFFFFFE5', fontSize: 12, fontWeight: '400', marginVertical: 2 },
  bannerButton: {
    backgroundColor: '#5524A9',
    height: 40,
    width: 137,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 100,
    marginTop: 10,
    flexDirection: 'row',
    padding: 12,

  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },

  recommendCard: {
    backgroundColor: '#2D1E50',
    marginTop: 15,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
  },
  recommendImg: { width: 68, height: 73, marginRight: 12 },
  recommendTitle: { color: '#fff', fontWeight: '500', fontSize: 14 },
  recommendSub: { color: '#F4F3F3', fontSize: 12, fontWeight: '400' },
  link: { color: '#B29BE0', fontSize: 12, fontWeight: '400', marginTop: 4, textDecorationLine: 'underline' },

  appointmentCard: {
    backgroundColor: '#3A257A',
    marginTop: 15,
    padding: 16,
    borderRadius: 12,
  },
  appointmentName: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  appointmentRole: { fontSize: 12, color: '#ccc', fontWeight: '400' },
  appointmentDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  appointmentText: { color: '#ccc', fontSize: 12 },

  trackCard: {
    // marginTop: 15,
    marginRight: 15
    // alignItems: 'center',
  },
  trackImage: { width: 132, height: 140, borderRadius: 12 },
  trackTitle: { color: '#fff', fontWeight: 'bold', marginTop: 4 },
  trackDuration: { color: '#aaa', fontSize: 12 },

  articleCard: {
    backgroundColor: '#09001F66',
    marginTop: 15,
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  articleTitle: { color: '#fff', fontWeight: 'bold' },
  articleSubtitle: { color: '#aaa', fontSize: 12, width: '80%' },
  menuIcon: {
    width: 22,
    height: 22,
    tintColor: '#fff',
  },
  rightIcon: {
    width: 20,
    height: 20,
  },
  girlPhoto: {
    width: 110,
    height: 134,

  },
  moon: {
    width: 16,
    height: 16,
    marginRight: 4,

  },
  appoimentIcon: {
    height: 18,
    width: 18,
  },
  doctor: {
    height: 44,
    width: 44,
  },
  share: {
    width: 20,
    height: 20,
  }
})