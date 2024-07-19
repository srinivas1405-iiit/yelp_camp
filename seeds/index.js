const mongoose=require('mongoose') 
const Campground=require('../models/campground')
const cities=require('./cities.js')
const {places,descriptors}=require('./seedHelpers.js')

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
  console.log("Mongo connection open")
}

const sample=(array)=>{
    return array[Math.floor(Math.random()*array.length)]
}

const seedDB=async()=>{
    await Campground.deleteMany({})

    for(let i=0;i<50;i++){
        const random1000=Math.floor(Math.random()*1000)
        const camps=new Campground({
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`
        })
        await camps.save()
    }
    
}

seedDB().then(()=>{
    mongoose.connection.close()
})