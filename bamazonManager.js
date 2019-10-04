var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "rootpass",
  database: "bamazon"
});

inquirer
  .prompt([
    {
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ]
    }
  ])
  .then(function(answer) {
    switch (answer.action) {
      case "View Products for Sale":
        viewProduct();
        break;

      case "View Low Inventory":
        lowInventory();
        break;

      case "Add to Inventory":
        addInventory();
        break;

      case "Add New Product":
        newProduct();
        break;
    }
  });

function viewProduct() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      console.log(`
ItemId: ${res[i].item_id}
    Product: ${res[i].product_name} | Price: ${res[i].price} | Quantity: ${res[i].stock_quantity}`);
    }
    connection.end();
  });
}

function lowInventory() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      if (res[i].stock_quantity < 10) {
        console.log(`
ItemId: ${res[i].item_id}
    Product: ${res[i].product_name} | Quantity ${res[i].stock_quantity}`);
      }
    }
    connection.end();
  });
}

function addInventory() {
  console.log("Add Product!");
}

function newProduct() {
  console.log("New Product!");
}
