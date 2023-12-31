import React, {useEffect, useState} from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {AnimatedFAB} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import i18n from 'i18next';

import * as branchAction from '../../store/actions/branch';
import Colors from '../../constant/Colors';
import Loader from '../../components/Loader';
import {useError} from '../../hooks/useError';
import {BranchCard} from '../../components/BranchCard';
import {SafeAreaView} from 'react-native-safe-area-context';

const BranchScreen = ({navigation}) => {
  const {branchList} = useSelector(state => state.branch);

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const setError = useError();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(branchAction.getAllBranches());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  const renderItem = ({item, index}) => {
    return <BranchCard item={item} index={index} navigation={navigation} />;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.screen}>
      <FlatList
        data={branchList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
      <AnimatedFAB
        icon={'plus'}
        label={i18n.t('langChange:add')}
        color={Colors.primary}
        extended={true}
        visible={true}
        onPress={() => navigation.navigate('AddBranch')}
        animateFrom={'right'}
        iconMode={'static'}
        style={styles.fabStyle}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  fabStyle: {
    bottom: 20,
    right: 15,
    position: 'absolute',
  },
});

export default BranchScreen;
