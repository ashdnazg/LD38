local class = require "3rdparty/middleclass"
local tween = require "3rdparty/tween"
local lume = require "3rdparty/lume"
local sounds = require "lib/sounds"



-- tables with data


empty_background = love.graphics.newImage("assets/img/locations/background.png")
actionsPack = {
	{text = "played tennis", src = "assets/img/personprop/personprop1.png"},
	{text = "fought", src = "assets/img/personprop/personprop2.png"},
	{text = "studied", src = "assets/img/personprop/personprop3.png"},
	{text = "partied", src = "assets/img/personprop/personprop4.png"},
	{text = "hiked", src = "assets/img/personprop/personprop5.png"},
	{text = "scuba-dived", src = "assets/img/personprop/personprop6.png"},
	{text = "pillaged", src = "assets/img/personprop/personprop7.png"},
	{text = "hacked", src = "assets/img/personprop/anon.png"},
	{text = "yodeled", src = "assets/img/personprop/yodel.png"},
	{text = "watched a movie", src = "assets/img/personprop/movie.png"}
}

locationsPack  = {
	{text = "in the bathroom" ,  src = "assets/img/locations/bathroom.png"},
	{text = "on the desert island" ,  src = "assets/img/locations/desert_island.png"},
	{text = "in the north pole" ,  src = "assets/img/locations/north_pole.png"},
	{text = "in prison" ,  src = "assets/img/locations/prison.png"},
	{text = "in school" ,  src = "assets/img/locations/school.png"},
	{text = "in space" ,  src = "assets/img/locations/space.png"},
	{text = "next to that volcano" ,  src = "assets/img/locations/volcano.png"},
	{text = "at the tennis court" ,  src = "assets/img/locations/tennis_court.png"},
	{text = "in the battle of the Somme" ,  src = "assets/img/locations/western_front.png"},
	{text = "in the Taj Mahal" ,  src = "assets/img/locations/tajmahal.png"}
}

propPack  = {
	{text = "with the 7th division" , src = "assets/img/generic props/somme.png"},
	{text = "during the alien invasion" , src = "assets/img/generic props/alien.png"},
	{text = "while babysitting" , src = "assets/img/generic props/babysit.png"},
	{text = "during the bank robbery" , src = "assets/img/generic props/bankrobber.png"},
	{text = "with Cthulhu" , src = "assets/img/generic props/cthulhu.png"},
	{text = "with Fred" , src = "assets/img/generic props/fred.png"},
	{text = "during the tornado" , src = "assets/img/generic props/hurricane.png"},
	{text = "during that plane crash" , src = "assets/img/generic props/planecrash.png"},
	{text = "with Her Majesty" , src = "assets/img/generic props/queen.png"},
	{text = "with that weird shark" , src = "assets/img/generic props/shark.png"},
}

personPack  = {
	{text_b = "Hey there, what's up? Don't you remember me?"
		, text_a = "Oh yeah, that was great! Anyway, gotta go!" , src = "assets/img/person/person1.png"},
	{text_b = "Oh boy, we sure had a great time back then, remember?"
		, text_a = "Are you in a hurry? I could talk all day!" , src = "assets/img/person/person2.png"},
	{text_b = "So happy to see you. I will never leave your side, like that one time!"
		, text_a = "We should do that again sometime!" , src = "assets/img/person/person3.png"},
	{text_b = "You look like you don't remember me, but we had a great time!"
		, text_a = "Wait, what were we talking about?" , src = "assets/img/person/person4.png"},
	{text_b = "Liebe Freund, es ist unglaublich dass du mich vergessen!"
		, text_a = "Ja, das war wunderbar!" , src = "assets/img/person/person5.png"},
	{text_b = "We made that pie together once! Oh and remember that time???"
		, text_a = "MAN and then we had that steak and went bowling..." , src = "assets/img/person/person6.png"},
	{text_b = "Long lost friend! Our adventures are always dear on my heart."
		, text_a = "Our tale will continue some day." , src = "assets/img/person/person7.png"},
	{text_b = "*hic* those were the days *hic*, don't you remember?"
		, text_a = "My hiccups are gone." , src = "assets/img/person/person8.png"},
	{text_b = "Do you not recall our exploits back when the world was young?"
		, text_a = "How fair was my hair in the days of yore!" , src = "assets/img/person/person9.png"}
}

local rand_index
local rand_options

-- Scene : make the scene and control the images and what to show
Scene = class('Scene')
function Scene:initialize()
    self.personPosition 	= { x = {440,440} , y = {100,100}}
	self.propPosition 	= { x = {0,280}   , y = {0,150} }
	self.locationPosition = { x = {0,0}   , y = {0,0} }
	self.actionPosition   = { x = {440,440}   , y = {100,100} }
	rand_options = {}
	rand_index = 1
	self:populateOptions()
end

function Scene:reset()
	rand_index = 1
	rand_options = {}

	self:populateOptions()
end

function Scene:populateOptions()
	local h_p = {}
	local h_a = {}
	local h_l = {}
	local h_pr = {}

	for i=1,5 do
		local break_loop = false
		while not break_loop do
			a = math.random(1,#personPack)
			if not h_p[a] then
				h_p[a] = true
				rand_options[i] = {person = a}
				break_loop = true
			end
		end

		break_loop = false
		while not break_loop do
			a = math.random(1,#actionsPack)
			if not h_a[a] then
				h_a[a] = true
				rand_options[i]["action"] = a
				break_loop = true
			end
		end

		break_loop = false
		while not break_loop do
			a = math.random(1,#propPack)
			if not h_pr[a] then
				h_pr[a] = true
				rand_options[i]["prop"] = a
				break_loop = true
			end
		end

		break_loop = false
		while not break_loop do
			a = math.random(1,#locationsPack)
			if not h_l[a] then
				h_l[a] = true
				rand_options[i]["loc"] = a
				break_loop = true
			end
		end

	end
end

-- choose random text & id
-- num number that want
 function Scene:random_options(data,choose_id,num)
	local num = num or 5
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
	sounds:ask()
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

function Scene:getPhase()
	return self.status
end

-- if someone was wrong
function Scene:rage()
	self.rageMove = {430,440,450,440,435,440,445,440}
	self.status = "middle"
end
-- setup the scene
function Scene:start()
	self.moveToStreet = false
	self.movePersonToStreet = false
   self.rageMove = {}
   self.currentPersonPosition = 640
   -- set random id values
   self.choosen_person_id   = rand_options[rand_index]["person"]
   self.choosen_action_id   = rand_options[rand_index]["action"]
   self.choosen_prop_id     = rand_options[rand_index]["prop"]
   self.choosen_location_id = rand_options[rand_index]["loc"]
   rand_index = rand_index + 1
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

function Scene:keyPress(key, options)
	if key == "up" or key == "w" then
		options:changeChoice('u')
	elseif key == "down" or key == "s" then
		options:changeChoice('d')
	elseif key == "right" or key == "d"  then
		options:changeChoice('r')
	elseif key == "left" or key == "a"  then
		options:changeChoice('l')
	elseif (key == "return" or key == "kpenter") then
		if self.status == "before" and not sounds:isPlaying() then
			self.status = "middle"
		elseif self.status == "middle" and not sounds:isPlaying() then
			player_choice = options:getChoice()

			if (self.choosen_action_id == player_choice[1] and self.choosen_location_id == player_choice[2]
				and self.choosen_prop_id == player_choice[3]) then
				sounds:yes()
				self.status = "after"
			else
				sounds:no()
				self:rage()
			end
		elseif self.status == "after" then
			return true
		end
	end
	return false
 end

-- draws functions
function Scene:draw_position(data,box)
	if data["position"] then
		return { x = data["position"]["x"] , y = data["position"]["y"]}
	end
	return {x = math.random(box["x"][1],box["x"][2]) ,  y = math.random(box["y"][1],box["y"][2]) }
end
function Scene:draw_location()
	if self.status ~= "before" then
		love.graphics.draw(self.choosen_location["img"],self.pick_position_location["x"],self.pick_position_location["y"])
	else
		love.graphics.draw(empty_background,self.pick_position_location["x"],self.pick_position_location["y"])
	end
end
function Scene:draw_prop()
	if self.status ~= "before" then
		love.graphics.draw(self.choosen_prop["img"],self.pick_position_prop["x"],self.pick_position_prop["y"])
	end
end
function Scene:draw_action()
	if self.status ~= "before" then
		love.graphics.draw(self.choosen_action["img"],self.currentPersonPosition,self.pick_position_action["y"])
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
	
		self.currentPersonPosition = self.currentPersonPosition >= 631  and 640 or self.currentPersonPosition + 9
		if self.movePersonToStreet ~= true then
			self.currentPersonPosition = 440
		end
		if self.currentPersonPosition == 640 and self.movePersonToStreet then
			self.moveToStreet = true
		end 
		love.graphics.draw(self.choosen_person["img"],self.currentPersonPosition,100)
	end
end
-- end draw functions

function Scene:mousePressed(x, y, button, options)
	if self:insideRectangle(x, y, 555, 370, 75, 20) or 
		self:insideRectangle(x, y, 1, 1, 639, 299) then
		self:keyPress("return", options)
	end
end

function Scene:insideRectangle(x, y, top_l_x, top_l_y, width, height)
-- x,y are for the mouse. The other parameters describe the rectangle.
	return (x > top_l_x and x < top_l_x + width and y > top_l_y and y < top_l_y + height)
end
