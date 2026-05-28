const { EventEmitter, once } = require('node:events');
const emitter = new EventEmitter();
const ac = new AbortController();

once(emitter, 'data', { signal: ac.signal })
  .then((args) => {
    const msg = args[0];  // emit 传的第一个参数
    console.log('hahaha', msg);
  })
  .catch((err) => {
    if (err.name === 'AbortError') {
      console.log('已取消');
    }
  });

emitter.emit('data', 'wuwuwu');  // 输出 hahaha wuwuwu

ac.abort();

emitter.emit('data', 'wuwu2'); // 不会输出