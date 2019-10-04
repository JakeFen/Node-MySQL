var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "rootpass",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  runPrompt();
});

function runPrompt() {
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
          "Add New Product",
          "Exit"
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

        case "Exit":
          connection.end();
      }
    });
}

function viewProduct() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      console.log(`
ItemId: ${res[i].item_id}
    Product: ${res[i].product_name} | Price: ${res[i].price} | Quantity: ${res[i].stock_quantity}`);
    }
    runPrompt();
  });
}

function lowInventory() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      if (res[i].stock_quantity < 5) {
        console.log(`
ItemId: ${res[i].item_id}
    Product: ${res[i].product_name} | Quantity ${res[i].stock_quantity}`);
      }
    }
    runPrompt();
  });
}

function addInventory() {
  inquirer
    .prompt([
      {
        name: "productId",
        type: "input",
        message: "Enter product Id.."
      },
      {
        name: "quantity",
        type: "input",
        message: "Enter amount.."
      }
    ])
    .then(function(answer) {
      connection.query(
        "SELECT stock_quantity FROM products WHERE ?",
        { item_id: answer.productId },
        function(err, res) {
          let newQuantity =
            parseInt(res[0].stock_quantity) + parseInt(answer.quantity);
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [{ stock_quantity: newQuantity }, { item_id: answer.productId }],
            function(err, res) {
              if (err) throw err;
              console.log("Successfully Updated!");
              runPrompt();
            }
          );
        }
      );
    });
}

function newProduct() {
  runPrompt();
}
