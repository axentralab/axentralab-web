/**
 * Generic Helper Functions
 */

/**
 * Delay execution (async)
 * @param {number} ms - Milliseconds to wait
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Clone object deeply
 * @param {Object} obj
 * @returns {Object}
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Merge objects
 * @param {...Object} objects
 * @returns {Object}
 */
export const mergeObjects = (...objects) => {
  return objects.reduce((acc, obj) => ({ ...acc, ...obj }), {});
};

/**
 * Get value from nested object safely
 * @param {Object} obj
 * @param {string} path - e.g., "user.profile.name"
 * @param {*} defaultValue
 * @returns {*}
 */
export const getNestedValue = (obj, path, defaultValue = null) => {
  const keys = path.split('.');
  let value = obj;
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultValue;
    }
  }
  return value;
};

/**
 * Check if object is empty
 * @param {Object} obj
 * @returns {boolean}
 */
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

/**
 * Remove nulls and undefined from object
 * @param {Object} obj
 * @returns {Object}
 */
export const removeEmpty = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null)
  );
};

/**
 * Convert array to object by key
 * @param {Array} arr
 * @param {string} key - Property to use as object key
 * @returns {Object}
 */
export const arrayToObject = (arr, key = 'id') => {
  return arr.reduce((acc, item) => {
    acc[item[key]] = item;
    return acc;
  }, {});
};

/**
 * Sort array of objects
 * @param {Array} arr
 * @param {string} key - Property to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array}
 */
export const sortByKey = (arr, key, order = 'asc') => {
  return [...arr].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Group array by key
 * @param {Array} arr
 * @param {string} key
 * @returns {Object}
 */
export const groupByKey = (arr, key) => {
  return arr.reduce((acc, item) => {
    const k = item[key];
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});
};

export default {
  delay,
  deepClone,
  mergeObjects,
  getNestedValue,
  isEmpty,
  removeEmpty,
  arrayToObject,
  sortByKey,
  groupByKey,
};
