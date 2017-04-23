local class = require "3rdparty/middleclass"
local tween = require '3rdparty/tween'
local lume = require '3rdparty/lume'

Victory = class('Victory')

function Victory:initialize(advanceTo, timer)
	self.advanceTo = advanceTo
	self.image = love.graphics.newImage("assets/img/victory.png")
	self.timer = timer
end

function Victory:start()
	if self.timer.end_game > self.timer.initial_end_game then
		self.timer.end_game = self.timer.end_game - self.timer.step
	end
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
