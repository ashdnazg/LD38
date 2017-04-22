math.randomseed(os.time())
math.random()

require 'lib/game'
require 'lib/endgame'
require 'lib/pregame'
require 'lib/scene'
require 'lib/options'
local state, game, endgame, pregame



--TODO: nice transitions or something
local function advanceToGame()
	state = 'ingame'
	love.graphics.setColor(255, 255, 255, 255)
	game:start()
end

local function advanceToPreGame()
	state = 'pregame'
	love.graphics.setColor(255, 255, 255, 255)
	pregame:start()
end

local function advanceToEndgame()
	state = 'endgame'
	love.graphics.setColor(255, 255, 255, 255)
	endgame:start()
end

local function init()
	local music = love.audio.newSource("assets/sound/music.ogg", "stream")
	music:setVolume(0.2)
	music:setLooping(true)
	music:play()
	state = 'ingame'
	game = Game:new(endsReached, advanceToEndgame)
	endgame = Endgame:new(endsReached, advanceToPreGame)
	pregame = PreGame:new(endsReached, advanceToGame)
	advanceToPreGame()
end

function love.load()
	init()
end

function love.update(dt)
	if state == 'ingame' then
		game:update(dt)
	elseif state == 'endgame' then
		endgame:update(dt)
	elseif state == 'pregame' then
		pregame:update(dt)
	end
end

function love.keypressed(key)
	if state == 'ingame' then
		game:keyPress(key)
	elseif state == 'endgame' then
		endgame:keyPress(key)
	elseif state == 'pregame' then
		pregame:keyPress(key)
	end
end

function love.mousepressed(x, y, button)
	if state == "ingame" then
		game:mousePressed(x, y, button)
	elseif state == 'endgame' then
		endgame:mousePressed(x, y, button)
	elseif state == 'pregame' then
		pregame:mousePressed(x, y, button)
	end
end

function love.draw()
	if state == 'ingame' then
		game:draw()
	elseif state == "endgame" then
		endgame:draw()
	elseif state == 'pregame' then
		pregame:draw()
	end
end
