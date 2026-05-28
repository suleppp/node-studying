function bibao(){
    let count = 0;

    return function(){
        count++;
        console.log("当前count的值是：",count);
    };
}

bibao2 = bibao();

bibao2();// 1
bibao2();// 2

bibao3 = bibao()
bibao3()// 1
bibao3()// 2

sayHi(); // 正常运行！因为“变量提升”

function sayHi() {
    console.log("Hi");
}