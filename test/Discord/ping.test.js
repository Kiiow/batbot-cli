const Ping = require('../../src/Commands/Ping.js');
const {mockBot, mockMessage} = require('../Mock/DiscordMock.js');

describe('Testing ping function', () => {

  it('Should send pong and log bot latency', () => {
    let mm = mockMessage();
    Ping.action(mm, mockBot);
    expect(mm.channel.send).toHaveBeenCalledTimes(1);
    expect(mm.channel.send).toHaveBeenCalledWith('Pong :ping_pong:');
  });

});
