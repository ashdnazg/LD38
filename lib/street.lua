local class = require "3rdparty/middleclass"
local tween = require "3rdparty/tween"
local lume = require "3rdparty/lume"

Street = class('Street')

function Street:initialize(advanceTo, timer)
	self.advanceTo = advanceTo
	self.timer = timer
	self.newGame = true
	self.bg = love.graphics.newImage('assets/img/background.png')
	self.bar = love.graphics.newImage("assets/img/options_bar.png")


	self.frames = {
		stand = love.graphics.newImage('assets/img/street/man_stand_tap.png'),
		left = love.graphics.newImage('assets/img/street/man_left.png'),
		right = love.graphics.newImage('assets/img/street/man_right.png'),
		mad = love.graphics.newImage('assets/img/street/man_mad.png'),
	}
end

function Street:reset()
	self.newGame = false
	self.timer:reset()
	self.xPos = 0
	self.yPos = 70
	self.frame = 'stand'
	self.frameTime = 0
end


function Street:start()
	if self.newGame then
		self:reset()
	end
end


function Street:draw()
	love.graphics.print('street',0,0)
	love.graphics.draw(self.bg)
	love.graphics.draw(self.bar,0,300)
	love.graphics.draw(self.frames[self.frame],self.xPos,self.yPos)
	self.timer:draw_timer()
	if self.frameTime <= 0 and self.frame ~= 'stand' then
		self.frame = 'stand'
	end
end

function Street:update(dt)
	self.frameTime = self.frameTime - dt
	self.timer:count_time(dt)
end

function Street:keyPress(key)
	if key == 'right' then
		self.xPos = self.xPos + 12
		self.frame = self.lastFrame == 'left' and 'right' or 'left'
		self.lastFrame = self.frame
		self.frameTime = 0.1
	end
	if key == 's' then
		self.advanceTo('game')
	end
end

function Street:mousePressed(x, y, button)
	self.advanceTo('game')
end
