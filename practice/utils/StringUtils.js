export class StringUtils {
  static capitalizePool = {};

  static capitalize(name) {
    if (!this.capitalizePool[name]) {
      this.capitalizePool[name] =
        name.substring(0, 1).toUpperCase() + name.substring(1);
    }
    return this.capitalizePool[name];
  }
}

export default StringUtils;
