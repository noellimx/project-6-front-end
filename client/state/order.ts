import {
  PayloadAction,
  OrderSequence,
  OrderFlow,
  Transition_DispatchUserOrder,
  Transition_Nil,
  Collection,
} from "../utils/my-types";

/** Order Sequence */
enum OrderSequenceCommand {
  UPDATE = "order:sequence:update",
}
export type OrderSequenceInjection = PayloadAction<OrderSequence>;

type OrderSequenceInjector = (_: OrderSequence) => OrderSequenceInjection;
export const orderStatusInjector: OrderSequenceInjector = (status) => ({
  type: OrderSequenceCommand.UPDATE,
  payload: status,
});

const initOrderSequenceStatus: () => OrderSequence = () => ({
  kind: OrderFlow.NIL,
  transition: Transition_Nil.NOT_IMPLEMENTED,
});

type OrderSequencePipe = (
  _: OrderSequence,
  __: OrderSequenceInjection
) => OrderSequence;

export const orderSequencePipe: OrderSequencePipe = (
  status = initOrderSequenceStatus(),
  injection
) => {
  const { type, payload } = injection;
  if (type === OrderSequenceCommand.UPDATE) {
    return payload;
  } else {
    return status;
  }
};

/** End of Order Sequence */
enum CollectionCommand {
  NEW = "collection:new",
}

export type CollectionInjection = PayloadAction<Collection>;

type NewCollectionInjector = (_: Collection) => CollectionInjection;
export const newCollectionInjector: NewCollectionInjector = (collection) => ({
  type: CollectionCommand.NEW,
  payload: collection,
});

type CollectionPipe = (_: Collection, __: CollectionInjection) => Collection;

export const collectionPipe: CollectionPipe = (status = null, injection) => {
  const { type, payload } = injection;
  if (type === CollectionCommand.NEW) {
    if (status !== null) {
      throw new Error("The client has loaded an inital collection already.");
    }
    return payload;
  } else {
    return status;
  }
};
