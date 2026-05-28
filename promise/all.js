// 1. 模拟底层的独立请求
function getCpu() {
    return new Promise((resolve) => {
        // 1秒后，p1 成功，拿到数据
        setTimeout(() => resolve("i9处理器"), 1000); 
    });
}

function getGpu() {
    return new Promise((resolve) => {
        // 2秒后，p2 成功，拿到数据
        setTimeout(() => resolve("RTX-4090"), 2000); 
    });
}

function getRam() {
    return new Promise((resolve) => {
        // 1.5秒后，p3 成功，拿到数据
        setTimeout(() => resolve("32G内存"), 1500); 
    });
}

const p1 = getCpu(); 
const p2 = getGpu();
const p3 = getRam();

// 2. Promise.all 的介入
Promise.all([p1, p2, p3])
    .then((results) => {
        // 此时，results 的值就是：["i9处理器", "RTX-4090", "32G内存"]
        console.log(results); 
        
        // 所以可以通过索引把它们分别取出来
        const cpu = results[0]; // "i9处理器"
        const gpu = results[1]; // "RTX-4090"
        const ram = results[2]; // "32G内存"
    });