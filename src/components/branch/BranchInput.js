import React, {memo, useCallback, useEffect, useState} from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../constant/Colors';
import {getAllBranches, updateBranchStatus} from '../../store/actions/branch';
import {useError} from '../../hooks/useError';
import {BranchModal} from './BranchModal';
import {successMessage} from '../../utils/success-message';

const BranchInput = ({style}) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const setError = useError();
  const {branchList} = useSelector(state => state.branch);

  const dispatch = useDispatch();

  useEffect(() => {
    const getBranches = async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(getAllBranches());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    getBranches();
  }, [dispatch, setError]);

  useEffect(() => {
    const branch = branchList.find(m => m.branch_status === 1);
    if (branch) {
      setAddress(
        `${branch?.partner_address}, ${branch?.city_name}, ${branch?.country_name}`,
      );
    }
  }, [branchList, dispatch]);

  const toggleModal = useCallback(
    () => setModalVisible(!modalVisible),
    [modalVisible],
  );

  const onUpdate = useCallback(
    async branchId => {
      setIsUpdating(true);
      try {
        await dispatch(updateBranchStatus(branchId));
        successMessage('Branch', 'Updated active branch!');
      } catch (e) {
        setError(e.message);
      } finally {
        setIsUpdating(false);
      }
    },
    [dispatch, setError],
  );

  return (
    <>
      <Pressable
        onPress={loading ? null : toggleModal}
        style={[styles.inputContainer, style]}>
        <Ionicons
          name="ios-location"
          size={24}
          color="black"
          style={styles.locationIcon}
        />
        <Text numberOfLines={1} style={styles.address}>
          {loading
            ? 'Loading please wait...'
            : address
            ? address
            : 'Please add a branch.'}
        </Text>
        <Ionicons name="caret-down-outline" size={24} color="black" />
      </Pressable>

      <BranchModal
        visible={modalVisible}
        onClose={toggleModal}
        list={branchList}
        isLoading={isUpdating}
        onUpdate={onUpdate}
      />
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: Colors.primaryLight,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationIcon: {
    marginRight: 5,
  },
  address: {
    flex: 1,
    flexShrink: 1,
    fontSize: 15,
  },
});

export default memo(BranchInput);
