
class LevelService {

  static calcXp(length) {
    let minXp = Math.round(length*0.85);
    let maxXp = Math.round(length*1.15);
    return Math.round(Math.random() * (maxXp - minXp) + minXp);
  }

  static xpNeed(level) {
    let xp = 4*(Math.pow(level, 5))-15*(Math.pow(level, 2))+100*level;
    xp = Math.round(xp/100)*100;
    return Math.round(xp);
  }
}

module.exports = LevelService;
