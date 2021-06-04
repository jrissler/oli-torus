import { stemSlice } from 'components/activities/common/stem/redux';
import { configureStore } from 'state/store';

export default configureStore({
  reducer: {
    stem: stemSlice.reducer,
  },
});
