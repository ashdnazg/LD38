-- create atime bar:
local lume = require "3rdparty/lume"
local class = require "3rdparty/middleclass"


clockImage = love.graphics.newImage("assets/img/clock.png")

Timer = class('Game')

function Timer:initialize()
	self.elapsed = 0
	self.end_game = 30
end
	
function Timer:reset()
	self.elapsed = 0
end

function Timer:count_time(delta_time)
	self.elapsed = self.elapsed + delta_time
end

function Timer:is_game_over()
	return self.elapsed > self.end_game
end

-- draws the timer rectangle
function Timer:draw_timer()	
	local max_width = 150
	local start_x = 640 - max_width - 20
	local y = 20
	local h = 25
	local w = math.min((self.elapsed/self.end_game)*max_width,max_width)

	love.graphics.setColor(252, 20, 20, 255)
	love.graphics.rectangle("line", start_x, y, max_width, h )
	love.graphics.setColor(255, 255, 255, 255)
	love.graphics.rectangle("fill", start_x+1, y+1, max_width-2, h-2)
	love.graphics.setColor(252, 20, 20, 255)
	love.graphics.rectangle("fill", start_x, y, w, h )
	love.graphics.setColor(255, 255, 255, 255)
	love.graphics.draw(clockImage,590,0)
end