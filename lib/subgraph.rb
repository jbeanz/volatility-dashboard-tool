class Subgraphs

	def self.get_swaps pool, first, last_timestamp

		query ="{
			liquidityPool(id: \"#{pool}\") {
	      swaps(where: {timestamp_lt: #{last_timestamp}}, orderBy: timestamp, orderDirection: desc, first: #{first}) {
		      hash
		      timestamp
		      tokenIn {
		        id
		      }
		      amountIn
		      amountInUSD
		      tokenOut {
		        id
		      }
		      amountOut
		      amountOutUSD
		      account {
		        id
		      }
	  	  }
	    }
		}"
	  

	  url = "https://gateway.thegraph.com/api/a71c43d5fea867b8c78ddb9f967dec9b/subgraphs/id/ELUcwgpm14LKPLrBRuVvPvNKHQ9HvwmtKgKSH6123cr7"


	  # https://thegraph.com/hosted-service/subgraph/uniswap/uniswap-v3

	  response = HTTParty.post(url, headers: { 
	    'Content-Type'  => 'application/json'
	  },
	  body: { 
	    query: query
	  }.to_json,
	  timeout: 5)


	  parsed_response = JSON.parse(response.body)["data"]["liquidityPool"]["swaps"]
	  {data: parsed_response, next: parsed_response.last["timestamp"]}
	end

	def self.get_all_swaps pool

		response_count = 1001
		last_timestamp = Time.now.to_i
		all_swaps = []

		until response_count < 1000 
			begin
				swaps = get_swaps pool, 1000, last_timestamp
				response_count = swaps[:data].length
				last_timestamp = swaps[:next]
				all_swaps += swaps[:data]
				p response_count
			rescue 
				p "timeout"
				break
			end
		end
		File.write("worldcoin.json", all_swaps.to_json)
		all_swaps
	end

end