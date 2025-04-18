const express = require('express');
const mongoose = require('mongoose');
const app= express();
const port = 3000;
const Listing = require('./models/listing.js');
const path = require('path');

main()
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(() => {
    console.error('Error connecting to MongoDB:', err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));

app.get('/', (req, res) => {
    res.send('root is working!')
  
  });


  // Index Route
app.get("/listings", async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index", {alllistings});
});
 
// New Route
app.get("/listings/new", async (req, res) => {
  res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

// create route
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
  console.log("New listing created:", newListing);
});




/* 
app.get("/testlistings", async(req, res) => {    
    let sampleListing = new listing({
        title: "Samplvfggde Listing",
        description: "This is a sample listing.",
        price: 100,
        location: "Sample Location",
        country: "Sample Country"
    });

    await sampleListing.save()
    console.log("Sample listing saved to database.");
    res.send("Sample listing saved to database.");
}); */
  app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    });