local class = require "3rdparty/middleclass"
local tween = require '3rdparty/tween'
local lume = require '3rdparty/lume'

Victory = class('Victory')

function Victory:initialize(advanceTo)
	self.advanceTo = advanceTo
	self.image = love.graphics.newImage("assets/img/victory.png")
end

function Victory:start(endType)
end


function Victory:draw()
	love.graphics.draw(self.image)
end

function Victory:update(dt)
end

function Victory:keyPress(key)
	if key == ' ' or key == 'return' then
        self.advanceTo('pregame')
		return
    end
end

function Victory:mousePressed(x, y, key)
	self.advanceTo('pregame')
end
