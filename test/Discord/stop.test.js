const Stop = require('../../src/Commands/Stop.js');
const {mockMessage} = require('../Mock/DiscordMock.js');


describe('Testing stop function with admin and non admin user', () => {

  it('Should stop the bot', async () => {
    const mm = mockMessage("admin");
    await Stop.action(mm);
    expect(mm.delete).toHaveBeenCalledTimes(1);
    expect(mm.channel.send).toHaveBeenCalledTimes(1);
    expect(mm.channel.send).toHaveBeenCalledWith(`A bientôt ...`);
  });

  it('Should send an error message and not stop the bot', async () => {
    const mm = mockMessage("notAdmin");
    const errorObj = {"embed": {"author": {"icon_url": "http://avatarURL.png", "name": "userName"}, "color": 16711680, "description": "Vous devez être admin pour m'arrêter", "fields": "", "footer": {"text": ""}, "thumbnail": {"url": ""}, "url": ""}};
    await Stop.action(mm);
    expect(mm.delete).toHaveBeenCalledTimes(1);
    expect(mm.channel.send).toHaveBeenCalledTimes(1);
    expect(mm.channel.send).toHaveBeenCalledWith("", errorObj);
  });

});
