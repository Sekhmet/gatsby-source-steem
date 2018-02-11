const { promisify } = require('bluebird');
const { createClient } = require('lightrpc');
const client = createClient('https://api.steemit.com');

const sendAsync = promisify(client.send, { context: client });

const limit = 10;

async function getAll(tag, sortBy) {
  const posts = [];
  const result = await sendAsync(`get_discussions_by_${sortBy}`, [{ tag, limit }]);
  posts.push(...result);

  let received = 0;
  do {
    const startAuthor = posts[posts.length - 1].author;
    const startPermlink = posts[posts.length - 1].permlink;

    const moreResult = await sendAsync(`get_discussions_by_${sortBy}`, [
      { tag, limit, start_author: startAuthor, start_permlink: startPermlink },
    ]);

    posts.push(...moreResult.slice(1));
    received = moreResult.length;
  } while (received === limit);
  return posts;
}

module.exports = getAll;
