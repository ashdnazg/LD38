local class = require "3rdparty/middleclass"
local tween = require "3rdparty/tween"
local lume = require "3rdparty/lume"


love.graphics.setNewFont("assets/font/OpenSans-Regular.ttf",25)

-- Options : build the option bar and text with it
Options = class('Options')
function Options:initialize()
     self.scene_data = nil
end
function Options:set(scene_data)
     self.scene_data = scene_data
end
function Options:draw()
     love.graphics.draw(love.graphics.newImage("assets/img/options_bar.png"),0,300)
	-- local random_options = self.scene_data.random_options
	 love.graphics.setColor(0, 0, 0,200)
	 love.graphics.print("rrrrrrrrrrrr",10,330)
	 love.graphics.setColor(0, 0, 0,200)
     love.graphics.print("rrrrrrrrrrrr",10,330)
	 love.graphics.setColor(255, 255, 255)
	 
end


