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
  console.log("connected as id " + connection.threadId + "\n");
  listProducts();
});

function listProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      console.log(`ItemId: ${res[i].item_id +
        ", Product: " +
        res[i].product_name +
        ", Price: " +
        res[i].price}`);
    }
    inquirerSearch();
  });
}

function inquirerSearch() {
  inquirer
    .prompt([
      {
        name: "item_id",
        type: "input",
        message: "What's the Id of the product you would like to buy?"
      },
      {
        name: "stock_quantity",
        type: "input",
        message: "How many would you like?"
      }
    ])
    .then(function(inquirerResponse) {
      var query = "SELECT item_id, stock_quantity, price FROM products WHERE ?";
      connection.query(query, { item_id: inquirerResponse.item_id }, function(
        err,
        res
      ) {
        if (inquirerResponse.stock_quantity <= res[0].stock_quantity) {
          let itemId = res[0].item_id;
          let newQuantity =
            res[0].stock_quantity - inquirerResponse.stock_quantity;
          updateProducts(newQuantity, itemId);
          console.log("Thanks for your purchase!");
          console.log(
            "Total: " + res[0].price * inquirerResponse.stock_quantity
          );
        } else {
          console.log("Insufficient quantity!");
          connection.end();
        }
      });
    });
}

function updateProducts(newQuantity, itemId) {
  connection.query(
    "UPDATE products SET ? WHERE ?",[{ stock_quantity: newQuantity }, { item_id: itemId }],
    function(err, res) {
      if (err) throw err;
    }
  );
  connection.end();
}