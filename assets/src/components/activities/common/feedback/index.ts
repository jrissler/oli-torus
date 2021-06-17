import { Unconnected as SimpleUnconnected } from './simple/Unconnected';
import { Connected as SimpleConnected } from './simple/Connected';
import { Unconnected as TargetedUnconnected } from './targeted/Unconnected';
import { Connected as TargetedConnected } from './targeted/Connected';
// import { Connected as TargetedConnected } from './targeted/Connected';

export const Feedback = {
  Authoring: {
    Simple: {
      Unconnected: SimpleUnconnected,
      Connected: SimpleConnected,
    },
    Targeted: {
      Unconnected: TargetedUnconnected,
      Connected: TargetedConnected,
    },
  },
  // Delivery
};
