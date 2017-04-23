local class = require "3rdparty/middleclass"
local tween = require "3rdparty/tween"
local lume = require "3rdparty/lume"

local Sounds = class('Sounds')

local voiceChosen
local voices = {}

function Sounds:initialize()
	voiceChosen = 0
	for i=1,9 do
		local ask_str = "assets/sound/ask" .. i .. ".ogg"
		local no_str  = "assets/sound/no"  .. i .. ".ogg"
		local hey_str = "assets/sound/hey" .. i .. ".ogg"
		local yes_str = "assets/sound/yes" .. i .. ".ogg"

		voices[i] = { ask = love.audio.newSource(ask_str),
					  no  = love.audio.newSource(no_str),
					  hey = love.audio.newSource(hey_str),
					  yes = love.audio.newSource(yes_str) }
    end
end

function Sounds:changeVoice()
	local previousVoice = voiceChosen
	while voiceChosen == previousVoice do
		voiceChosen = math.random(1, #voices)
	end
end

function Sounds:ask()
	voices[voiceChosen]["ask"]:setVolume(0.7)
    voices[voiceChosen]["ask"]:setLooping(false)
    voices[voiceChosen]["ask"]:play()
end

function Sounds:no()
	voices[voiceChosen]["no"]:setVolume(0.7)
    voices[voiceChosen]["no"]:setLooping(false)
    voices[voiceChosen]["no"]:play()
end

function Sounds:hey()
	voices[voiceChosen]["hey"]:setVolume(0.7)
    voices[voiceChosen]["hey"]:setLooping(false)
    voices[voiceChosen]["hey"]:play()
end

function Sounds:yes()
	voices[voiceChosen]["yes"]:setVolume(0.7)
    voices[voiceChosen]["yes"]:setLooping(false)
    voices[voiceChosen]["yes"]:play()
end

function Sounds:isPlaying()
	return voices[voiceChosen]["ask"]:isPlaying() or
	       voices[voiceChosen]["no"]:isPlaying() or
	       voices[voiceChosen]["hey"]:isPlaying() or
	       voices[voiceChosen]["yes"]:isPlaying()
end

return Sounds:new()