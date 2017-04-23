local class = require "3rdparty/middleclass"
local tween = require "3rdparty/tween"
local lume = require "3rdparty/lume"

Street = class('Street')

function Street:initialize(advanceTo, timer)
	self.advanceTo = advanceTo
	self.timer = timer
	self.newGame = true
end

function Street:start()
	if self.newGame then
		self.newGame = false
		self.timer:reset()
	end
end


function Street:draw()
	love.graphics.print('street',0,0)
	self.timer:draw_timer()
end

function Street:update(dt)
	self.timer:count_time(dt)
end

function Street:keyPress(key)
	self.advanceTo('game')
end

function Street:mousePressed(x, y, button)
	self.advanceTo('game')
end
