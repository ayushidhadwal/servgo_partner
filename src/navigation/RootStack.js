import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import i18n from 'i18next';

import Colors from '../constant/Colors';
import NotifyScreen from '../screen/NotifyScreen';
import BottomTabNavigator from './BottomTabNavigator';
import TradeScreen from '../screen/menuSection/TradeScreen';
import TXNScreen from '../screen/menuSection/TXNScreen';
import BankDetailScreen from '../screen/menuSection/BankDetailScreen';
import AddServiceScreen from '../screen/menuSection/AddServiceScreen';
import HelpScreen from '../screen/HelpScreen';
import StatusScreen from '../screen/StatusScreen';
import SecurityScreen from '../screen/menuSection/SecurityScreen';
import ProfileDetails from '../screen/menuSection/ProfileDetails';
import ServicesScreen from '../screen/menuSection/ServicesScreen';
import BookingStatusScreen from '../screen/BookingStatusScreen';
import ServicePriceScreen from '../screen/menuSection/ServicePriceScreen';
import WalletScreen from '../screen/WalletScreen';
import TransactionScreen from '../screen/menuSection/TransactionScreen';
import UpdateProfileScreen from '../screen/menuSection/UpdateProfileScreen';
import CategoryScreen from '../screen/menuSection/CategoryScreen';
import GalleryScreen from '../screen/menuSection/GalleryScreen';
import UserComplaintScreen from '../screen/menuSection/UserComplaintScreen';
import FeedbackFormScreen from '../screen/menuSection/FeedbackFormScreen';
import CalenderScreen from '../screen/menuSection/CalenderScreen';
import MessageScreen, {
  screenOptions as messageScreenOptions,
} from '../screen/MessageScreen';
import WithdrawalScreen from '../screen/menuSection/WithdrawalScreen';
import HistoryStatusScreen from '../screen/HistoryStatusScreen';
import InvoiceScreen from '../screen/InvoiceScreen';
import MyReviewScreen from '../screen/menuSection/MyReviewScreen';
import AllPlanScreen from '../screen/subscriptionPlan/AllPlanScreen';
import PlanPaymentScreen from '../screen/subscriptionPlan/PlanPaymentScreen';
import AllPlanIOSScreen from '../screen/subscriptionPlan/AllPlanIOSScreen';
import AccountDetailScreen from '../screen/menuSection/AccountDetailScreen';
import BranchScreen from '../screen/branch/BranchScreen';
import AddBranchScreen from '../screen/branch/AddBranchScreen';
import EditBranchScreen from '../screen/branch/EditBranchScreen';
import UpdateEmailScreen from '../screen/menuSection/UpdateEmailScreen';
import ProductsListScreen from '../screen/product/ProductsListScreen';
import AddProductScreen from '../screen/product/AddProductScreen';
import EditProductScreen from '../screen/product/EditProductScreen';
import DeliveryChargesScreen from '../screen/deliveryCharges/DeliveryChargesScreen';
import DeliveryDetailsScreen from '../screen/delivery/DeliveryDetails';
import EditDeliveryScreen from '../screen/delivery/EditDeliveryScreen';
import DeliveryScreen from '../screen/delivery/DeliveryScreen';
import PendingOrderDetailScreen from '../screen/orders/PendingOrderDetailScreen';
import AddDeliveryBoyScreen from '../screen/delivery/AddDeliveryBoyScreen';
import OrderTopTabNavigator from './OrderTopTabNavigator';
import DeleteAccountScreen from '../screen/menuSection/DeleteAccountScreen';
import UpdateMobileScreen from '../screen/menuSection/UpdateMobileScreen';
import { useNotificationNavigation } from '../lib/notifee';

const Stack = createNativeStackNavigator();

const RootStack = () => {
  useNotificationNavigation();

  return (
    <Stack.Navigator
      initialRouteName="bottomTabs"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: '#fff',
        headerBackTitle: null,
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        name="bottomTabs"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      // options={({navigation, route}) => ({
      //   headerTitle: getHeaderTitle(route),
      //   headerStyle: {
      //     backgroundColor: Colors.primary,
      //   },
      //   headerTintColor: '#fff',
      //   headerTitleStyle: {
      //     fontWeight: 'bold',
      //     alignSelf: 'flex-start',
      //   },
      //   headerRight: () => (
      //     <View style={{flexDirection: 'row'}}>
      //       <Ionicons
      //         name={Platform.OS === 'ios' ? 'ios-wallet' : 'md-wallet'}
      //         size={24}
      //         color={Colors.white}
      //         onPress={() => navigation.navigate('Wallet')}
      //       />
      //     </View>
      //   ),
      // })}
      />
      <Stack.Screen
        name="services"
        component={ServicesScreen}
        options={{
          title: i18n.t('langChange:services'),
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="notify"
        component={NotifyScreen}
        options={{
          title: i18n.t('langChange:alertScreenTitle'),
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="trade"
        component={TradeScreen}
        options={() => ({
          title: null,
          headerBackTitle: null,
          headerRight: () => (
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: RFValue(18),
                marginHorizontal: RFValue(15),
              }}>
              {i18n.t('langChange:tradeLic')}
            </Text>
          ),
        })}
      />
      <Stack.Screen
        name="TXN"
        component={TXNScreen}
        options={() => ({
          title: null,
          headerBackTitle: null,
          headerRight: () => (
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: RFValue(18),
                marginHorizontal: RFValue(15),
              }}>
              {i18n.t('langChange:tranDetails')}
            </Text>
          ),
        })}
      />
      <Stack.Screen
        name="Bank"
        component={BankDetailScreen}
        options={() => ({
          title: null,
          headerBackTitle: null,
          headerRight: () => (
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: RFValue(18),
                marginHorizontal: RFValue(15),
              }}>
              {i18n.t('langChange:bankAcc')}
            </Text>
          ),
        })}
      />
      <Stack.Screen
        name="addService"
        component={AddServiceScreen}
        options={() => ({
          title: i18n.t('langChange:addService'),
        })}
      />
      <Stack.Screen
        name="help"
        component={HelpScreen}
        options={{
          title: i18n.t('langChange:helpScreenTitle'),
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="categories"
        component={CategoryScreen}
        options={{
          title: i18n.t('langChange:catScreenTitle'),
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="updatepassword"
        component={SecurityScreen}
        options={{
          title: i18n.t('langChange:updPass'),
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="profile_details"
        component={ProfileDetails}
        options={{
          title: i18n.t('langChange:profileScreenTitle'),
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="status"
        component={StatusScreen}
        options={{
          title: i18n.t('langChange:statusScreenTitle'),
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="BookingStatus"
        component={BookingStatusScreen}
        options={{
          title: i18n.t('langChange:bookingStatusScreenTitle'),
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="invoice"
        component={InvoiceScreen}
        options={{
          title: i18n.t('langChange:invoiceScreenTitle'),
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="HistoryStatus"
        component={HistoryStatusScreen}
        options={{
          title: i18n.t('langChange:statusScreenTitle'),
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="ServicePrice"
        component={ServicePriceScreen}
        options={{
          title: i18n.t('langChange:updService'),
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          title: i18n.t('langChange:walletScreenTitle'),
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="Transaction"
        component={TransactionScreen}
        options={{
          title: i18n.t('langChange:transScreenTitle'),
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="updateProfile"
        component={UpdateProfileScreen}
        options={{
          title: i18n.t('langChange:menuUpdateProfile'),
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="gallery"
        component={GalleryScreen}
        options={{
          title: i18n.t('langChange:menuGallery'),
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="Complaint"
        component={UserComplaintScreen}
        options={{
          title: i18n.t('langChange:regComplaint'),
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="feedBack"
        component={FeedbackFormScreen}
        options={{
          title: i18n.t('langChange:complaintFeedback'),
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="Calender"
        component={CalenderScreen}
        options={{
          title: i18n.t('langChange:calScreenTitle'),
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="myReview"
        component={MyReviewScreen}
        options={{
          title: i18n.t('langChange:menuReview'),
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="message"
        component={MessageScreen}
        options={messageScreenOptions}
      />
      <Stack.Screen
        name="withdrawal"
        component={WithdrawalScreen}
        options={{
          title: i18n.t('langChange:withdrawScreenTitle'),
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="Plans"
        component={Platform.OS === 'ios' ? AllPlanIOSScreen : AllPlanScreen}
        options={{
          title: i18n.t('langChange:plansScreenTitle'),
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="PlansPayment"
        component={PlanPaymentScreen}
        options={{
          title: i18n.t('langChange:payment'),
          headerBackTitle: null
        }}

      />
      <Stack.Screen
        name="account"
        component={AccountDetailScreen}
        options={{
          title: i18n.t('langChange:accDetails'),
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="Branch"
        component={BranchScreen}
        options={{
          title: i18n.t('langChange:myBranch'),
        }}
      />
      <Stack.Screen
        name="AddBranch"
        component={AddBranchScreen}
        options={{
          title: i18n.t('langChange:addBranch'),
        }}
      />
      <Stack.Screen
        name="EditBranch"
        component={EditBranchScreen}
        options={{
          title: i18n.t('langChange:editBranch'),
        }}
      />
      <Stack.Screen
        name="UpdateEmail"
        component={UpdateEmailScreen}
        options={{
          title: i18n.t('langChange:updateEmail'),
        }}
      />
      <Stack.Screen
        name="UpdateMobile"
        component={UpdateMobileScreen}
        options={{
          title: i18n.t('langChange:updateMobile'),
        }}
      />
      <Stack.Screen
        name="ProductsList"
        component={ProductsListScreen}
        options={{
          title: i18n.t('langChange:products'),
        }}
      />
      <Stack.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{
          title: i18n.t('langChange:addProducts'),
        }}
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={{
          title: i18n.t('langChange:editProducts'),
        }}
      />
      <Stack.Screen
        name="DeliveryCharges"
        component={DeliveryChargesScreen}
        options={{
          title: i18n.t('langChange:deliveryCharges'),
        }}
      />
      <Stack.Screen
        name="Delivery"
        component={DeliveryScreen}
        options={{
          title: i18n.t('langChange:delivery'),
        }}
      />
      <Stack.Screen
        name="DeliveryDetails"
        component={DeliveryDetailsScreen}
        options={{
          title: i18n.t('langChange:deliveryDetails'),
        }}
      />
      <Stack.Screen
        name="EditDelivery"
        component={EditDeliveryScreen}
        options={{
          title: i18n.t('langChange:editDelivery'),
        }}
      />
      <Stack.Screen
        name="OrderTopTab"
        component={OrderTopTabNavigator}
        options={{
          title: i18n.t('langChange:orders'),
        }}
      />
      <Stack.Screen
        name="AddDelivery"
        component={AddDeliveryBoyScreen}
        options={{
          title: i18n.t('langChange:addDelivery'),
        }}
      />
      <Stack.Screen
        name="PendingOrderDetail"
        component={PendingOrderDetailScreen}
        options={{
          title: i18n.t('langChange:orderDetail'),
        }}
      />
      <Stack.Screen
        name="DeleteAccount"
        component={DeleteAccountScreen}
        options={{
          title: i18n.t('langChange:deleteAccount')
        }}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
