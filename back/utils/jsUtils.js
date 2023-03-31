exports.removeEmptyAttributes = function (obj) {
  return Object.entries(obj)
    .filter(([_, v]) => v != null)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
};

exports.isEmpty = function (obj) {
  if (
    !obj ||
    (obj &&
      Object.keys(obj).length === 0 &&
      Object.getPrototypeOf(obj) === Object.prototype)
  ) {
    return true;
  }

  return false;
};
