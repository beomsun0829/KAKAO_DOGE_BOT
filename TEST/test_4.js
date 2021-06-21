let sum = 0;


let timerId = setTimeout(function tick() {
    sum += 1;
    console.log(sum);
    timerId = setTimeout(tick, 200);
  }, 2000);