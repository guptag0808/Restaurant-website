const express = require('express');
const resRoute= express.Router()
const {ResturantModel}= require("../model/resturantModel")

resRoute.post("/upload/restaurant",async(req,res)=>{
const {name,address,menu}  = req.body
try{
	const resturant= new ResturantModel({name,address,menu})
	resturant.save()
	res.status(200).send({"New-Resturant" : resturant})
}catch(error){
	res.status(500).send(error)
}
})


resRoute.get("/restaurants",async(req,res)=>{
	try{
		const resturant= await ResturantModel.find()
		res.status(200).send(resturant)
	}catch(err){
		res.status(500).send(err.message)
	}
})

resRoute.get("/restaurants/:id",async(req,res)=>{
	const id= req.params.id
	try{
		const resturant= await ResturantModel.findById(id)
		res.status(200).send(resturant)
	}catch(err){
		res.send(err.message)
	}
})

resRoute.get("/restaurants/:id/menu",async(req,res)=>{
	const id= req.params.id
	try{
		const resturant= await ResturantModel.findById(id)
		  const menu= resturant.menu
		res.status(200).send(menu)
	}catch(err){
		res.send(err.message)
	}
})

resRoute.delete("/restaurants/:id/menu/:menuId",async(req,res)=>{
	const id= req.params.id
	const itemId = req.params.menuId;
	try{
		const resturant= await ResturantModel.findById(id)
		
		if (!resturant) {
			return res.status(404).json({ error: 'Restaurant not found' });
		  }
		  const menuItemIndex = resturant.menu.findIndex(item => item.id === itemId);
		  if (menuItemIndex === -1) {
			return res.status(404).json({ error: 'Menu item not found' });
		  }
		  resturant.menu.splice(menuItemIndex, 1);
		  res.status(202).send({ message: 'Menu item deleted successfully' });
	}catch(err){
		res.send(err.message)
	}
})


resRoute.post('/restaurants/:Id/menu', (req, res) => {
	const Id = parseInt(req.params.Id);
    const restaurant = ResturantModel.find(rest => rest.id === Id);
  
	if (!restaurant) {
	  return res.status(404).json({ error: 'Restaurant not found' });
	}
    const newItem = req.body;
	const newId = restaurant.menu.length > 0 ? restaurant.menu[restaurant.menu.length - 1].id + 1 : 1;
	restaurant.menu.push({ id: newId, ...newItem });
  
	res.json({ message: 'New item added to the menu' });
  });

module.exports={
	resRoute
}