const arrayLike = {
  0: "a",
  1: "b",
  length: 2.1,
};
console.log(Array.prototype.join.call(arrayLike, "+")); // 'a+b'

Array.prototype.forEach.call(arrayLike, element => {
    console.log(element);
});
console.log(arrayLike.length)