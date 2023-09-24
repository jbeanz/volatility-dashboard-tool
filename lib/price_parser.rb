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
		

		messages = JSON.parse(File.read("../data/discord/tweets.json"))
		prices = JSON.parse(File.read("../data/worldcoin_prices/worldcoin_prices.json"))

		#only look at posts after the start of price data
		first_price_timestamp = 1690197167

		ten_min = 600
		hour = 3600
		day = 86400
		week = 604800



		messages.each_with_index do |m, i|
			impacts = []
			timestamp = DateTime.parse(m["date"]).strftime('%s').to_i
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
					impacts << nil
				end

			end
			messages[i]["impacts"] = impacts
		end

		File.write("twitter.json", messages.to_json)
	end

	def self.gpt_prompts
		messages = JSON.parse(File.read("../data/discord/tweets.json"))
		first_price_timestamp = 1690197167

		prompts = []
		ids = []

		prefix = "The following is a list of classification tags and a description of the tags used to classify social media posts made by cryptocurrency companies. 

The Technical News tag is news about protocol changes or changes in underlying tech stack or blockchain. The In Person Events tag is news about in-person events such as meetups, hackathons or conferences. The Partnerships tag is News about partnerships with other companies or protocols. The Initial Hack/Exploit Announcement tag is News announcing or aknowledging that a hack has taken place. The Hack/Exploits tag is news updating on a current exploit/hack situation. The Tokenomics tag is news about changes in a token's economics, such as revenue sharing plans, vesting schedules, community incentives. The New Features tag is news about major version updates and large updates to the product. Misc is anything that doesn't fit into the above tags. 

Classify the following text from Worldcoin's twitter account with one or more of above mentioned tags. In your response only include the tags and nothing else."
		


		messages.each do |m|
			timestamp = DateTime.parse(m["date"]).strftime('%s').to_i
			if timestamp < first_price_timestamp
				next
			end
			prompt = prefix + "\n" + m["rawContent"]

			prompts << prompt
			ids << m["id"]
		end

		binding.pry

		File.write("prompts.json", prompts.to_json)

	end

end

PriceParser.gpt_prompts
