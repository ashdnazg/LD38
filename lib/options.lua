local class = require "3rdparty/middleclass"
local tween = require "3rdparty/tween"
local lume = require "3rdparty/lume"


-- Options : build the option bar and text with it
Options = class('Options')
function Options:initialize()
    self.scene_data = nil
	
	self.Font2 = love.graphics.setNewFont("assets/font/OpenSans-Bold.ttf",20)
	self.Font1 = love.graphics.setNewFont("assets/font/OpenSans-Regular.ttf",20)
end

function Options:set(scene_data)
    self.scene_data  = scene_data
	self.currentLook = {3, 3, 3}
	self.currentSelection = 3
end

function Options:draw()
    love.graphics.draw(love.graphics.newImage("assets/img/options_bar.png"),0,300)
	love.graphics.setColor(0, 0, 0, 255)
	local start_y = 330
	
	local action_data = self.scene_data["random_options"]["action"]
	local prop_data   = self.scene_data["random_options"]["prop"]
	local loc_data    = self.scene_data["random_options"]["location"]
	
	local box_l = {}
	local box_t = {}
	local box_r = {}
	
	love.graphics.setFont(self.Font1)
	love.graphics.print("We ",10, start_y)
	local width = self.Font1:getWidth("We ")
	local height = self.Font1:getHeight( )
	
	love.graphics.setFont(self.Font2)
	love.graphics.print(action_data[self.currentLook[1]]["text"] .. " ",10 + width, start_y)
	box_l[1] = width + 8
	box_t[1] = start_y + 2
	width = width + self.Font2:getWidth(action_data[self.currentLook[1]]["text"] .. " ")
	box_r[1] = width + 8
	
	love.graphics.setFont(self.Font1)
	love.graphics.print("together ",10 + width, start_y)
	width = width + self.Font1:getWidth("together ")
	
	love.graphics.setFont(self.Font2)
	if width + self.Font2:getWidth(loc_data[self.currentLook[2]]["text"]) > 630 then
		width = 0
		start_y = start_y + height
	end
	love.graphics.print(loc_data[self.currentLook[2]]["text"],10 + width, start_y)
	box_l[2] = width + 8
	box_t[2] = start_y + 2
	width = width + self.Font2:getWidth(loc_data[self.currentLook[2]]["text"])
	box_r[2] = width + 8
	
	love.graphics.setFont(self.Font1)
	love.graphics.print(", ",10 + width, start_y)
	width = width + self.Font1:getWidth(", ")
	
	love.graphics.setFont(self.Font2)
	if width + self.Font2:getWidth(prop_data[self.currentLook[3]]["text"]) > 630 then
		width = 0
		start_y = start_y + height
	end
	love.graphics.print(prop_data[self.currentLook[3]]["text"],10 + width, start_y)
	box_l[3] = width + 8
	box_t[3] = start_y + 2
	width = width + self.Font2:getWidth(prop_data[self.currentLook[3]]["text"])
	box_r[3] = width + 8
	
	love.graphics.setFont(self.Font1)
	love.graphics.print(".",10 + width, start_y)	
	
	love.graphics.setColor(252, 20, 20, 255)
	love.graphics.rectangle("line", box_l[self.currentSelection], box_t[self.currentSelection]-1,
								box_r[self.currentSelection]-box_l[self.currentSelection], height)
	love.graphics.setColor(255, 255, 255, 255)
end
