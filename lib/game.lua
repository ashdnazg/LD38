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
end

function Game:start()
end
local bg = love.graphics.newImage("assets/img/background.png")
local wg = love.graphics.newImage("assets/img/desert_island.png")

function Game:draw()
	love.graphics.draw(bg)
	love.graphics.stencil(glassStencil, "replace", 1)
	love.graphics.setStencilTest("greater", 0)
	-- draw background
	love.graphics.draw(wg)
	-- draw prop
	love.graphics.setStencilTest()
	-- draw person
	love.graphics.setStencilTest("greater", 0)
	-- draw action
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
