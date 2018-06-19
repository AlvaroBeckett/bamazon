var mysql = require("mysql");
var inquirer = require("inquirer");
var arrProduct = ["Exit"];
var newStockQuantity = 0;
var productPrice = 0;
var purchaseCost = 0;
var orderQuantity = 0;
var currentProduct;
var inStock = 0;
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    user: "root",

    password: process.argv[2],
    database: "bamazon_db"
  });
  connection.connect(function(err) {
    if (err) throw err;

    productChoices();
  });
function inventory(){
    inquirer.prompt({
        name: "menu",
        type: "list",
        message: "Choose from options below:",
        choices: [
            "Add New Product",
            "View Products",
            "View Low Inventory",
            "Add to Inventory", 
            "Exit"
                ]
    }).then(function(answer){
        console.log(answer.menu);
        switch (answer.menu) {
            case "Add New Product":
                addProduct();
                break;
            case "View Products":
                productsForSale();
                break;
      
            case "View Low Inventory":
                lowInventory();
                break;
      
            case "Add to Inventory":
                addInventory();
                break;
            case "Exit":
                connection.end();
                break;
            }
    })
}

function productsForSale() {
    var query = "SELECT item_id, product_name, department_name,price, stock_quantity FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("\n===================\nProduct ID: " + res[i].item_id +"\nDepartment: " + res[i].department_name  + "\nProcuct Name: " + res[i].product_name + "\nPrice: " + res[i].price.toFixed(2) + "\nQuantity: " + res[i].stock_quantity + "\n====================");
        }
        console.log("Press Arrow Key for Menu Options");
    });
    inventory();
}
function lowInventory() {
    var query = "SELECT item_id, product_name, department_name,price, stock_quantity FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                if(res[i].stock_quantity<=5){
                console.log("\n===================\nProduct ID: " + res[i].item_id +"\nDepartment: " + res[i].department_name  + "\nProcuct Name: " + res[i].product_name + "\nPrice: " + res[i].price.toFixed(2) + "\nQuantity: " + res[i].stock_quantity + "\n====================");
               }
            }    
            console.log("\nPress Arrow Key for Menu Options");
    });
    inventory();
}
function addInventory() {
    inquirer.prompt({
        name: "name",
        type: "list",
        message: "\nWhich product should be re-stocked?",
        choices: arrProduct
    }).then(function(answer){
          var query = "SELECT item_id, product_name, price, stock_quantity FROM products";
          connection.query(query, function(err, res) {
          if (err) throw err;
          for (var i = 0; i < res.length; i++) {
              if (res[i].product_name == answer.name){
                  inStock = res[i].stock_quantity;
                  productPrice = res[i].price;
                  currentProduct = res[i].product_name;
                  console.log("Product ID: " + res[i].item_id + "\nProcuct Name: " + res[i].product_name + "\nPrice: " + res[i].price + "\nQuantity: " + res[i].stock_quantity);
                  updateQuantity();
              }
      }
    })
  })
}
function updateQuantity(){
    inquirer.prompt({
        name: "quantity",
        type: "input",
        message: "\nHow many more items should be added to inventory?",
    }).then(function (answer1){
    orderQuantity = answer1.quantity;
    newStockQuantity = parseInt(inStock)+ parseInt(orderQuantity);
    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity: newStockQuantity
        },
        {
          product_name: currentProduct
        }
      ],
      function(err,res) {
        if (err) throw err;
        console.log("New Stock Quantity: " + newStockQuantity + " for " + currentProduct);
      })
        inventory();
    });
}

function productChoices(){
    var query = "SELECT product_name FROM products";
        connection.query(query, function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            arrProduct.unshift(res[i].product_name);
        }
        inventory();
        })
    }
function addProduct(){
    inquirer.prompt([{
        name: "product_name",
        type: "input",
        message: "\nWhat is the name of new product?"
    },
    {
        name: "department_name",
        type: "input",
        message: "\nWhich department is this located at?"
    },
    {
        name: "price",
        type: "input",
        message: "\nWhat is the sale price?",
        validate: function(value) {
            if(isNaN(value)===false){
                return true;
            }
            return false;
        }
    },
    {
        name: "stock_quantity",
        type: "input",
        message: "\nHow many should be stocked?",
        validate: function(value){
            if(isNaN(value)===false){
                return true;
            }
            return false;
        }
    }]).then(function (answer2){
        var query = connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: answer2.product_name,
                department_name: answer2.department_name,
                price: answer2.price,
                stock_quantity: answer2.stock_quantity
            }
        )
        arrProduct.unshift(answer2.product_name);
        inventory();
    })
}