local class = require "3rdparty/middleclass"
local tween = require "3rdparty/tween"
local lume = require "3rdparty/lume"


Game = class('Game')
local GLASS_RADIUS = 50


local function glassStencil()
	local x, y = love.mouse.getPosition()
	love.graphics.circle("fill", x, y, GLASS_RADIUS)
end



function Game:initialize(advanceTo, timer, scene)
	self.advanceTo = advanceTo
	self.scene = scene
	self.options = Options:new()
	self.timer = timer
end

function Game:start()
-- start new stage (crzy peorson again...)
	self.scene:start()
	self.scene:before()
	self.options:set(self.scene:get())
	love.mouse.setPosition(200,200)
end


function Game:draw()
	if self.scene.status ~= after then
		love.graphics.stencil(glassStencil, "replace", 1)
		love.graphics.setStencilTest("greater", 0)
	end
	-- draw background
	self.scene:draw_location();
	-- draw prop
	self.scene:draw_prop();
	if self.scene.status ~= after then
		love.graphics.setStencilTest()
	end
	-- draw person
	self.scene:draw_person();
	if self.scene.status ~= after then
		love.graphics.setStencilTest("greater", 0)
	end
	-- draw action
	self.scene:draw_action();
	if self.scene.status ~= after then
		love.graphics.setStencilTest()
	end
	-- draw menu
	self.options:draw(self.scene.status)
	self.timer:draw_timer()
end

function Game:update(dt)
	local curr_phase = self.scene:getPhase()
	if curr_phase == "middle" then
		self.timer:count_time(dt)
	end
	if self.timer:is_game_over() then
		self.advanceTo('defeat')
	end
end

function Game:keyPress(key)
	isCorrect = self.scene:keyPress(key, self.options)
	if isCorrect then
		self.advanceTo("street")
	end
end

function Game:mousePressed(x, y, button)
	self.options:mousePressed(x, y, button)
	self.scene:mousePressed(x,y,button, self.options)
end

function Game:wheelmoved(x,y)
	if y > 0 then
		self:keyPress("up")
	elseif y < 0 then
		self:keyPress("down")
	end
end