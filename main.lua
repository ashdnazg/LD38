math.randomseed(os.time())
math.random()

require 'lib/game'
require 'lib/victory'
require 'lib/defeat'
require 'lib/pregame'
require 'lib/scene'
require 'lib/options'
require 'lib/timer'
require 'lib/street'

local state
local states = {}
local timer


local function advanceTo(newState)
	if newState == 'defeat' or newState == 'victory' then
		states.street.newGame = true
	end
	state = newState
	love.graphics.setColor(255, 255, 255, 255)
	states[newState]:start()
end

local function init()
	local music = love.audio.newSource("assets/sound/music.ogg", "stream")
	music:setVolume(0.4)
	music:setLooping(true)
	music:play()
	timer = Timer:new()
	states.game = Game:new(advanceTo, timer)
	states.defeat = Defeat:new(advanceTo)
	states.victory = Victory:new(advanceTo)
	states.pregame = PreGame:new(advanceTo)
	states.street = Street:new(advanceTo, timer)
	advanceTo('pregame')
end

function love.load()
	init()
end

function love.update(dt)
	states[state]:update(dt)
end

function love.keypressed(key)
	states[state]:keyPress(key)
end

function love.mousepressed(x, y, button)
	states[state]:mousePressed(x, y, button)
end

function love.draw()
	states[state]:draw()
end

function love.wheelmoved(x, y)
	if states[state].wheelmoved then
		states[state]:wheelmoved(x,y)
	end
end