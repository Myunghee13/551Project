let express = require('express')
let app = express()
let mongodb = require('mongodb')
let sanitizeHTML = require('sanitize-html')
let db

let port = process.env.PORT 
if (port == null || port =="") {
  port = 3000
}

let connectionString = '' // mongodb uri

mongodb.connect(connectionString, {useNewUrlParser: true}, function(err, client){
    db = client.db()
    app.listen(port)
})
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/', function(req, res) {
  db.collection('playstore').find().toArray(function(err, items){     
    res.send(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>GooglePlayStore</title>
      
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">
        <link rel="stylesheet" href="https://unpkg.com/bootstrap-table@1.15.5/dist/bootstrap-table.min.css">
      </head>
      <body>
      <div class="container">
      <h1 class="display-4 text-center py-1">GooglePlayStore Data Set</h1>   

      <ul class="list-group pb-5">
      <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <span class="item-text">Filtering category (e.g. beauty, comics, education)</br></br>
          <form action="/category" method="POST">
            <div class="d-flex align-items-center">
              <input name="category" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class = "filter-category btn btn-danger btn-sm">Filter</button><p>&nbsp</p>
              <a href="http://localhost:3000/" class="link "><button class="control backlink btn btn-danger btn-sm">Clear</button></a>
            </div>
          </form>
        </span>
      </li>
      
      <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <span class="item-text">Filtering the number of user reviews (min: 0, max: 78158306)</br></br>
          <form action="/reviews" method="POST">
            <div class="d-flex align-items-center">
              Lower Bound: </br>
              <input name="lower" value = 0 autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              Upper Bound: </br>
              <input name="upper" value = 78158306 autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class = "filter-reviews btn btn-danger btn-sm">Filter</button><p>&nbsp</p>
              <a href="http://localhost:3000/" class="link "><button class="control backlink btn btn-danger btn-sm">Clear</button></a>
            </div>
          </form>
             
        </span>
      </li>      
    </ul></div>
    
    <div class="container">
  <table id="table" data-search="true" data-show-columns="true"></table>
  </div>
  

  <!-- import bootstrap.js jquery popper -->
  <script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/bootstrap-table@1.15.5/dist/bootstrap-table.min.js"></script>
  
  <!-- filter -->
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script>let items = ${JSON.stringify(items)} </script>

  <!-- table generator -->
  <script type="text/javascript">  
         $('#table').bootstrapTable({
          pagination: true,
          columns: [{
            field: 'App',
            title: 'App',
            sortable: true
          }, {
            field: 'Category',
            title: 'Category',
            sortable: true
          }, {
            field: 'Rating',
            title: 'Rating',
            sortable: true
          }, {
            field: 'Reviews',
            title: 'Reviews',
            sortable: true
          }, {
            field: 'Size',
            title: 'Size',
            sortable: true
          }, {
            field: 'Installs',
            title: 'Installs',
            sortable: true
          }, {
            field: 'Type',
            title: 'Type',
            sortable: true
          }, {
            field: 'Price',
            title: 'Price',
            sortable: true
          }, {
            field: 'Content_Rating',
            title: 'Content Rating',
            sortable: true
          }, {
            field: 'Genres',
            title: 'Genres',
            sortable: true
          }, {
            field: 'Last_Updated',
            title: 'Last Updated',
            sortable: true
          }, {
            field: 'Current_Ver',
            title: 'Current Ver',
            sortable: true
          }, {
            field: 'Android_Ver',
            title: 'Android Ver',
            sortable: true
          }],
          data: items
        });
    
  </script>
   
  

</body>
</html>  
    `)})
})

// when user clicks category filter
app.post('/category', function(req, res){
  let safeCategory = sanitizeHTML(req.body.category, {allowedTags: [], allowedAttributes:{}})
  db.collection('playstore').find({Category: new RegExp(safeCategory, 'i')}).toArray(function(err, items2){
    res.send(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>GooglePlayStore</title>
      
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">
        <link rel="stylesheet" href="https://unpkg.com/bootstrap-table@1.15.5/dist/bootstrap-table.min.css">
      </head>
      <body>
      <div class="container">
      <h1 class="display-4 text-center py-1">GooglePlayStore Data Set</h1>   

      <ul class="list-group pb-5">
      <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <span class="item-text">Filtering category (e.g. beauty, comics, education)</br></br>
          <form action="/category" method="POST">
            <div class="d-flex align-items-center">
              <input name="category" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class = "filter-category btn btn-danger btn-sm">Filter</button><p>&nbsp</p>
              <a href="http://localhost:3000/" class="link "><button class="control backlink btn btn-danger btn-sm">Clear</button></a>  
            </div>
          </form>
        </span>
      </li>
      
      <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <span class="item-text">Filtering the number of user reviews (min: 0, max: 78158306)</br></br>
          <form action="/reviews" method="POST">
            <div class="d-flex align-items-center">
              Lower Bound: </br>
              <input name="lower" value = 0 autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              Upper Bound: </br>
              <input name="upper" value = 78158306 autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class = "filter-reviews btn btn-danger btn-sm">Filter</button><p>&nbsp</p>
              <a href="http://localhost:3000/" class="link "><button class="control backlink btn btn-danger btn-sm">Clear</button></a>

            </div>
          </form>
             
        </span>
      </li>
    </ul></div>
    
    <div class="container">
  <table id="table" data-search="true" data-show-columns="true"></table>
  </div>
  

  <!-- import bootstrap.js jquery popper -->
  <script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/bootstrap-table@1.15.5/dist/bootstrap-table.min.js"></script>
  
  <!-- filter -->
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script>let items2 = ${JSON.stringify(items2)} </script>

  <!-- table generator -->
  <script type="text/javascript">  
         $('#table').bootstrapTable({
          pagination: true,
          columns: [{
            field: 'App',
            title: 'App',
            sortable: true
          }, {
            field: 'Category',
            title: 'Category',
            sortable: true
          }, {
            field: 'Rating',
            title: 'Rating',
            sortable: true
          }, {
            field: 'Reviews',
            title: 'Reviews',
            sortable: true
          }, {
            field: 'Size',
            title: 'Size',
            sortable: true
          }, {
            field: 'Installs',
            title: 'Installs',
            sortable: true
          }, {
            field: 'Type',
            title: 'Type',
            sortable: true
          }, {
            field: 'Price',
            title: 'Price',
            sortable: true
          }, {
            field: 'Content_Rating',
            title: 'Content Rating',
            sortable: true
          }, {
            field: 'Genres',
            title: 'Genres',
            sortable: true
          }, {
            field: 'Last_Updated',
            title: 'Last Updated',
            sortable: true
          }, {
            field: 'Current_Ver',
            title: 'Current Ver',
            sortable: true
          }, {
            field: 'Android_Ver',
            title: 'Android Ver',
            sortable: true
          }],
          data: items2
        });
    
  </script>
   
  

</body>
</html>  
    `)
  })
})



// when user clicks # of reviews filter
app.post('/reviews', function(req, res){
  let safeLower = sanitizeHTML(req.body.lower, {allowedTags: [], allowedAttributes:{}})
  let safeUpper = sanitizeHTML(req.body.upper, {allowedTags: [], allowedAttributes:{}})
  db.collection('playstore').find({Reviews: {$gte: Number(safeLower), $lte: Number(safeUpper)}}).toArray(function(err, items3){
    res.send(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>GooglePlayStore</title>
      
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">
        <link rel="stylesheet" href="https://unpkg.com/bootstrap-table@1.15.5/dist/bootstrap-table.min.css">
      </head>
      <body>
      <div class="container">
      <h1 class="display-4 text-center py-1">GooglePlayStore Data Set</h1>   

      <ul class="list-group pb-5">
      <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <span class="item-text">Filtering category (e.g. beauty, comics, education)</br></br>
          <form action="/category" method="POST">
            <div class="d-flex align-items-center">
              <input name="category" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class = "filter-category btn btn-danger btn-sm">Filter</button><p>&nbsp</p>
              <a href="http://localhost:3000/" class="link "><button class="control backlink btn btn-danger btn-sm">Clear</button></a>
            </div>
          </form>
        </span>
      </li>
      
      <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <span class="item-text">Filtering the number of user reviews (min: 0, max: 78158306)</br></br>
          <form action="/reviews" method="POST">
            <div class="d-flex align-items-center">
              Lower Bound: </br>
              <input name="lower" value = 0 autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              Upper Bound: </br>
              <input name="upper" value = 78158306 autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class = "filter-reviews btn btn-danger btn-sm">Filter</button><p>&nbsp</p>
              <a href="http://localhost:3000/" class="link "><button class="control backlink btn btn-danger btn-sm">Clear</button></a>  

            </div>
          </form>
             
        </span>
      </li>
    </ul></div>
    
    <div class="container">
  <table id="table" data-search="true" data-show-columns="true"></table>
  </div>
  

  <!-- import bootstrap.js jquery popper -->
  <script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/bootstrap-table@1.15.5/dist/bootstrap-table.min.js"></script>
  
  <!-- filter -->
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script>let items3 = ${JSON.stringify(items3)} </script>

  <!-- table generator -->
  <script type="text/javascript">  
         $('#table').bootstrapTable({
          pagination: true,
          columns: [{
            field: 'App',
            title: 'App',
            sortable: true
          }, {
            field: 'Category',
            title: 'Category',
            sortable: true
          }, {
            field: 'Rating',
            title: 'Rating',
            sortable: true
          }, {
            field: 'Reviews',
            title: 'Reviews',
            sortable: true
          }, {
            field: 'Size',
            title: 'Size',
            sortable: true
          }, {
            field: 'Installs',
            title: 'Installs',
            sortable: true
          }, {
            field: 'Type',
            title: 'Type',
            sortable: true
          }, {
            field: 'Price',
            title: 'Price',
            sortable: true
          }, {
            field: 'Content_Rating',
            title: 'Content Rating',
            sortable: true
          }, {
            field: 'Genres',
            title: 'Genres',
            sortable: true
          }, {
            field: 'Last_Updated',
            title: 'Last Updated',
            sortable: true
          }, {
            field: 'Current_Ver',
            title: 'Current Ver',
            sortable: true
          }, {
            field: 'Android_Ver',
            title: 'Android Ver',
            sortable: true
          }],
          data: items3
        });
    
  </script>
   
  

</body>
</html>  
    `)
  })})

// Ctrl+~ : open command line in visual studio code

// only server.js file in a new folder

// npm init -y
// -> package.json

// npm install express 
// -> node_modules, package-lock.json

// npm install mongodb

// npm install nodemon 

// add '"watch": "nodemon server",' under "scripts" in package.json like below 

// "scripts": {
//    "watch": "nodemon server",

// to run nodemon locally
// command: npm run watch
// localhost:3000

// to stop node server : "Ctrl + c" in command line

// for security
// npm install sanitize-html 