import {GET_ALL_BRANCH, UPDATE_BRANCH_STATUS} from '../actions/branch';

const initialState = {
  branchList: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_BRANCH: {
      return {
        ...state,
        branchList: [...action.branchList],
      };
    }
    case UPDATE_BRANCH_STATUS: {
      const {branchId} = action.payload;
      const branches = state.branchList.map(branch => ({
        ...branch,
        branch_status: 0,
      }));

      const index = branches.findIndex(branch => branch.id === branchId);
      if (index > -1) {
        branches[index].branch_status = 1;
      }

      return {
        ...state,
        branchList: branches,
      };
    }
    default:
      return state;
  }
};
