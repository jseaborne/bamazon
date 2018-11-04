var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  //queryAllProducts();
  runPrompt();
});

function runPrompt() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Hi. welcome to our product catalog. ",
      choices: [
        "List all products by ID",
        "Select a product by ID to buy",
        //"How many units would like to buy?"        
      ]
    })
    .then(function (answer) {
      switch (answer.action) {

        case "List all products by ID":
          queryAllProducts();
          break;

        case "Select a product by ID to buy":
          selectAProduct();
          break;

        //case "How many units would like to buy?":
        //    queryAllProducts();
        //      break;    
      }
    });
}

function queryAllProducts() {
  connection.query("SELECT * FROM products", function (err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + "$" + res[i].price + " | " + "units in stock: " + res[i].stock_quantity);
    }
    console.log("-----------------------------------");

    runPrompt();

  });
}

function selectAProduct() {
  inquirer
    .prompt({
      name: "item_id",
      type: "input",
      message: "Which item # would you would like to buy?"
    })
    .then(function (answer) {
      console.log(answer.item_id);
      connection.query("SELECT * FROM products WHERE ?", { item_id: answer.item_id }, function (err, res) {
        
        var instock = res[0].stock_quantity;

        console.log(
          "Item you selected: " +
          res[0].product_name +
          " || Price: " +
          "$" + res[0].price +
          " || Units in stock: " +
          res[0].stock_quantity

        );
        productPurchase(res[0].product_name, res[0].stock_quantity);
      });
    });
}

function productPurchase(stockName, stockQuantity) {
  inquirer
    .prompt({
      name: "quantity",
      type: "input",
      message: "How many would you would like to buy?"
    })
    .then(function (answer) {
      
      connection.query("SELECT * FROM products WHERE ?", { stock_quantity: answer.stock_quantity }, function (err, res) {
        

var quanityToBuy = answer.quantity[0] + answer.quantity[1];
//console.log(quanityToBuy);

var a = parseInt(answer.quantity);
//console.log("A is " + a);

        if (a > stockQuantity) {
          console.log("Insufficient quantity!");
        }
        else {

newTotal = stockQuantity - a;

          console.log("Congrats on your purchase " + newTotal);
        
          var updateQueryStr = 'SET stock_quantity = ' + newTotal + ' WHERE item_id = ' + stockName;
					// console.log('updateQueryStr = ' + updateQueryStr);

					// Update the inventory
          connection.query(updateQueryStr, function(err, data)
          
          {
					if (err) throw err;
          
          });
        //updateProduct(newTotal)
        //runPrompt();
        
        }
      });
    });
  }
