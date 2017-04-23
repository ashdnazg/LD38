local class = require "3rdparty/middleclass"
local tween = require "3rdparty/tween"
local lume = require "3rdparty/lume"



-- tables with data 


empty_background = love.graphics.newImage("assets/img/locations/background.png")
actionsPack = {
	{text = "1111111"    , src = "assets/img/personprop/personprop1.png"},
	{text = "222222"   , src = "assets/img/personprop/personprop2.png"},
	{text = "33333333"    , src = "assets/img/personprop/personprop3.png"},
	{text = "4444444"    , src = "assets/img/personprop/personprop4.png"},
	{text = "55555555"   , src = "assets/img/personprop/personprop5.png"},
	{text = "6666666"    , src = "assets/img/personprop/personprop6.png"},
	{text = "7777777"   , src = "assets/img/personprop/personprop7.png"}
}
locationsPack  = {
	{text = "11111111" ,  src = "assets/img/locations/bathroom.png"},
	{text = "22222222" ,  src = "assets/img/locations/desert_island.png"},
	{text = "3333333" ,  src = "assets/img/locations/north_pole.png"},
	{text = "44444444" ,  src = "assets/img/locations/prison.png"},
	{text = "55555555" ,  src = "assets/img/locations/school.png"},
	{text = "666666666" ,  src = "assets/img/locations/space.png"},
	{text = "77777777" ,  src = "assets/img/locations/volcano.png"},
	{text = "88888888" ,  src = "assets/img/locations/tennis_court.png"},
	{text = "9999999999" ,  src = "assets/img/locations/western_front.png"}
}
propPack  = {
	{text = "1111111" , src = "assets/img/generic props/somme.png"},
	{text = "22222222" , src = "assets/img/generic props/alien.png"},
	{text = "3333333" , src = "assets/img/generic props/babysit.png"},
	{text = "4444444" , src = "assets/img/generic props/bankrobber.png"},
	{text = "555555" , src = "assets/img/generic props/cthulhu.png"},
	{text = "6666666" , src = "assets/img/generic props/fred.png"},
	{text = "7777777" , src = "assets/img/generic props/hurricane.png"},
	{text = "8888888" , src = "assets/img/generic props/planecrash.png"},
	{text = "9999999" , src = "assets/img/generic props/queen.png"},
	{text = "9999999" , src = "assets/img/generic props/shark.png"},

}
personPack  = {
	{text = "111111111" , src = "assets/img/person/person1.png"},
	{text = "222222222" , src = "assets/img/person/person2.png"},
	{text = "3333333333" , src = "assets/img/person/person3.png"},
	{text = "444444444" , src = "assets/img/person/person4.png"},
	{text = "444444444" , src = "assets/img/person/person5.png"},
	{text = "444444444" , src = "assets/img/person/person6.png"},
	{text = "444444444" , src = "assets/img/person/person7.png"},
	{text = "444444444" , src = "assets/img/person/person8.png"},
	{text = "444444444" , src = "assets/img/person/person9.png"}
}


-- Scene : make the scene and control the images and what to show
Scene = class('Scene')
function Scene:initialize()
      self.personPosition 	= { x = {440,440} , y = {100,100}}
	  self.propPosition 	= { x = {0,340}   , y = {0,200} }
	  self.locationPosition = { x = {0,0}   , y = {0,0} }
	  self.actionPosition   = { x = {440,440}   , y = {100,100} }
end
-- choose random text & id
-- num number that want
 function Scene:random_options(data,choose_id,num)
	local num = num or 6
	local options 		= {}
	--fist value nil
	options[1] = {id = -1 , text = " " }
	local all_avialible_options = {}
	for i=1, #data do
		if i ~= choose_id then
			all_avialible_options[#all_avialible_options + 1] = { id = i ,text = data[i]["text"]}
		end
	end

	while #all_avialible_options > 0 and num >= #options do
		local count = 0
		local id_pick = math.random(1,#all_avialible_options) 
		options[#options+1] = all_avialible_options[id_pick]
		all_avialible_options[id_pick] = all_avialible_options[#all_avialible_options]
		all_avialible_options[#all_avialible_options] = nil
	end
	
    num = 	 math.random(2, #options) 
	options[num] = { id = choose_id ,text = data[choose_id]["text"]}
	options[#options+1] = {id = -1 , text = " " }
	return options
	
 end
-- return the choosen values + id , img
function Scene:get()
 
	local get_random_options = {location = self:random_options(locationsPack,self.choosen_location_id) , action = self:random_options(actionsPack,self.choosen_action_id) ,prop = self:random_options(propPack,self.choosen_prop_id)}
	return {random_options = get_random_options , location = self.choosen_location ,person = self.choosen_person, action = self.choosen_action , prop = self.choosen_prop}
end


-- setup the before 
function Scene:before()
	self.status = "before"
end
-- setup the after 
function Scene:after()
	self.status = "after"
end
-- setup the after 
function Scene:middle()
   self.currentPersonPosition = 640 
	self.status = "middle"
end
-- if someone was wrong 
function Scene:rage()
	self.rageMove = {430,440,450,440,435,440,445,440}
	self.status = "middle"
end
-- setup the scene 
function Scene:start()
   self.rageMove = {}
   self.currentPersonPosition = 640 
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
   
   -- set position
   self.pick_position_location = self:draw_position(self.choosen_location,self.locationPosition) 
   self.pick_position_prop = self:draw_position(self.choosen_prop,self.propPosition) 
   self.pick_position_action = self:draw_position(self.choosen_action,self.actionPosition) 
   self.pick_position_person = self:draw_position(self.choosen_person,self.personPosition) 
end

-- draws functions
function Scene:draw_position(data,box)
	if data["position"] then
		return { x = data["position"]["x"] , y = data["position"]["y"]}
	end
	return {x = math.random(box["x"][1],box["x"][2]) ,  y = math.random(box["y"][1],box["y"][2]) }
end
function Scene:draw_location()
	if self.status == "middle" then
		love.graphics.draw(self.choosen_location["img"],self.pick_position_location["x"],self.pick_position_location["y"])
	else 
		love.graphics.draw(empty_background,self.pick_position_location["x"],self.pick_position_location["y"])
	end
end
function Scene:draw_prop()
	if self.status == "middle" then
		love.graphics.draw(self.choosen_prop["img"],self.pick_position_prop["x"],self.pick_position_prop["y"])
	end
end
function Scene:draw_action()
	if self.status == "middle" then
		love.graphics.draw(self.choosen_action["img"],self.pick_position_action["x"],self.pick_position_action["y"])
	end
end
function Scene:draw_person()
	if self.status == "middle" then
		local x = #self.rageMove == 0 and self.pick_position_person["x"] or table.remove(self.rageMove,1)
		self.currentPersonPosition = x
		love.graphics.draw(self.choosen_person["img"],self.currentPersonPosition,self.pick_position_person["y"])
	elseif self.status == "before" then
		self.currentPersonPosition = self.currentPersonPosition <= 449 and 440 or self.currentPersonPosition - 9
		love.graphics.draw(self.choosen_person["img"],self.currentPersonPosition,100)
	elseif self.status == "after" then
		self.currentPersonPosition = self.currentPersonPosition >= 631 and 640 or self.currentPersonPosition + 9
		love.graphics.draw(self.choosen_person["img"],self.currentPersonPosition,100)
	end
end
-- end draw functions


