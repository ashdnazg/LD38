local class = require "3rdparty/middleclass"
local tween = require '3rdparty/tween'
local lume = require '3rdparty/lume'

Endgame = class('Endgame')

function Endgame:initialize(advanceTo)
	self.advanceTo = advanceTo
end

function Endgame:start(endType)
end


function Endgame:draw()
end

function Endgame:update(dt)
end

function Endgame:keyPress(key)
	if key == ' ' or key == 'return' then
        self.advanceTo('street')
		return
    end
end

function Endgame:mousePressed(x, y, key)
	self.advanceTo('street')
end
