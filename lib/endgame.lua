local class = require "3rdparty/middleclass"
local tween = require '3rdparty/tween'
local lume = require '3rdparty/lume'

Endgame = class('Endgame')

function Endgame:initialize(endsReached, advanceToGame)
	self.advanceToGame = advanceToGame
	self.endsReached = endsReached
end

function Endgame:start(endType)
end


function Endgame:draw()
end

function Endgame:update(dt)
end

function Endgame:keyPress(key)
	if key == ' ' or key == 'return' then
        self.advanceToGame()
		return
    end
end

function Endgame:mousePressed(x, y, key)
	self.advanceToGame()
end
