local class = require "3rdparty/middleclass"
local tween = require "3rdparty/tween"
local lume = require "3rdparty/lume"



-- tables with data 

actionsPack = {
	{text = "test" , position = { x = 440 , y = 200}   , src = "assets/img/test.jpg"}

}
locationsPack  = {
	{text = "bla bla" ,  src = "assets/img/background.png"}
}
propPack  = {
	{text = "bla bla" , src = "assets/img/background.png"}
}
personPack  = {
	{text = "bla bla" , src = "assets/img/test.jpg"}
}


-- Scene : make the scene and control the images and what to show
Scene = class('Scene')
function Scene:initialize()
      self.personPosition 	= { x = {440,440} , y = {100,100}}
	  self.propPosition 	= { x = {0,340}   , y = {0,200} }
	  self.locationPosition = { x = {0,0}   , y = {0,0} }
	  self.actionPosition   = { x = {440,440}   , y = {100,100} }
end
-- return the choosen values + id , img
function Scene:get()
	return {location = self.choosen_locatio ,person = self.choosen_person, action = self.choosen_action , prop = self.choosen_prop}
end
-- setup the scene 
function Scene:start()
   -- set random id values
   self.choosen_person_id   = math.random(1,#personPack) 
   self.choosen_action_id   = math.random(1,#actionsPack) 
   self.choosen_prop_id     = math.random(1,#propPack) 
   self.choosen_location_id = math.random(1,#locationsPack) 
   -- add values if not exists
   if not personPack[self.choosen_person_id]["id"] then
		personPack[self.choosen_person_id]["id"]  = self.choosen_person_id
		personPack[self.choosen_person_id]["img"] = love.graphics.newImage(personPack[self.choosen_person_id]["src"])
   end
   if not actionsPack[self.choosen_action_id]["id"] then
		actionsPack[self.choosen_action_id]["id"]  = self.choosen_action_id
		actionsPack[self.choosen_action_id]["img"] = love.graphics.newImage(actionsPack[self.choosen_action_id]["src"])
   end
   if not propPack[self.choosen_prop_id]["id"] then
		propPack[self.choosen_prop_id]["id"]  = self.choosen_prop_id
		propPack[self.choosen_prop_id]["img"] = love.graphics.newImage(propPack[self.choosen_prop_id]["src"])
   end
   if not locationsPack[self.choosen_location_id]["id"] then
		locationsPack[self.choosen_location_id]["id"]  = self.choosen_location_id
		locationsPack[self.choosen_location_id]["img"] = love.graphics.newImage(locationsPack[self.choosen_location_id]["src"])
   end
   -- set choosen values
   self.choosen_action   	= actionsPack[ self.choosen_action_id ]
   self.choosen_prop     	= propPack[ self.choosen_prop_id ]
   self.choosen_location 	= locationsPack[ self.choosen_location_id ]
   self.choosen_person 		= personPack[ self.choosen_person_id ]
   
end

-- draws functions
function Scene:draw_position(data,box)
	if data["position"] then
		return { x = data["position"]["x"] , y = data["position"]["y"]}
	end
	return {x = math.random(box["x"][1],box["x"][2]) ,  y = math.random(box["y"][1],box["y"][2]) }
end
function Scene:draw_location()
	local position = self:draw_position(self.choosen_location,self.locationPosition) 
	love.graphics.draw(self.choosen_location["img"],position["x"],position["y"])
end
function Scene:draw_prop()
	local position = self:draw_position(self.choosen_prop,self.propPosition) 
	love.graphics.draw(self.choosen_prop["img"],position["x"],position["y"])
end
function Scene:draw_action()
	local position = self:draw_position(self.choosen_action,self.actionPosition) 
	love.graphics.draw(self.choosen_action["img"],position["x"],position["y"])
end
function Scene:draw_person()
	local position = self:draw_position(self.choosen_person,self.personPosition) 
	love.graphics.draw(self.choosen_person["img"],position["x"],position["y"])
end
-- end draw functions


