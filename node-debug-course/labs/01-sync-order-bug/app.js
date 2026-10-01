'use strict';

const orders = [
  { id: 'order-01', subtotal: 50, discountPercent: 0 },
  { id: 'order-02', subtotal: 75, discountPercent: 0 },
  { id: 'order-37', subtotal: 100, discountPercent: 20 },
];

function calculateTotal(order) {
  const discount = order.subtotal * order.discountPercent;
  const total = order.subtotal - discount;
  return { ...order, discount, total };
}

function buildReport(input) {
  return input.map((order) => calculateTotal(order));
}

const report = buildReport(orders);
const failed = report.find((order) => order.id === 'order-37');

console.table(report);
if (failed.total !== 80) {
  console.log('BUG REPRODUCED: order-37 expected total=80, actual=', failed.total);
} else {
  console.log('Bug was fixed; add and run regression assertions.');
}

