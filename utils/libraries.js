const fs = require("fs");
const { join } = require("path");
function promisify(func) {
  return (...args) =>
    new Promise((resolve, reject) =>
      func(...args, (error, data) => (error ? reject(error) : resolve(data)))
    );
}

const readdir = promisify(fs.readdir);
const lstat = promisify(fs.lstat);

async function readDirectory(path) {
  let results = [];
  const files = await readdir(path);

  for (const file of files) {
    const stats = await lstat(join(path, file));
    if (stats.isDirectory()) {
      const other = await readDirectory(join(path, file));
      results = results.concat(other);
    } else {
      results.push(join(path, file));
    }
  }
  return results;
}

module.exports.read = function (path) {
  return readDirectory(path).then((data) =>
    data.map((path) => {
      const contents = fs.readFileSync(path);
      return JSON.parse(contents);
    })
  );
};
