const express = require('express');
const mongoose = require('mongoose');
const app= express();
const port = 8080;
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');


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
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

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


//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//Update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
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
      console.log(`Wanderlust app listening on port ${port}`)
    });
    