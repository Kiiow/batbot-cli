const mockBot = { 'ping': 100 };

function mockMessage(userType = "admin") {
  let userId = "";
  let isBot = false;
  switch(userType){ // Check for the type of user who as send the message
    case "admin":
      userId = "231826744192139264";
      break;
    case "notAdmin":
      userId = "598942264856805390";
      break;
    case "bot":
      userId = "335719423560384524";
      isBot = true;
      break;
    default: // Admin by default
      userId = "231826744192139264";
      break;
  }

  const sendMock = jest.fn().mockResolvedValue( () => { return { 'createdTimestamp': 1590872550 } });

  return {
    'delete': jest.fn(),
    'author': {
      'id': userId,
      'avatarURL': 'http://avatarURL.png',
      'bot': isBot,
    },
    'member' : {
      'displayName': 'userName',
    },
    'channel': {
      'send': sendMock,
    },
    'createdTimestamp': 1590872400,
  };
}

module.exports = {
  mockBot,
  mockMessage
};
