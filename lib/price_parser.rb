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

	def self.top_impactful
		#content
		#date
		#change in eth
		#change in usd

		tweets = JSON.parse(File.read("../data/twitter/twitter.json"))

		eligible = tweets.select {|t| t["impacts"]}

		top = {}

		top_ten_min = eligible.sort_by do |t| 
			if t["impacts"][0]
				t["impacts"][0]["eth"].abs
			else
				0
			end
		end.reverse[0..9].map do |t|
			entry = {}
			entry["content"] = t["rawContent"]
			entry["id"] = t["id"]
			entry["date"] = t["date"]
			entry["eth_delta"] = t["impacts"][0]["eth"]
			entry["usd_delta"] = t["impacts"][0]["usd"]
			entry
		end

		top_hour = eligible.sort_by do |t| 
			if t["impacts"][1]
				t["impacts"][1]["eth"].abs
			else
				0
			end
		end.reverse[0..9].map do |t|
			entry = {}
			entry["content"] = t["rawContent"]
			entry["id"] = t["id"]
			entry["date"] = t["date"]
			entry["eth_delta"] = t["impacts"][1]["eth"]
			entry["usd_delta"] = t["impacts"][1]["usd"]
			entry
		end

		top_day = eligible.sort_by do |t| 
			if t["impacts"][2]
				t["impacts"][2]["eth"].abs
			else
				0
			end
		end.reverse[0..9].map do |t|
			entry = {}
			entry["content"] = t["rawContent"]
			entry["id"] = t["id"]
			entry["date"] = t["date"]
			entry["eth_delta"] = t["impacts"][2]["eth"]
			entry["usd_delta"] = t["impacts"][2]["usd"]
			entry
		end

		top_week = eligible.sort_by do |t| 
			if t["impacts"][3]
				t["impacts"][3]["eth"].abs
			else
				0
			end
		end.reverse[0..9].map do |t|
			entry = {}
			entry["content"] = t["rawContent"]
			entry["date"] = t["date"]
			entry["id"] = t["id"]
			begin
				entry["eth_delta"] = t["impacts"][3]["eth"]
			rescue
				entry["eth_delta"] = 0
			end
			begin
				entry["usd_delta"] = t["impacts"][3]["eth"]
			rescue
				entry["usd_delta"] = 0
			end
			entry
		end
		


		File.write("top_impactful.json", JSON.pretty_generate([top_ten_min: top_ten_min, top_hour: top_hour, top_day: top_day, top_week: top_week]))





	end

	def self.fix_data
		prices = JSON.parse(File.read("../src/data/worldcoin_prices.json"))
		last_eth_price = 0
		last_usd_price = 0
		prices.each_with_index do |price,i|
			eth_price = price["price_eth"]
			if price["price_usd"] == 0.0
				prices[i]["price_usd"] = eth_price / last_eth_price * last_usd_price
			end

			last_eth_price = eth_price
			last_usd_price = price["price_usd"]
		end
		File.write("new_prices.json", prices.to_json)
	end

	def self.add_tags
		tags = JSON.parse(File.read("../data/twitter/tags.json"))
		tweets = JSON.parse(File.read("../data/twitter/twitter.json"))

		tags.each do |tag|
			id = tag[0]
			tweets.each_with_index do |tw, i|
				if  tw["id"] == id #||tw["id_str"] == id.to_s
					tweets[i]["tags"] = tag[1].strip
				end
			end
		end

		# binding.pry

		File.write("tagged.json", JSON.pretty_generate(tweets))

		tags
	end

	def self.pie_chart
		tags = ["Misc", "Partnerships", "In Person Events", "Hack/Exploits", "New Features", "Initial Hack/Exploit Announcement", "Tokenomics"]

		tag_counts = {}

		tweets = JSON.parse(File.read("tagged.json"))

		tweets.each do |tw|
			if tw["tags"]
				tags.each do |tag|
					tw_tags = tw["tags"]
					if tw["tags"].downcase.include? tag.downcase
						tag_counts[tag] ||= 0
						tag_counts[tag] += 1
					end
				end
			end
		end

		p tag_counts



	end



	# \n\nThe Technical News tag is news about protocol changes or changes in underlying tech stack or blockchain. The In Person Events tag is news about in-person events such as meetups, hackathons or conferences. The Partnerships tag is News about partnerships with other companies or protocols. The Initial Hack/Exploit Announcement tag is News announcing or aknowledging that a hack has taken place. The Hack/Exploits tag is news updating on a current exploit/hack situation. The Tokenomics tag is news about changes in a token's economics, such as revenue sharing plans, vesting schedules, community incentives. The New Features tag is news about major version updates and large updates to the product. Misc is anything that doesn't fit into the above tags. \n\nClassify the following text from Worldcoin's twitter account with one or more of above mentioned tags. In your response only include the tags.\nRT @10. @sama - Co-Founder of Worldcoin and @OpenAII CEO, discussed the growth in Asia and the power of AI\n\nhttps://t.co/UAV18E2f37 https://t.co/ZK569mlCei",

	def self.gpt_prompts
		messages = JSON.parse(File.read("../data/discord/tweets.json"))
		first_price_timestamp = 1690197167

		prompts = []
		ids = []

		prefix = "The following listsclassification tags and descriptions of the tags that classify social media posts made by cryptocurrency companies. 

The Technical News tag is news about protocol changes or changes in underlying tech stack or blockchain. The In Person Events tag is news about in-person events such as meetups, hackathons or conferences. The Partnerships tag is News about partnerships with other companies or protocols. The Initial Hack/Exploit Announcement tag is News announcing or aknowledging that a hack has taken place. The Hack/Exploits tag is news updating on a current exploit/hack situation. The Tokenomics tag is news about changes in a token's economics, such as revenue sharing plans, vesting schedules, community incentives. The New Features tag is news about major version updates and large updates to the product. Misc is anything that doesn't fit into the above tags. 

Classify the following text from Worldcoin's twitter account with one or more of above mentioned tags. In your response only include the tags."
		


		messages.each do |m|
			timestamp = DateTime.parse(m["date"]).strftime('%s').to_i
			if timestamp < first_price_timestamp
				next
			end
			prompt = prefix + "\n" + m["rawContent"]

			prompts << prompt
			ids << m["id"]
		end



		File.write("prompts.json", prompts.to_json)
		File.write("ids.json", ids.to_json)

	end

end

PriceParser.top_impactful
