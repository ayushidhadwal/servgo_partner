import React, {useCallback, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {AnimatedFAB, Text} from 'react-native-paper';
import i18n from 'i18next';

import {useGetProductList} from '../../hooks/product/useGetProductList';
import Loader from '../../components/Loader';
import {ProductCard} from '../../components/products/ProductCard';
import Colors from '../../constant/Colors';
import * as productsAction from '../../store/actions/product';
import {useError} from '../../hooks/useError';

const ProductsListScreen = ({navigation}) => {
  const [productList, loading] = useGetProductList();

  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');

  const dispatch = useDispatch();
  const setError = useError();

  const onPressHandler = useCallback(
    async id => {
      setError(null);
      setValue(id);
      setIsLoading(true);
      try {
        await dispatch(productsAction.deleteProduct(id));
      } catch (e) {
        setError(e.msg);
      }
      setIsLoading(false);
    },
    [dispatch, setError],
  );

  const renderItem = ({item, index}) => {
    return (
      <ProductCard
        item={item}
        index={index}
        navigation={navigation}
        onPressHandler={onPressHandler}
        isLoading={isLoading}
        value={value}
      />
    );
  };

  const {bottom} = useSafeAreaInsets();

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      {productList.length === 0 ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>No Products</Text>
        </View>
      ) : (
        <FlatList
          data={productList}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
      <AnimatedFAB
        icon={'plus'}
        label={i18n.t('langChange:add')}
        extended={true}
        visible={true}
        onPress={() => navigation.navigate('AddProduct')}
        animateFrom={'right'}
        iconMode={'static'}
        style={[styles.fabStyle, {bottom: bottom || 20}]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
  },
  fabStyle: {
    bottom: 20,
    right: 15,
    position: 'absolute',
    backgroundColor: Colors.primary,
  },
});

export default ProductsListScreen;
