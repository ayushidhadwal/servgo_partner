import {
  GET_DELIVERED_ORDER_LIST,
  GET_ORDER_PENDING_LIST,
  GET_SHIPPED_ORDER_LIST,
  GET_OUT_FOR_DELIVERY_ORDER_LIST,
  GET_ORDER_DETAILS,
} from '../actions/order';

const initialState = {
  orderPendingList: [],
  shippedOrderList: [],
  deliveredOrderList: [],
  outForDeliveryList: [],
  orderDetails: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ORDER_PENDING_LIST: {
      return {
        ...state,
        orderPendingList: [...action.orderPendingList],
      };
    }
    case GET_SHIPPED_ORDER_LIST: {
      return {
        ...state,
        shippedOrderList: [...action.shippedOrderList],
      };
    }
    case GET_DELIVERED_ORDER_LIST: {
      return {
        ...state,
        deliveredOrderList: [...action.deliveredOrderList],
      };
    }
    case GET_OUT_FOR_DELIVERY_ORDER_LIST: {
      return {
        ...state,
        outForDeliveryList: [...action.outForDeliveryList],
      };
    }
    case GET_ORDER_DETAILS: {
      const data = action.orderDetails;

      return {
        ...state,
        orderDetails: {
          ...state.orderDetails,
          orderId: data.order_id,
          paymentStatus: data.payment_status,
          createdAt: data.created_at,
          currency: data.currency,
          vatAmount: data.vat_amount,
          vatPercent: data.vat_percent,
          deliveryCharges: data.delivery_charges,
          title: data.title,
          orderPrice: data.order_price,
          pricePaid: data.price_paid,
          userName: data.userName,
          mobileNumber: data.addr_phonenumber,
          address: data.addr_city,
          city: data.addr_city,
          orderItems: [...data.orderItems],
          deliveryAgent: data.delivery_agent,
          deliveryBoy: data.DeliveryBoyName,
          pickUpAddressId: data.pickup_address,
          pickUpAddress: data.partner_address,
        },
      };
    }

    default:
      return state;
  }
};
