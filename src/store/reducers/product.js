import {
  GET_PRODUCT_LIST,
  DELETE_PRODUCT,
  GET_PRODUCT_DETAILS,
} from '../actions/product';

const initialState = {
  productList: [],
  productId: null,
  productDetails: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCT_LIST: {
      return {
        ...state,
        productList: [...action.productList],
      };
    }

    case DELETE_PRODUCT: {
      const productList = state.productList;
      const arr = productList.findIndex(i => {
        return Number(i.id) === Number(action.productId);
      });
      if (arr > -1) {
        productList.splice(arr, 1);
      }
      return {
        ...state,
        productList: productList,
      };
    }

    case GET_PRODUCT_DETAILS: {
      const data = action.productDetails;
      return {
        ...state,
        productDetails: {
          ...state.productDetails,
          id: data.id,
          title: data.title,
          titleArabic: data.title_Arabic,
          SellingPrice: data.Selling_Price,
          MRP: data.MRP,
          inventory: data.inventory,
          discount: data.discount,
          description: data.description,
          arabicDescription: data.arabic_description,
          productImage1: data.product_image1,
          productImage2: data.product_image2,
          productImage3: data.product_image3,
          productImage4: data.product_image4,
          currency: data.currency,
          category: data.category,
          sub_category: data.sub_category,
        },
      };
    }
    default:
      return state;
  }
};
