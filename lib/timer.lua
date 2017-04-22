-- create atime bar:
local lume = require "3rdparty/lume"
local class = require "3rdparty/middleclass"


Timer = class('Game')

local elapsed = 0
local end_game = 30



function Timer:reset()
	elapsed = 0
end

function Timer:count_time(delta_time)
	elapsed = elapsed + delta_time
end

function Timer:is_game_over()
	if elapsed > end_game then
		--	time is up
		return true
	else
		return false
	end
end

-- draws the timer rectangle
function Timer:draw_timer()	
	local max_width = 200
	
	local x = (640 - max_width) + (elapsed*max_width)/end_game
	local y = 350
	local h = 50
	local w = (elapsed*max_width)/end_game
	love.graphics.rectangle("fill", x, y, w, h )

end