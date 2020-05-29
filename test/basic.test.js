const { sleep } = require('../src/Services/BasicFunc.js');

describe('Basic function', () => {

  it.concurrent('Should sleep for 500 ms (with 50ms max delay)', async () => {
    let tsStart = (new Date()).getTime();
    await sleep(500);
    let timeSleeped = ((new Date()).getTime() - tsStart);

    expect(timeSleeped).toBeGreaterThanOrEqual(500);
  });


});
