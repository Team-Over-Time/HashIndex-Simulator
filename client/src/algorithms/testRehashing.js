import { Rehashing } from "./Rehashing.js";

const table = new Rehashing(5, 2, 0.7);

console.log("Initial State:");
console.log(table.getState());

console.log("\nInsert 10:");
console.log(table.insert(10));

console.log("\nInsert 15:");
console.log(table.insert(15));

console.log("\nInsert 20:");
console.log(table.insert(20));

console.log("\nInsert 25:");
console.log(table.insert(25));

console.log("\nInsert 30:");
console.log(table.insert(30));

console.log("\nFinal State:");
console.log(table.getState());