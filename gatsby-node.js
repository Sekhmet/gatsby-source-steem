const crypto = require('crypto');
const getAll = require('./get-all');

exports.sourceNodes = async ({ boundActionCreators }, { tag, sortBy }) => {
  const { createNode } = boundActionCreators;

  const posts = await getAll(tag, sortBy);
  posts.map(post => {
    const nodeStr = JSON.stringify(post);
    const nodeHash = crypto
      .createHash('md5')
      .update(nodeStr)
      .digest('hex');

    createNode({
      ...post,
      id: `${post.id}`,
      parent: null,
      children: [],
      internal: {
        type: 'SteemPost',
        content: nodeStr,
        contentDigest: nodeHash,
      },
    });
  });

  return;
};
