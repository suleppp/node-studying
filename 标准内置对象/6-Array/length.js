let arr = new Array(3);
arr[0]=1;
arr[1]=2;
arr[2]=3;

arr.forEach(val => {
    console.log(val);
});

arr.length=10;

arr.forEach(val => {
    console.log(val);
});

console.log(arr[9])