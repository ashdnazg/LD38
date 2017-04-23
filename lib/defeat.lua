local class = require "3rdparty/middleclass"
local tween = require '3rdparty/tween'
local lume = require '3rdparty/lume'

Defeat = class('Defeat')

function Defeat:initialize(advanceTo)
	self.advanceTo = advanceTo
	self.image = love.graphics.newImage("assets/img/defeat.png")
end

function Defeat:start(endType)
end


function Defeat:draw()
	love.graphics.draw(self.image)
end

function Defeat:update(dt)
end

function Defeat:keyPress(key)
	if key == ' ' or key == 'return' then
        self.advanceTo('pregame')
		return
    end
end

function Defeat:mousePressed(x, y, key)
	self.advanceTo('pregame')
end
