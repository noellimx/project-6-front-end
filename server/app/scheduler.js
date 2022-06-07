import schedule from "node-schedule";

const demo = (seconds) => {
  console.log("hi");
  const some = 1;
  let t = new Date();
  t.setSeconds(t.getSeconds() + 10);
  try {
    const job = schedule.scheduleJob(t, () => {
      console.log("The world is going to end today.");
      console.log(some);
    });
  } catch (err) {
    console.log("error");
  }
};

const invokeDeferredCallback = (date, cb = () => {}) => {
  try {
    schedule.scheduleJob(date, () => {
      cb();
    });
  } catch (err) {
    console.log("error");
  }
};

export { invokeDeferredCallback };
