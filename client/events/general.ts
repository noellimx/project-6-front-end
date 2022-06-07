import { pingReceived } from "../state/general";

import { UpLinkSub, ChannelReceive, GeneralTrigger } from "../utils/my-types";

const uplinkGeneral: UpLinkSub<GeneralTrigger> = (io, store) => {
  console.log("[uplinkGeneral] attaching");
  io.on("copy", (flag) => {
    console.log(`[uplinkGeneral ping] copy := ${flag}`);
    store.dispatch(pingReceived());
  });

  const doYouAcknowledge = (chanRcv: ChannelReceive<string>) => {
    io.emit("do-you-acknowledge", (msg: string) => {
      chanRcv(msg);
    });
  };
  const acknowledge = () => doYouAcknowledge(() => {});
  return {
    acknowledge,
    doYouAcknowledge,
  };
};

export default uplinkGeneral;
