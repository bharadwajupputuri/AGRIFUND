import requests
import pandas as pd

url = "https://leetcode.com/graphql"
query = """
query {
  allQuestions {
    questionId
    frontendQuestionId
    title
    titleSlug
  }
}
"""

res = requests.post(url, json={"query": query})
data = res.json()["data"]["allQuestions"]

df = pd.DataFrame(data)
df = df.sort_values("frontendQuestionId")

df_500 = df[df["frontendQuestionId"].astype(int) <= 500]

df_500["urls"] = df_500["titleSlug"].apply(
    lambda x: f"https://leetcode.com/problems/{x}/"
)

df_500 = df_500[["frontendQuestionId", "title", "urls"]]
df_500.columns = ["Q.No", "Question Title", "urls"]

df_500.to_excel("leetcode_1_to_500_PERFECT.xlsx", index=False)
print("DONE ✅")
