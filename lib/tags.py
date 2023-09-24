import os
import openai
openai.api_key = "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"

completion = openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"}
  ]
)

print(completion.choices[0].message)