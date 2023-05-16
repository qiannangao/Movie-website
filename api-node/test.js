function ajax(n) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random()<.75?resolve(n):reject(`err:${n}`);
    }, 1000);
  })
}

async function foo() {
  
  const n1 = await ajax(1);
  const n2 = await ajax(2);
  return {
    n1,
    n2
  }
}

foo().then(res=>{
  console.log(res)
}).catch(err=>{
  console.log(err)
})