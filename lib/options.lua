local class = require "3rdparty/middleclass"
local tween = require "3rdparty/tween"
local lume = require "3rdparty/lume"

rand_names = {"Dave", "Jane", "George", "Ahmed", "Joacim", "Sabrina",
			"Carl", "Samantha", "Hrothgar", "Nathanel"}

-- boxes and triangles
local box_l = {1,1,1}
local box_t = {1,1,1}
local box_r = {1,1,1}

			
-- Options : build the option bar and text with it
Options = class('Options')
function Options:initialize()
    self.scene_data = nil
	
	self.Font2 = love.graphics.setNewFont("assets/font/OpenSans-Bold.ttf",16)
	self.Font1 = love.graphics.setNewFont("assets/font/OpenSans-Regular.ttf",16)
	
	self.enter_image = love.graphics.newImage("assets/img/enter.png")
	self.options_bar = love.graphics.newImage("assets/img/options_bar.png")
end

function Options:set(scene_data)
    self.scene_data  = scene_data
	self.currentLook = {4, 4, 4}
	self.currentSelection = 1
end

function Options:getChoice()
    local choice = {}
	choice[1] = self.scene_data["random_options"]["action"][self.currentLook[1]]["id"]
	choice[2] = self.scene_data["random_options"]["location"][self.currentLook[2]]["id"]
	choice[3] = self.scene_data["random_options"]["prop"][self.currentLook[3]]["id"]
	return choice
end

function Options:changeChoice(direction)
-- 'u' is up and 'd' is down. 'l' is left and 'r' is right.
	if (direction == 'u' and self.currentLook[self.currentSelection] ~= 2) then
		self.currentLook[self.currentSelection] = self.currentLook[self.currentSelection] - 1
	elseif (direction == 'd' and self.currentLook[self.currentSelection] ~= 6) then
		self.currentLook[self.currentSelection] = self.currentLook[self.currentSelection] + 1
	elseif (direction == 'r' and self.currentSelection ~= 3) then
		self.currentSelection = self.currentSelection + 1
	elseif (direction == 'l' and self.currentSelection ~= 1) then
		self.currentSelection = self.currentSelection - 1
	end
end

function Options:draw(scene_status)
    love.graphics.draw(self.options_bar,0,300)
	local start_y = 330
	if scene_status == 'middle' then
		love.graphics.setColor(0, 0, 0, 255)
		
		local data = {}
		data[1] = self.scene_data["random_options"]["action"]
		data[2] = self.scene_data["random_options"]["location"]
		data[3] = self.scene_data["random_options"]["prop"]
				
		love.graphics.setFont(self.Font1)
		love.graphics.print("We ",10, start_y)
		local width = self.Font1:getWidth("We ")
		local height = self.Font1:getHeight( )
		
		love.graphics.setFont(self.Font2)
		love.graphics.print(data[1][self.currentLook[1]]["text"] .. " ",10 + width, start_y)
		box_l[1] = width + 8
		box_t[1] = start_y + 2
		width = width + self.Font2:getWidth(data[1][self.currentLook[1]]["text"] .. " ")
		box_r[1] = width + 8
		
	--	love.graphics.setFont(self.Font1)
	--	love.graphics.print("together ",10 + width, start_y)
	--	width = width + self.Font1:getWidth("together ")
		
	--	love.graphics.setFont(self.Font2)
		if width + self.Font2:getWidth(data[2][self.currentLook[2]]["text"]) > 630 then
			width = 0
			start_y = start_y + height
		end
		love.graphics.print(data[2][self.currentLook[2]]["text"],10 + width, start_y)
		box_l[2] = width + 8
		box_t[2] = start_y + 2
		width = width + self.Font2:getWidth(data[2][self.currentLook[2]]["text"])
		box_r[2] = width + 8
		
		love.graphics.setFont(self.Font1)
		love.graphics.print(", ",10 + width, start_y)
		width = width + self.Font1:getWidth(", ")
		
		love.graphics.setFont(self.Font2)
		if width + self.Font2:getWidth(data[3][self.currentLook[3]]["text"]) > 630 then
			width = 0
			start_y = start_y + height
		end
		love.graphics.print(data[3][self.currentLook[3]]["text"],10 + width, start_y)
		box_l[3] = width + 8
		box_t[3] = start_y + 2
		width = width + self.Font2:getWidth(data[3][self.currentLook[3]]["text"])
		box_r[3] = width + 8
		
		love.graphics.setFont(self.Font1)
		love.graphics.print(".",10 + width, start_y)	
		
		love.graphics.setColor(252, 20, 20, 255)
	-- box around current selection
		love.graphics.rectangle("line", box_l[self.currentSelection], box_t[self.currentSelection]-1,
									box_r[self.currentSelection]-box_l[self.currentSelection], height)
	-- top choosing triangle
		love.graphics.polygon("fill", (box_r[self.currentSelection]+box_l[self.currentSelection])/2-3, box_t[self.currentSelection]-3,
									(box_r[self.currentSelection]+box_l[self.currentSelection])/2+3, box_t[self.currentSelection]-3,
									(box_r[self.currentSelection]+box_l[self.currentSelection])/2, box_t[self.currentSelection]-7)
	-- bottom choosing triangle
		love.graphics.polygon("fill", (box_r[self.currentSelection]+box_l[self.currentSelection])/2-3, box_t[self.currentSelection]+height+3,
									(box_r[self.currentSelection]+box_l[self.currentSelection])/2+3, box_t[self.currentSelection]+height+3,
									(box_r[self.currentSelection]+box_l[self.currentSelection])/2, box_t[self.currentSelection]+height+7)
	-- right choosing triangle
		love.graphics.polygon("fill", box_r[self.currentSelection]+3, box_t[self.currentSelection]+height/2-3,
									box_r[self.currentSelection]+3, box_t[self.currentSelection]+height/2+3,
									box_r[self.currentSelection]+7, box_t[self.currentSelection]+height/2)
	-- left choosing triangle
		love.graphics.polygon("fill", box_l[self.currentSelection]-3, box_t[self.currentSelection]+height/2-3,
									box_l[self.currentSelection]-3, box_t[self.currentSelection]+height/2+3,
									box_l[self.currentSelection]-7, box_t[self.currentSelection]+height/2)
	
	-- other selection options
		love.graphics.setColor(0, 0, 0, 170)
		love.graphics.setFont(self.Font2)
		love.graphics.print(data[self.currentSelection][self.currentLook[self.currentSelection]-1]["text"],box_l[self.currentSelection],
							box_t[self.currentSelection]-height-6)
		love.graphics.print(data[self.currentSelection][self.currentLook[self.currentSelection]+1]["text"],box_l[self.currentSelection],
							box_t[self.currentSelection]+height+6)
				
	elseif scene_status == 'before' then
		love.graphics.setColor(0, 0, 0, 255)
		local person_b = self.scene_data["person"]["text_b"]
		love.graphics.setFont(self.Font1)
		love.graphics.print("???: " .. person_b,10, start_y)
		local height = self.Font1:getHeight( )
		love.graphics.setFont(self.Font2)
		love.graphics.print("You: ummm....",10, start_y + height)
		self.name_chosen = false
		self.rand_name = ""
	elseif scene_status == 'after' then
		love.graphics.setColor(0, 0, 0, 255)
		local person_a = self.scene_data["person"]["text_a"]
		if self.name_chosen == false then
			self.rand_name = rand_names[math.random(1,#rand_names)]
			self.name_chosen = true
		end
		love.graphics.setFont(self.Font1)
		love.graphics.print(self.rand_name .. ": " .. person_a,10, start_y)

	end
	
-- reset colour
	love.graphics.setColor(255, 255, 255, 255)
	love.graphics.draw(self.enter_image, 555, 370)
end

function Options:mousePressed(x, y, button)
	local width = self.Font1:getWidth("We ")
	local height = self.Font1:getHeight( )
	
	-- first three are moving between the different parts
	if self:insideRectangle(x, y, box_l[1], box_t[1]-1,	box_r[1]-box_l[1], height) then
		self.currentSelection = 1
	elseif self:insideRectangle(x, y, box_l[2], box_t[2]-1,	box_r[2]-box_l[2], height) then
		self.currentSelection = 2
	elseif self:insideRectangle(x, y, box_l[3], box_t[3]-1,	box_r[3]-box_l[3], height) then
		self.currentSelection = 3
	-- next twp move the options up or down
	elseif self:insideRectangle(x, y, box_l[self.currentSelection], box_t[self.currentSelection]-8-height,
								box_r[self.currentSelection]-box_l[self.currentSelection], height+7) then
		self:changeChoice('u')
	elseif self:insideRectangle(x, y, box_l[self.currentSelection], box_t[self.currentSelection]+1+height,
								box_r[self.currentSelection]-box_l[self.currentSelection], height+7) then
		self:changeChoice('d')
	end
end

function Options:insideRectangle(x, y, top_l_x, top_l_y, width, height)
-- x,y are for the mouse. The other parameters describe the rectangle.
	return (x > top_l_x and x < top_l_x + width and y > top_l_y and y < top_l_y + height)
end