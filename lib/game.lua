local class = require "3rdparty/middleclass"
local tween = require "3rdparty/tween"
local lume = require "3rdparty/lume"

Game = class('Game')

local GLASS_RADIUS = 30


local function glassStencil()
	local x, y = love.mouse.getPosition()
	love.graphics.circle("fill", x, y, 50)
end



function Game:initialize(endsReached, advanceToEndgame)
	self.advanceToEndgame = advanceToEndgame
	self.endsReached = endsReached
	self.scene = Scene:new()
end

function Game:start()
end


function Game:draw()
	self.scene:start()
	love.graphics.stencil(glassStencil, "replace", 1)
	love.graphics.setStencilTest("greater", 0)
	-- draw background
	self.scene:draw_location();
	-- draw prop
	self.scene:draw_prop();
	love.graphics.setStencilTest()
	-- draw person
	self.scene:draw_person();
	love.graphics.setStencilTest("greater", 0)
	-- draw action
	self.scene:draw_action();
	love.graphics.setStencilTest()
	-- draw menu
	-- draw glass / mouse
end

function Game:update(dt)

end

function Game:keyPress(key)

end

function Game:mousePressed(x, y, button)

end
