local class = require "3rdparty/middleclass"
local tween = require "3rdparty/tween"
local lume = require "3rdparty/lume"

PreGame = class('PreGame')

function PreGame:initialize(advanceTo)
	self.advanceTo = advanceTo
end

function PreGame:start()

end


function PreGame:draw()
	love.graphics.print('intro',0,0)
end

function PreGame:update(dt)

end

function PreGame:keyPress(key)
	self.advanceTo('street')
end

function PreGame:mousePressed(x, y, button)
	self.advanceTo('street')
end
