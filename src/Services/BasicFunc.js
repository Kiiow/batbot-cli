
function sleep(timeToSleep = 200){
  return new Promise((resolve) => { setTimeout( resolve, timeToSleep) });
}

module.exports = {
  sleep
};
