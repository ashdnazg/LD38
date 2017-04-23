local class = require "3rdparty/middleclass"
local tween = require "3rdparty/tween"
local lume = require "3rdparty/lume"

Street = class('Street')

local STREET_END = 570
local STEP_SIZE = 12
local ANIM_TIME = 2

function Street:initialize(advanceTo, timer)
	self.advanceTo = advanceTo
	self.timer = timer
	self.newGame = true
	self.bg = love.graphics.newImage('assets/img/background.png')
	self.bar = love.graphics.newImage("assets/img/options_bar.png")
	self.font = love.graphics.setNewFont("assets/font/OpenSans-Regular.ttf",16)
	self.enter_image = love.graphics.newImage("assets/img/enter.png")

	self.frames = {
		stand = love.graphics.newImage('assets/img/street/man_stand_tap.png'),
		left = love.graphics.newImage('assets/img/street/man_left.png'),
		right = love.graphics.newImage('assets/img/street/man_right.png'),
		mad = love.graphics.newImage('assets/img/street/man_mad.png'),
	}

	self.droppers = {
		love.graphics.newImage('assets/img/street/damn_alien.png'),
		love.graphics.newImage('assets/img/street/damn_girl.png'),
		love.graphics.newImage('assets/img/street/damn_marry.png'),
		love.graphics.newImage('assets/img/street/damn_somo.png'),
		love.graphics.newImage('assets/img/street/damn_super.png'),
		love.graphics.newImage('assets/img/street/damn_tall_1.png'),
		love.graphics.newImage('assets/img/street/damn_tall_2.png'),
		love.graphics.newImage('assets/img/street/damn_with_parachute.png'),
	}
end

function Street:reset()
	self.newGame = false
	self.timer:reset()
	self.xPos = 0
	self.yPos = 70
	self.frame = 'stand'
	self.frameTime = 0
	self.animTime = 0
	self.dropping = nil
	self.dropSpots = {}
	self.canWalk = true
	for i = 1, math.random(3,5) do
		self.dropSpots[math.random(1, math.floor(STREET_END / STEP_SIZE)) * STEP_SIZE] = true
	end
end


function Street:start()
	if self.newGame then
		self:reset()
	end
	if not self.timer:is_game_over() then
		self.canWalk = true
		self.dropping = nil
	end
end


function Street:draw()
	love.graphics.print('street',0,0)
	love.graphics.draw(self.bg)
	love.graphics.draw(self.frames[self.frame],self.xPos,self.yPos)
	self.timer:draw_timer()
	if self.frameTime <= 0 and self.frame ~= 'stand' then
		self.frame = 'stand'
	end
	if self.dropping then
		local start = self.dir == 1 and -167 or 480
		local curY = lume.smooth(start, self.yPos + 70, 1 - self.animTime / ANIM_TIME)
		love.graphics.draw(self.droppers[self.dropping], self.xPos + 100, curY)
	end
	love.graphics.draw(self.bar,0,300)
	if self.dropping and self.animTime <= 0 then
		love.graphics.setColor(0,0,0,255)
		love.graphics.setFont(self.font)
		love.graphics.print("Hey! What a small world!",10, 330)
		love.graphics.setColor(255,255,255,255)
		love.graphics.draw(self.enter_image, 555, 370)
	end
end

function Street:update(dt)
	if self.timer:is_game_over() then
		self.advanceTo('defeat')
	end
	self.frameTime = self.frameTime - dt
	self.animTime = self.animTime - dt
	if self.canWalk then
		self.timer:count_time(dt)
	end
	if self.xPos > STREET_END and self.animTime <= 0 then
		self.advanceTo('victory')
	end
end

function Street:keyPress(key)
	if key == 'right' and self.canWalk then
		self.xPos = self.xPos + STEP_SIZE
		self.frame = self.lastFrame == 'left' and 'right' or 'left'
		self.lastFrame = self.frame
		self.frameTime = 0.1
		if self.xPos > STREET_END then
			self.canWalk = false
			self.animTime = 2
		end
		if self.dropSpots[self.xPos] then
			self.canWalk = false
			self.dropSpots[self.xPos] = nil
			self.animTime = ANIM_TIME
			self.dropping = math.random(#self.droppers)
			self.dir = math.random(1,2)
		end
	end
	if self.animTime <= 0 and key == 'return' then
		self.advanceTo('game')
	end
	if key == 's' then
		self.advanceTo('game')
	end
end

function Street:mousePressed(x, y, button)
	self.advanceTo('game')
end
