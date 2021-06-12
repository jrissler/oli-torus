import { Unconnected as SimpleUnconnected } from './simple/Unconnected';
import { Connected as SimpleConnected } from './simple/Connected';
import { Unconnected as TargetedConnected } from './targeted/Unconnected';

export const Feedback = {
  Authoring: {
    Simple: {
      Unconnected: SimpleUnconnected,
      Connected: SimpleConnected,
    },
    Targeted: {
      Unconnected: TargetedConnected,
    },
  },
  // Delivery
};
