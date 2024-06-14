const slow = msg => console.log(`Dan said: ${msg}`);

exports.slowly = slow;

exports.fast = msg => console.log(`Dan cried: ${msg}`);
