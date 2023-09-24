require 'json'
require 'pry'




class PriceParser

	def self.joiner
		all_swaps = []
		(0..13).to_a.each do |segment|
			file_name = "../data/worldcoin_prices/#{segment}.json"
			swaps = JSON.parse(File.read(file_name))["data"]["liquidityPool"]["swaps"]
			all_swaps += swaps
		end



		File.write("../data/worldcoin_prices/worldcoin_swaps.json", JSON.pretty_generate(all_swaps.reverse))

		p all_swaps.length
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

end

PriceParser.parse_swaps