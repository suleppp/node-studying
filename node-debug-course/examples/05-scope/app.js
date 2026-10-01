'use strict';

const rate = 0.1;
const label = 'module label';

function createSequence(start) {
  let current = start;

  return function next() {
    current += 1;
    return current; // BREAKPOINT C：展开 Closure，查看 current。
  };
}

function calculateInvoice(price, quantity) {
  const label = 'local label';
  const invoice = {
    subtotal: price * quantity,
    label,
  };
  const alias = invoice;

  alias.tax = invoice.subtotal * rate; // BREAKPOINT A：执行前后比较对象。
  invoice.total = invoice.subtotal + invoice.tax;

  return invoice; // BREAKPOINT B：比较 Local 与模块作用域的 label。
}

function main() {
  const firstInvoice = calculateInvoice(100, 2);
  const next = createSequence(40);
  const firstId = next();
  const secondId = next();

  console.log({ firstInvoice, firstId, secondId });
}

main();

