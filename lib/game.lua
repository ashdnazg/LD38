local class = require "3rdparty/middleclass"
local tween = require "3rdparty/tween"
local lume = require "3rdparty/lume"

Game = class('Game')


function Game:initialize(endsReached, advanceToEndgame)
	self.advanceToEndgame = advanceToEndgame
	self.endsReached = endsReached
end

function Game:start()
end

function Game:draw()
end

function Game:update(dt)

end

function Game:keyPress(key)

end

function Game:mousePressed(x, y, button)

end
