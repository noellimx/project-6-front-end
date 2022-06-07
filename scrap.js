import schedule from "node-schedule";

const run = () => {
  console.log("hi");
  const date = DateTime.now().plus({ seconds: 5 });
  const some = 1;
  let t = new Date();
  t.setSeconds(t.getSeconds() + 10);
  try {
    console.log(`trying`);
    const job = schedule.scheduleJob(t, () => {
      console.log("The world is going to end today.");
      console.log(some);
    });
  } catch (err) {
    console.log("error");
  }
};

run();
