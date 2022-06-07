import { pingPipe } from "./general";
import {
  authenticationStatusPipe,
  authenticationMessagePipe,
} from "./authentication";
import { collectionPipe, orderSequencePipe } from "./order";
const pipeSink = {
  ping: pingPipe,
  authenticationStatus: authenticationStatusPipe,
  authenticationMessage: authenticationMessagePipe,
  orderSequence: orderSequencePipe,
  collection: collectionPipe,
};

export default pipeSink;
