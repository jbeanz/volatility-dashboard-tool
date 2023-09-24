require 'json'
require 'pry'


file = File.read ARGV[0]



json = JSON.parse(file)
swaps = json["data"]["liquidityPool"]["swaps"]
next_ts = json["data"]["liquidityPool"]["swaps"].last["timestamp"].to_i


p "Length: #{swaps.length}"
p "Next: #{next_ts}"

