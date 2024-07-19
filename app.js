const express= require('express')
const app=express()  //line 1,2 for configuaring express

const path=require('path')
app.set('view engine','ejs')//line 4,5,6 for configuring ejs and making it to use views folder for rendering
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}))

const methodOverride=require('method-override')
app.use(methodOverride('_method'))

const mongoose=require('mongoose') //line 8 to 16 for configuring mongoose
const Campground=require('./models/campground')

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
  console.log("Mongo connection open")
}

app.get('/',(req,res)=>{
    //res.send('Hello from Yelp Camp')
    res.render('home.ejs')
})

app.get('/campgrounds',async (req,res)=>{
    const campgrounds=await Campground.find({})
    res.render('campgrounds/index.ejs',{campgrounds})
})

app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new.ejs')
})

app.post('/campgrounds',async (req,res)=>{
    const campground=new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground.id}`)
})


app.get('/campgrounds/:id',async(req,res)=>{
    const {id}=req.params
    const campground=await Campground.findById(id)
    res.render('campgrounds/show.ejs',{campground})
})

app.get('/campgrounds/:id/edit',async (req,res)=>{
    const {id}=req.params
    const campground=await Campground.findById(id)
    res.render('campgrounds/edit.ejs',{campground})
})

app.put('/campgrounds/:id',async(req,res)=>{
    const {id}=req.params
    const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${campground.id}`)
})

app.delete('/campgrounds/:id',async (req,res)=>{
    const {id}=req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})

app.listen(3000,(req,res)=>{
    console.log('Serving on port 3000')
})