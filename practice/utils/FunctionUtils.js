export class FuncitonUtils {
  static bind(fn, ctx) {
    const args = [];
    for (let a = 2, aa = arguments.length; a < aa; a += 1) {
      args.push(arguments[a]);
    }

    return function () {
      var __arguments = [];
      for (var b = 0, bb = arguments.length; b < bb; b++) {
        __arguments[b] = arguments[b];
      }

      return fn.apply(ctx, args.concat(__arguments));
    };
  }
}

export default FuncitonUtils;
