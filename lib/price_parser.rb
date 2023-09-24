require 'json'
require 'pry'
require 'date'




class PriceParser

	def self.joiner
		all_swaps = []
		(0..13).to_a.each do |segment|
			file_name = "../data/worldcoin_prices/#{segment}.json"
			swaps = JSON.parse(File.read(file_name))["data"]["liquidityPool"]["swaps"]
			all_swaps += swaps
		end
		File.write("../data/worldcoin_prices/worldcoin_swaps.json", JSON.pretty_generate(all_swaps.reverse))
	end




	def self.parse_swaps
		
		worldcoin = "0x163f8c2467924be0ae7b5347228cabf260318753"
		weth = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"

		swaps = JSON.parse(File.read("../data/worldcoin_prices/worldcoin_swaps.json"))

		parsed = []

		swaps.each do |swap|
			wc_amount = 0
			price_usd = 0
			price_eth = 0
			if swap["tokenIn"]["id"] == "0x163f8c2467924be0ae7b5347228cabf260318753"
				wc_amount = swap["amountIn"].to_f / 10**18
				price_usd = swap["amountInUSD"].to_f / wc_amount
				price_eth = swap["amountOut"].to_f / swap["amountIn"].to_f
			else
				wc_amount = swap["amountOut"].to_f / 10**18
				price_usd = swap["amountOutUSD"].to_f / wc_amount
				price_eth = swap["amountIn"].to_f / swap["amountOut"].to_f
			end

			entry = {"timestamp" => swap["timestamp"], "price_usd" => price_usd, "price_eth" => price_eth}

			parsed << entry

		end
		File.write("../data/worldcoin_prices/worldcoin_prices.json", JSON.pretty_generate(parsed))
	end

	def self.get_impacts
		

		discord = JSON.parse(File.read("../src/data/discord.json"))
		messages = discord["WorldCoin"]["messages"]
		prices = JSON.parse(File.read("../data/worldcoin_prices/worldcoin_prices.json"))

		#only look at posts after the start of price data
		first_price_timestamp = 1690197167

		ten_min = 600
		hour = 3600
		day = 86400
		week = 604800


		messages.each_with_index do |m, i|
			impacts = []
			timestamp = DateTime.parse(m["timestamp"]).strftime('%s').to_i
			if timestamp < first_price_timestamp
				messages[i]["skip"] = true
				next
			end

			message_index_in_price_chart = -1
			snapshot_price = 0
			snapshot_price_in_eth = 0
			prices.each_with_index do |price, j|
				if price["timestamp"].to_i > timestamp
					message_index_in_price_chart = j
					snapshot_price = price["price_usd"]
					snapshot_price_in_eth = price["price_eth"]

					break
				end
			end

			p message_index_in_price_chart 
			p "$$$$$$$$$$$$$$"

			[ten_min, hour, day, week].each do |interval|
				impact_found = false
				prices[message_index_in_price_chart..-1].each_with_index do |price, j|
					if price["timestamp"].to_i > (timestamp + interval)
						message_index_in_price_chart = j
						impacts << {"usd" => snapshot_price - price["price_usd"], "eth" => snapshot_price_in_eth - price["price_eth"]}
						impact_found = true

						
						break
					end
				end

				if !impact_found
					impact << nil
				end

			end

			messages[i]["impacts"] = impacts
		end

		discord["messages"] = messages

		File.write("discord.json", discord.to_json)






	end




end

PriceParser.get_impacts