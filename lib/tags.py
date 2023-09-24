import os
import openai
import code
openai.api_key = "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"







completion = openai.Completion.create(
  model="text-davinci-003",
  prompt="The following is a list of classification tags and a description of the tags used to classify social media posts made by cryptocurrency companies. \n\nThe Technical News tag is news about protocol changes or changes in underlying tech stack or blockchain. The In Person Events tag is news about in-person events such as meetups, hackathons or conferences. The Partnerships tag is News about partnerships with other companies or protocols. The Initial Hack/Exploit Announcement tag is News announcing or aknowledging that a hack has taken place. The Hack/Exploits tag is news updating on a current exploit/hack situation. The Tokenomics tag is news about changes in a token's economics, such as revenue sharing plans, vesting schedules, community incentives. The New Features tag is news about major version updates and large updates to the product. Misc is anything that doesn't fit into the above tags. \n\nClassify the following text from Worldcoin's twitter account with one or more of above mentioned tags. In your response only include the tags and nothing else.Looking forward to Day 2 of @token2049 &amp; today's fireside chat with Worldcoin project co-founders @sama &amp; @alexblania, hosted by @JoyceInNYC 🫡 https://t.co/c9pZqC0yL1",
  
)


response = completion.choices[0].text

