local class = require "3rdparty/middleclass"
local tween = require "3rdparty/tween"
local lume = require "3rdparty/lume"


love.graphics.setNewFont("assets/font/OpenSans-Regular.ttf",20)

-- Options : build the option bar and text with it
Options = class('Options')
function Options:initialize()
     self.scene_data = nil
end
function Options:set(scene_data)
     self.scene_data  = scene_data
	 self.currentLook = 3
end
function Options:draw_part(data,y)
	 love.graphics.setColor(0, 0, 0,70)
	 --[[if self.currentLook-2 >= 1 then
		love.graphics.print(data[self.currentLook-2]["text"],y,280)
	 end
	 ]]
	 if self.currentLook+2 <= #data then
		love.graphics.print(data[self.currentLook+2]["text"],y,380)
	 end 
	 love.graphics.setColor(0, 0, 0,170)
	 if self.currentLook-1 >= 1 then
		love.graphics.print(data[self.currentLook-1]["text"],y,300)
	 end 
	 if self.currentLook+1 <= #data then
		love.graphics.print(data[self.currentLook+1]["text"],y,360)
	 end 
	 love.graphics.setColor(0, 0, 0,255)
     love.graphics.print(data[self.currentLook]["text"],y,330)
	
	 
	 --set color after
	 love.graphics.setColor(255, 255, 255)
end
function Options:draw()
     love.graphics.draw(love.graphics.newImage("assets/img/options_bar.png"),0,300)
	 self:draw_part(self.scene_data["random_options"]["action"],10)
	 self:draw_part(self.scene_data["random_options"]["prop"],220)
	self:draw_part(self.scene_data["random_options"]["location"],430)
	
	 
end


